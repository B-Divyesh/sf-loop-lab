/** A small granular player. Grains play at their natural rate while their start
 * positions move at the requested speed, so slowing does not lower pitch. */
export class LoopPlayer {
  ctx: AudioContext | null = null
  buffer: AudioBuffer | null = null
  playing = false
  start = 0
  end = 1
  speed = 1
  position = 0
  private timer = 0
  private nextTime = 0
  private sources: AudioBufferSourceNode[] = []

  async loadFile(file: File) {
    return this.loadBlob(file)
  }
  async loadBlob(blob: Blob) {
    const ctx = this.ensureContext()
    this.buffer = await ctx.decodeAudioData(await blob.arrayBuffer())
    this.start = 0; this.end = Math.min(this.buffer.duration, 8); this.position = this.start
    return this.buffer.duration
  }
  async loadSample() {
    const ctx = this.ensureContext()
    const length = ctx.sampleRate * 12
    const b = ctx.createBuffer(1, length, ctx.sampleRate)
    const data = b.getChannelData(0)
    for (let i = 0; i < length; i++) {
      const t = i / ctx.sampleRate
      const beat = (t * 2) % 1
      const kick = Math.sin(2 * Math.PI * (64 - beat * 45) * t) * Math.exp(-beat * 17)
      const hat = ((Math.sin(t * 931) + Math.sin(t * 1437)) * .12) * Math.exp(-((t * 4) % 1) * 30)
      const bass = Math.sin(2 * Math.PI * 55 * t) * .16
      data[i] = (kick * .55 + hat + bass) * .5
    }
    this.buffer = b; this.start = 1; this.end = 5; this.position = 1
    return b.duration
  }
  ensureContext() {
    if (!this.ctx) this.ctx = new AudioContext()
    return this.ctx
  }
  async play() {
    if (!this.buffer) return false
    const ctx = this.ensureContext(); await ctx.resume()
    if (this.playing) return true
    this.playing = true; this.nextTime = ctx.currentTime + .03
    if (this.position < this.start || this.position >= this.end) this.position = this.start
    this.schedule()
    this.timer = window.setInterval(() => this.schedule(), 45)
    return true
  }
  pause() { this.playing = false; clearInterval(this.timer); this.sources.forEach(s => { try { s.stop() } catch { /* source already stopped */ } }); this.sources = [] }
  stop() { this.pause(); this.position = this.start }
  private schedule() {
    if (!this.ctx || !this.buffer || !this.playing) return
    const grain = .075, hop = .042
    while (this.nextTime < this.ctx.currentTime + .15) {
      const src = this.ctx.createBufferSource(); src.buffer = this.buffer
      const gain = this.ctx.createGain(); gain.gain.setValueAtTime(0, this.nextTime); gain.gain.linearRampToValueAtTime(.62, this.nextTime + .01); gain.gain.setValueAtTime(.62, this.nextTime + grain - .012); gain.gain.linearRampToValueAtTime(0, this.nextTime + grain)
      src.connect(gain).connect(this.ctx.destination)
      src.start(this.nextTime, this.position, Math.min(grain, this.buffer.duration - this.position))
      this.sources.push(src); src.onended = () => { this.sources = this.sources.filter(x => x !== src) }
      this.position += hop * this.speed
      if (this.position >= this.end) this.position = this.start + (this.position - this.end)
      this.nextTime += hop
    }
  }
}
