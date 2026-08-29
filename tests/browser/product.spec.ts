import AxeBuilder from '@axe-core/playwright'
import { expect, test } from 'playwright/test'

function wavBuffer(seconds = 1, sampleRate = 8000) {
  const samples = seconds * sampleRate
  const buffer = Buffer.alloc(44 + samples * 2)
  buffer.write('RIFF', 0)
  buffer.writeUInt32LE(36 + samples * 2, 4)
  buffer.write('WAVEfmt ', 8)
  buffer.writeUInt32LE(16, 16)
  buffer.writeUInt16LE(1, 20)
  buffer.writeUInt16LE(1, 22)
  buffer.writeUInt32LE(sampleRate, 24)
  buffer.writeUInt32LE(sampleRate * 2, 28)
  buffer.writeUInt16LE(2, 32)
  buffer.writeUInt16LE(16, 34)
  buffer.write('data', 36)
  buffer.writeUInt32LE(samples * 2, 40)
  for (let index = 0; index < samples; index++) {
    buffer.writeInt16LE(Math.round(Math.sin((index / sampleRate) * Math.PI * 2 * 220) * 10000), 44 + index * 2)
  }
  return buffer
}

async function importTone(page: import('playwright/test').Page) {
  await page.locator('#hero-file').setInputFiles({ name: 'one-second-tone.wav', mimeType: 'audio/wav', buffer: wavBuffer() })
  await expect(page.locator('.clip-strip b')).toHaveText('one-second-tone')
}

async function saveTone(page: import('playwright/test').Page, name = 'One second tone') {
  await page.locator('#card-name').fill(name)
  await page.locator('#card-note').fill('Hear the steady pitch.')
  await page.locator('#card-form button').click()
  await expect(page.locator('.card-open', { hasText: name })).toBeVisible()
}

test('@claim:offline-reload works offline after the first demo visit', async ({ page, context }) => {
  await page.goto('/?demo=1')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Try a four-bar practice beat.')
  await page.evaluate(async () => { await navigator.serviceWorker.ready })
  if (!(await page.evaluate(() => Boolean(navigator.serviceWorker.controller)))) await page.reload()
  await context.setOffline(true)
  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Try a four-bar practice beat.')
})

test('@claim:demo-isolated @claim:no-account keeps sample data separate and discards it on exit', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Try it with sample data' }).click()
  await expect(page).toHaveURL(/\?demo=1$/)
  await expect(page.locator('#route-announcer')).toHaveText('Opened Demo — Loop Lab.')
  await expect(page.getByText('Demo — sample data, nothing is saved to your real data.')).toBeVisible()
  await page.locator('#card-name').fill('Demo only')
  await page.locator('#card-note').fill('Listen to the offbeat.')
  await page.locator('#card-form button').click()
  await expect(page.locator('.card-open', { hasText: 'Demo only' })).toBeVisible()
  await page.getByRole('link', { name: 'Start for real' }).click()
  await expect(page).toHaveURL('/')
  await expect(page.locator('.card-open', { hasText: 'Demo only' })).toHaveCount(0)
  await page.goto('/?demo=1')
  await expect(page.locator('.card-open', { hasText: 'Kick + bass pocket' })).toBeVisible()
  await expect(page.locator('.card-open', { hasText: 'Demo only' })).toHaveCount(0)
})

test('@claim:demo-four-bars opens the isolated four-bar sample from ?demo=1', async ({ page }) => {
  await page.goto('/?demo=1')
  await expect(page.getByText('Demo — sample data, nothing is saved to your real data.')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Reset demo' })).toBeVisible()
  await expect(page.locator('.clip-strip b')).toHaveText('Night bus · four-bar beat')
  await expect(page.locator('.clip-strip small')).toHaveText('0:08.0 total · sample audio')
  await expect(page.locator('.card-open', { hasText: 'Kick + bass pocket' })).toContainText('120 BPM')
})

test('@claim:cards-local saves audio and reopens its saved loop after refresh', async ({ page }) => {
  await page.goto('/')
  await importTone(page)
  await page.locator('#bpm').fill('999')
  await page.locator('#bpm').blur()
  await saveTone(page)
  await expect(page.locator('.card-open', { hasText: 'One second tone' })).toContainText('300 BPM')
  await page.reload()
  await expect(page.locator('.clip-strip b')).toHaveText('one-second-tone')
  await expect(page.locator('.card-open', { hasText: 'One second tone' })).toBeVisible()
  await page.locator('.card-open', { hasText: 'One second tone' }).click()
  await expect(page.getByRole('button', { name: 'Play loop' })).toBeEnabled()
  await page.getByRole('button', { name: 'Play loop' }).click()
  await expect(page.getByRole('button', { name: 'Pause loop' })).toBeVisible()
})

test('@claim:audio-private @claim:no-tracking imports and saves without third-party requests', async ({ page }) => {
  const requests: string[] = []
  page.on('request', request => requests.push(request.url()))
  await page.goto('/')
  const productOrigin = new URL(page.url()).origin
  await importTone(page)
  await saveTone(page, 'Private tone')
  expect(requests.every(url => new URL(url).origin === productOrigin)).toBe(true)
})

test('@claim:loops-export exports and imports a portable saved loop with audio', async ({ page }) => {
  await page.goto('/')
  await importTone(page)
  await saveTone(page, 'Portable tone')
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Export loops' }).click()
  const download = await downloadPromise
  const path = await download.path()
  expect(path).toBeTruthy()
  await page.evaluate(async () => {
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.deleteDatabase('loop-lab')
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  })
  await page.reload()
  await page.locator('#import-cards').setInputFiles(path!)
  await expect(page.locator('.card-open', { hasText: 'Portable tone' })).toBeVisible()
  await page.locator('.card-open', { hasText: 'Portable tone' }).click()
  await expect(page.getByRole('button', { name: 'Play loop' })).toBeEnabled()
})

test('visible errors, update status, deletion confirmation, and skip-link destination work', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('#main')).toBeFocused()
  await page.locator('#hero-file').setInputFiles({ name: 'broken.wav', mimeType: 'audio/wav', buffer: Buffer.from('broken') })
  await expect(page.locator('.status-message')).toContainText('The browser could not read that audio file')
  await expect(page.locator('.status-message')).toBeVisible()
  await page.evaluate(() => window.dispatchEvent(new Event('looplab:update')))
  await expect(page.locator('.status-message')).toContainText('An update is ready')
  await importTone(page)
  await saveTone(page)
  page.once('dialog', async dialog => { expect(dialog.message()).toContain('This cannot be undone'); await dialog.dismiss() })
  await page.getByRole('button', { name: 'Delete One second tone' }).click()
  await expect(page.locator('.card-open', { hasText: 'One second tone' })).toBeVisible()
})

test('@claim:input-boundaries rejects short clips and incomplete saved-loop exports before playback or saving', async ({ page }) => {
  const pageErrors: string[] = []
  page.on('pageerror', error => pageErrors.push(error.message))
  await page.goto('/')
  await page.locator('#hero-file').setInputFiles({ name: 'twenty-ms.wav', mimeType: 'audio/wav', buffer: wavBuffer(.02) })
  await expect(page.locator('.status-message')).toHaveText('This clip is too short to loop. Choose audio at least 0.05 seconds long.')
  await expect(page.locator('.clip-strip b')).toHaveText('No audio loaded')
  await expect(page.getByRole('button', { name: 'Play loop' })).toBeDisabled()
  expect(pageErrors).toEqual([])

  const validLoop = {
    id: 'would-have-imported', name: 'Valid before broken', note: 'This must not be saved.',
    start: 0, end: 1, bpm: 120, speed: 1, createdAt: 1,
    clip: { name: 'one-second-tone', duration: 1, source: 'file', audioBase64: wavBuffer().toString('base64'), audioType: 'audio/wav' },
  }
  const malformedExport = JSON.stringify({
    format: 'loop-lab-cards', version: 1,
    cards: [validLoop, { id: 'broken', name: 'Incomplete', note: 'Missing loop fields' }],
  })
  await page.locator('#import-cards').setInputFiles({ name: 'broken-loop-lab-saved-loops.json', mimeType: 'application/json', buffer: Buffer.from(malformedExport) })
  await expect(page.locator('.status-message')).toHaveText('That file is not a Loop Lab saved-loop export. Choose a Loop Lab JSON file.')
  await expect(page.locator('.card-open', { hasText: 'Valid before broken' })).toHaveCount(0)
  await expect(page.locator('.card-open', { hasText: 'Incomplete' })).toHaveCount(0)
  await expect(page.locator('#cards')).toContainText('Saved loops appear here.')
})

test('saved-loop fragment navigation, cold deep links, and Back restore scroll and focus', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Saved loops' }).click()
  await expect(page).toHaveURL(/\/#saved$/)
  await expect(page.locator('#saved-heading')).toBeFocused()
  expect(await page.locator('#saved-heading').evaluate(element => element.getBoundingClientRect().top)).toBeLessThan(100)

  await page.goto('/#saved')
  await expect(page.locator('#saved-heading')).toBeFocused()
  expect(await page.locator('#saved-heading').evaluate(element => element.getBoundingClientRect().top)).toBeLessThan(100)

  await page.goto('/')
  await page.locator('#saved-heading').scrollIntoViewIfNeeded()
  await page.locator('#saved-heading').focus()
  const before = await page.evaluate(() => window.scrollY)
  await page.getByRole('link', { name: 'Demo' }).click()
  await expect(page).toHaveURL(/\?demo=1$/)
  await page.goBack()
  await expect(page).toHaveURL('/')
  await expect(page.locator('#saved-heading')).toBeFocused()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThanOrEqual(before - 2)
})

test('desktop and 390px mobile pass accessibility, metadata, mobile facts, and touch checks', async ({ page }) => {
  const browserErrors: string[] = []
  page.on('console', message => { if (message.type() === 'error') browserErrors.push(message.text()) })
  page.on('pageerror', error => browserErrors.push(error.message))
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport)
    await page.goto('/?demo=1')
    const results = await new AxeBuilder({ page: page as any }).analyze()
    expect(results.violations.filter(item => ['serious', 'critical'].includes(item.impact || ''))).toEqual([])
    const tooSmall = await page.locator('a:visible, button:visible, input:visible, select:visible').evaluateAll(elements => elements.filter(element => {
      const rect = element.getBoundingClientRect()
      return rect.width < 44 || rect.height < 44
    }).map(element => ({ tag: element.tagName, text: (element.textContent || '').trim(), box: element.getBoundingClientRect().toJSON() })))
    expect(tooSmall).toEqual([])
    expect(await page.locator('main').evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true)
    await expect(page.locator('[style]')).toHaveCount(0)
  }
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  const factBounds = await page.locator('.facts li').evaluateAll(elements => elements.map(element => {
    const rect = element.getBoundingClientRect()
    return { top: rect.top, bottom: rect.bottom }
  }))
  expect(factBounds).toHaveLength(3)
  expect(factBounds.every(rect => rect.top >= 0 && rect.bottom <= 844)).toBe(true)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  expect(await page.locator('.wave i').first().evaluate(element => getComputedStyle(element).transitionDuration)).toBe('0s')
  await page.goto('/privacy')
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', 'https://loop-lab.sociobot.in/privacy')
  await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', 'Privacy — Loop Lab')
  await page.goto('/terms')
  await expect(page).toHaveTitle('Terms — Loop Lab')
  await page.goto('/not-a-real-loop')
  await expect(page).toHaveTitle('Page not found — Loop Lab')
  expect(browserErrors).toEqual([])
})
