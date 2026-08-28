/* ============================================================
   Word Solitaire — Synthesized sound effects
   No audio files: every effect is a couple of oscillator tones
   shaped with a short gain envelope. Keeps the whole game
   self-contained and file-free for sound. Muted state persists
   in localStorage.
   ============================================================ */

const Sound = (function () {
  const KEY = "solitaireGrow_sound";
  let ctx = null;
  let enabled = true;
  try {
    enabled = localStorage.getItem(KEY) !== "off";
  } catch (e) {
    /* ignore */
  }

  function ensureCtx() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  // Many phones/OSes power down the audio output path after a stretch of
  // silence; the very next real sound effect then has to wait for that
  // hardware path to wake back up, which is exactly the "sound comes out
  // a beat late" feeling. A single inaudible (near-zero gain) oscillator,
  // left running for the whole game, keeps that path permanently warm so
  // every real effect fires the instant it's triggered.
  let keepAliveStarted = false;
  function startKeepAlive() {
    if (keepAliveStarted) return;
    const c = ensureCtx();
    if (!c) return;
    keepAliveStarted = true;
    const osc = c.createOscillator();
    const gain = c.createGain();
    gain.gain.value = 0.00001;
    osc.frequency.value = 20;
    osc.connect(gain).connect(c.destination);
    osc.start();
  }

  // Call as early as possible (first tap on the page, before any game
  // sound is actually needed) so the context — and the keep-alive path
  // above — are already running well before the first real effect.
  function warmUp() {
    ensureCtx();
    startKeepAlive();
  }

  function tone(freq, startOffset, duration, type, peak) {
    if (!enabled) return;
    const c = ensureCtx();
    if (!c) return;
    const t0 = c.currentTime + startOffset;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type || "sine";
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.linearRampToValueAtTime(peak || 0.16, t0 + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    osc.connect(gain).connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + duration + 0.03);
  }

  // A short burst of filtered noise — much more like a physical card
  // snap/riffle than a pure tone, used for the stock pile flip.
  function noiseBurst(duration, startOffset, peak, filterFreq) {
    if (!enabled) return;
    const c = ensureCtx();
    if (!c) return;
    const t0 = c.currentTime + (startOffset || 0);
    const bufferSize = Math.max(1, Math.floor(c.sampleRate * duration));
    const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource();
    src.buffer = buffer;
    const filter = c.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = filterFreq || 1500;
    const gain = c.createGain();
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.linearRampToValueAtTime(peak || 0.16, t0 + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    src.connect(filter).connect(gain).connect(c.destination);
    src.start(t0);
  }

  function pickup() {
    tone(500, 0, 0.07, "triangle", 0.1);
  }
  // Stock pile draw — a quick paper-like snap, like a card being flicked
  // over, instead of a plain beep.
  function flip() {
    noiseBurst(0.05, 0, 0.2, 2200);
    noiseBurst(0.04, 0.035, 0.12, 3200);
  }
  // Reorganizing the tableau: a card lands on another card of the same
  // category. Deliberately quiet/dull — this happens a lot and shouldn't
  // compete with the brighter "delivered to its category" sound below.
  function stack() {
    tone(300, 0, 0.07, "sine", 0.1);
  }
  // A word (or a collector claiming its slot) lands on its category card
  // in the foundation row — the "that counted" sound.
  function deliver() {
    tone(640, 0, 0.08, "sine", 0.15);
    tone(880, 0.05, 0.12, "sine", 0.11);
  }
  function wrong() {
    tone(220, 0, 0.09, "sawtooth", 0.12);
    tone(160, 0.07, 0.14, "sawtooth", 0.1);
  }
  // A category's full set is collected and the slot clears.
  function complete() {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.07, 0.22, "triangle", 0.13));
  }
  function combo(streak) {
    tone(680 + Math.min(streak, 12) * 34, 0, 0.1, "square", 0.09);
  }
  // A streak crosses a milestone (3/6/10/15) — a brighter, punchier
  // sting than the plain combo tick, with an extra note per tier so it
  // keeps sounding more impressive the further the streak goes.
  const MILESTONE_NOTES = [659.25, 783.99, 987.77, 1174.66, 1567.98];
  function milestone(tier) {
    const count = Math.min(tier + 1, MILESTONE_NOTES.length);
    for (let i = 0; i < count; i++) tone(MILESTONE_NOTES[i], i * 0.06, 0.18, "square", 0.14);
  }
  // The stage itself is won.
  function win() {
    [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => tone(f, i * 0.09, 0.3, "triangle", 0.14));
  }

  function isOn() {
    return enabled;
  }
  function toggle() {
    enabled = !enabled;
    try {
      localStorage.setItem(KEY, enabled ? "on" : "off");
    } catch (e) {
      /* ignore */
    }
    if (enabled) warmUp();
    return enabled;
  }

  /* Reads a word aloud with the browser's built-in text-to-speech —
     no audio files, works offline. Deliberately NOT gated by the SFX
     mute toggle above: a player who muted game sounds may still want
     the pronunciation help, since that's a learning tool, not a game
     effect. */
  function speak(word) {
    if (!("speechSynthesis" in window)) return false;
    window.speechSynthesis.cancel(); // don't stack overlapping pronunciations
    const utter = new SpeechSynthesisUtterance(word);
    utter.lang = "en-US";
    utter.rate = 0.85;
    window.speechSynthesis.speak(utter);
    return true;
  }

  return { pickup, flip, stack, deliver, wrong, complete, combo, milestone, win, isOn, toggle, speak, warmUp };
})();
