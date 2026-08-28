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
  await page.goto('/demo')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Repeat one small pattern.')
  await page.evaluate(async () => { await navigator.serviceWorker.ready })
  if (!(await page.evaluate(() => Boolean(navigator.serviceWorker.controller)))) await page.reload()
  await context.setOffline(true)
  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Repeat one small pattern.')
})

test('@claim:demo-isolated @claim:no-account keeps sample data separate with one click', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Try it with sample data' }).click()
  await expect(page.getByText('Demo — sample data, nothing is saved to your real loops.')).toBeVisible()
  await page.locator('#card-name').fill('Demo only')
  await page.locator('#card-note').fill('Listen to the offbeat.')
  await page.locator('#card-form button').click()
  await page.getByRole('link', { name: 'Start for real' }).click()
  await expect(page.getByRole('button', { name: /Demo only/ })).toHaveCount(0)
})

test('@claim:cards-local saves audio and reopens its card after refresh', async ({ page }) => {
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

test('@claim:cards-export exports and imports a portable card with audio', async ({ page }) => {
  await page.goto('/')
  await importTone(page)
  await saveTone(page, 'Portable tone')
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Export cards' }).click()
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

test('visible errors, update status, deletion confirmation, and initial focus order', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Skip to the practice desk' })).toBeFocused()
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

test('desktop and 390px mobile pass accessibility, metadata, and touch checks', async ({ page }) => {
  const browserErrors: string[] = []
  page.on('console', message => { if (message.type() === 'error') browserErrors.push(message.text()) })
  page.on('pageerror', error => browserErrors.push(error.message))
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport)
    await page.goto('/demo')
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
  await page.goto('/privacy')
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', 'https://loop-lab.sociobot.in/privacy')
  await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', 'Privacy — Loop Lab')
  expect(browserErrors).toEqual([])
})
