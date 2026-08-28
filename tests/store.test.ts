// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest'
import 'fake-indexeddb/auto'
import { clearCards, listCards, namespace, saveCard } from '../src/store'

const card = { id: 'a', name: 'One beat', note: 'Listen to the kick.', start: 0, end: 2, bpm: 120, speed: 1, createdAt: 1 }
beforeEach(async () => { history.replaceState({}, '', '/'); await clearCards() })
describe('Loop Lab cards', () => {
  it('@claim:cards-local saves and returns real cards locally', async () => { await saveCard(card); expect(await listCards()).toEqual([card]) })
  it('@claim:demo-isolated keeps demo cards away from real cards', async () => { await saveCard(card); history.replaceState({}, '', '/demo'); expect(namespace()).toBe('demo:'); expect(await listCards()).toEqual([]); await saveCard({ ...card, id: 'demo' }); expect((await listCards()).map(c => c.id)).toEqual(['demo']); history.replaceState({}, '', '/'); expect((await listCards()).map(c => c.id)).toEqual(['a']) })
})
