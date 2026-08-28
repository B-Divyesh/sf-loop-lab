import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('offline app shell', () => {
  it('@claim:offline-reload precaches the app shell and demo route', () => {
    const worker = readFileSync('public/sw.js', 'utf8')
    expect(worker).toContain("'/demo'")
    expect(worker).toContain("'/assets/app.js'")
    expect(worker).toContain("'/assets/app.css'")
  })
})
