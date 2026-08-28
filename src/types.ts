export type LoopCard = {
  id: string
  name: string
  note: string
  start: number
  end: number
  bpm: number
  speed: number
  createdAt: number
  clip?: StoredClip
}

export type StoredClip = {
  name: string
  duration: number
  source: 'sample' | 'file'
  audio?: Blob
}

export type ClipState = StoredClip

export type WorkspaceState = {
  clip: StoredClip
  start: number
  end: number
  bpm: number
  speed: number
}
