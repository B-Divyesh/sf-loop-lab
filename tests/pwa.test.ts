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
})
