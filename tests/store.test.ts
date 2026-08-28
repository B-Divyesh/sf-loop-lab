// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest'
import 'fake-indexeddb/auto'
import { clearCards, clearWorkspace, listCards, loadWorkspace, namespace, saveCard, saveWorkspace } from '../src/store'

const card = { id: 'a', name: 'One beat', note: 'Listen to the kick.', start: 0, end: 2, bpm: 120, speed: 1, createdAt: 1 }
beforeEach(async () => { history.replaceState({}, '', '/'); await clearCards(); await clearWorkspace() })
describe('Loop Lab cards', () => {
  it('saves and returns cards and active workspace', async () => {
    await saveCard(card)
    await saveWorkspace({ clip: { name: 'tone', duration: 1, source: 'file', audio: new Blob(['audio']) }, start: 0, end: 1, bpm: 120, speed: 1 })
    expect(await listCards()).toEqual([card])
    expect((await loadWorkspace())?.clip.name).toBe('tone')
  })
  it('keeps demo records away from real records', async () => {
    await saveCard(card)
    history.replaceState({}, '', '/demo')
    expect(namespace()).toBe('demo:')
    expect(await listCards()).toEqual([])
    await saveCard({ ...card, id: 'demo' })
    expect((await listCards()).map(c => c.id)).toEqual(['demo'])
    history.replaceState({}, '', '/')
    expect((await listCards()).map(c => c.id)).toEqual(['a'])
  })
})
