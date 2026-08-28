import type { LoopCard, WorkspaceState } from './types'

const DB = 'loop-lab'
const STORE = 'cards'
const WORKSPACES = 'workspaces'
export const namespace = () => location.pathname === '/demo' || location.search.includes('demo=1') ? 'demo:' : 'real:'

function open() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open(DB, 2)
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE, { keyPath: 'key' })
      if (!req.result.objectStoreNames.contains(WORKSPACES)) req.result.createObjectStore(WORKSPACES, { keyPath: 'key' })
    }
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
  await saveCards([card])
}

/** Save a validated import in one transaction so a failed write cannot leave a partial library. */
export async function saveCards(cards: LoopCard[]) {
  const db = await open()
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE, 'readwrite')
    const store = transaction.objectStore(STORE)
    cards.forEach(card => store.put({ key: namespace() + card.id, value: card }))
    transaction.oncomplete = () => { db.close(); resolve() }
    transaction.onerror = () => { db.close(); reject(transaction.error) }
    transaction.onabort = () => { db.close(); reject(transaction.error) }
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

export async function loadWorkspace(): Promise<WorkspaceState | null> {
  const db = await open()
  return new Promise((resolve, reject) => {
    const req = db.transaction(WORKSPACES).objectStore(WORKSPACES).get(namespace() + 'active')
    req.onsuccess = () => { db.close(); resolve(req.result?.value ?? null) }
    req.onerror = () => reject(req.error)
  })
}

export async function saveWorkspace(value: WorkspaceState) {
  const db = await open()
  return new Promise<void>((resolve, reject) => {
    const req = db.transaction(WORKSPACES, 'readwrite').objectStore(WORKSPACES).put({ key: namespace() + 'active', value })
    req.onsuccess = () => { db.close(); resolve() }
    req.onerror = () => reject(req.error)
  })
}

export async function clearWorkspace() {
  const db = await open()
  return new Promise<void>((resolve, reject) => {
    const req = db.transaction(WORKSPACES, 'readwrite').objectStore(WORKSPACES).delete(namespace() + 'active')
    req.onsuccess = () => { db.close(); resolve() }
    req.onerror = () => reject(req.error)
  })
}

export const makeId = () => crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`
