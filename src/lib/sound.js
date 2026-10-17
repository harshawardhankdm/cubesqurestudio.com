// Subtle UI Audio Synthesizer via Web Audio API
// Zero external assets, zero bandwidth, low latency, completely client-side.
// Disabled by default.

let audioCtx = null

function getAudioContext() {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (AudioContext) {
      audioCtx = new AudioContext()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

let isSoundEnabled = false

export function setSoundEnabled(enabled) {
  isSoundEnabled = enabled
}

export function getSoundEnabled() {
  return isSoundEnabled
}

/**
 * Plays a tiny physical "tick" sound when a button/keycap is pressed
 */
export function playTick() {
  if (!isSoundEnabled) return
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    // Quick micro pitch drop from 240Hz to 60Hz over 35ms simulates a mechanical spring micro-click
    osc.frequency.setValueAtTime(240, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.035)

    gain.gain.setValueAtTime(0.06, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.035)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.038)
  } catch {
    // Graceful fallback if audio is not permitted
  }
}
