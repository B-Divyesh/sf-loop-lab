export type LoopCard = {
  id: string
  name: string
  note: string
  start: number
  end: number
  bpm: number
  speed: number
  createdAt: number
}

export type ClipState = { name: string; duration: number; source: 'sample' | 'file' }
