import { describe, expect, it } from 'vitest'
import { LoopPlayer } from '../src/audio'
describe('granular loop playback', () => {
  it('@claim:pitch-speed keeps grain source playback rate at its natural value', () => {
    const rates: unknown[] = []
    const player = new LoopPlayer() as any
    player.buffer = { duration: 8 }
    player.playing = true
    player.start = 1; player.end = 3; player.position = 1; player.speed = .5
    player.nextTime = 0
    player.ctx = {
      currentTime: 0,
      destination: {},
      createBufferSource: () => ({ connect: () => ({ connect: () => ({}) }), start: (_at: number, _offset: number) => rates.push((player as any).playbackRate), onended: null }),
      createGain: () => ({ gain: { setValueAtTime: () => {}, linearRampToValueAtTime: () => {} }, connect: () => ({}) })
    }
    player.schedule()
    expect(rates.length).toBeGreaterThan(0)
    expect(rates.every(rate => rate === undefined)).toBe(true)
    expect(player.position).toBeGreaterThan(1)
    expect(player.position).toBeLessThan(1.3)
  })
})
