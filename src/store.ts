import type { LoopCard } from './types'

const DB = 'loop-lab'
const STORE = 'cards'
export const namespace = () => location.pathname === '/demo' || location.search.includes('demo=1') ? 'demo:' : 'real:'

function open() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open(DB, 1)
    req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: 'key' })
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export async function listCards(): Promise<LoopCard[]> {
  const db = await open()
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE).objectStore(STORE).getAll()
    req.onsuccess = () => { db.close(); resolve(req.result.filter((r: { key: string }) => r.key.startsWith(namespace())).map((r: { value: LoopCard }) => r.value).sort((a: LoopCard, b: LoopCard) => b.createdAt - a.createdAt)) }
    req.onerror = () => reject(req.error)
  })
}

export async function saveCard(card: LoopCard) {
  const db = await open()
  return new Promise<void>((resolve, reject) => {
    const req = db.transaction(STORE, 'readwrite').objectStore(STORE).put({ key: namespace() + card.id, value: card })
    req.onsuccess = () => { db.close(); resolve() }
    req.onerror = () => reject(req.error)
  })
}

export async function removeCard(id: string) {
  const db = await open()
  return new Promise<void>((resolve, reject) => {
    const req = db.transaction(STORE, 'readwrite').objectStore(STORE).delete(namespace() + id)
    req.onsuccess = () => { db.close(); resolve() }
    req.onerror = () => reject(req.error)
  })
}

export async function clearCards() {
  const cards = await listCards()
  await Promise.all(cards.map(card => removeCard(card.id)))
}

export const makeId = () => crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`
