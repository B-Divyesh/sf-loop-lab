import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('static host policy', () => {
  it('ships the deploy configuration inside the artifact source', () => {
    const root = JSON.parse(readFileSync('staticwebapp.config.json', 'utf8'))
    const shipped = JSON.parse(readFileSync('public/staticwebapp.config.json', 'utf8'))
    expect(shipped).toEqual(root)
    expect(shipped.globalHeaders['Content-Security-Policy']).toContain("default-src 'self'")
    expect(shipped.responseOverrides['404']).toEqual({ rewrite: '/404.html' })
    expect(shipped.routes.find((route: { route: string }) => route.route === '/manifest.webmanifest').headers['Content-Type']).toContain('application/manifest+json')
  })

  it('links an original 180 px Apple touch icon', () => {
    const html = readFileSync('index.html', 'utf8')
    expect(html).toContain('rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"')
    const icon = readFileSync('public/apple-touch-icon.png')
    expect(icon.subarray(1, 4).toString()).toBe('PNG')
    expect(icon.readUInt32BE(16)).toBe(180)
    expect(icon.readUInt32BE(20)).toBe(180)
  })

  it('gives every registered claim exactly one tagged test', () => {
    const claims = JSON.parse(readFileSync('.factory/claims.json', 'utf8')) as Array<{ id: string }>
    const source = [
      readFileSync('tests/audio.test.ts', 'utf8'),
      readFileSync('tests/browser/product.spec.ts', 'utf8'),
      readFileSync('tests/store.test.ts', 'utf8'),
    ].join('\n')
    for (const claim of claims) {
      const taggedTests = source.match(new RegExp(`(?:it|test)\\(['"][^'"]*@claim:${claim.id}(?=[^'"]*)`, 'g')) ?? []
      expect(taggedTests, claim.id).toHaveLength(1)
    }
  })
})
