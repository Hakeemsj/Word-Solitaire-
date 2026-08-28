/* ============================================================
   Word Solitaire — Haptic feedback

   Mirrors js/sound.js's shape (same trigger points, same toggle/
   persistence pattern) but fires short navigator.vibrate() bursts
   instead of tones.

   Notably NOT supported in Safari on iOS — Apple has never
   implemented the Vibration API there, so on an iPhone every call
   below is a silent no-op. The toggle still shows and works (and
   persists), it just won't do anything until played on a browser that
   does support it (Android Chrome/Firefox, mainly). That's a platform
   limitation, not a bug here.
   ============================================================ */

const Haptics = (function () {
  const KEY = "solitaireGrow_vibration";
  const supported = typeof navigator !== "undefined" && typeof navigator.vibrate === "function";
  let enabled = true;
  try {
    enabled = localStorage.getItem(KEY) !== "off";
  } catch (e) {
    /* ignore */
  }

  function fire(pattern) {
    if (!enabled || !supported) return;
    navigator.vibrate(pattern);
  }

  function pickup() {
    fire(10);
  }
  function flip() {
    fire(15);
  }
  // Reorganizing the tableau — deliberately the lightest buzz, same
  // reasoning as Sound.stack(): this happens a lot and shouldn't
  // compete with the more distinct "delivered" pulse below.
  function stack() {
    fire(8);
  }
  function deliver() {
    fire([15, 30, 15]);
  }
  function wrong() {
    fire(40);
  }
  function complete() {
    fire([20, 40, 20, 40, 30]);
  }
  function combo() {
    fire(12);
  }
  function milestone() {
    fire([20, 20, 20]);
  }
  function win() {
    fire([30, 50, 30, 50, 60]);
  }

  function isOn() {
    return enabled;
  }
  function isSupported() {
    return supported;
  }
  function toggle() {
    enabled = !enabled;
    try {
      localStorage.setItem(KEY, enabled ? "on" : "off");
    } catch (e) {
      /* ignore */
    }
    if (enabled) fire(10); // a little confirmation buzz, same idea as Sound's warmUp on unmute
    return enabled;
  }

  return { pickup, flip, stack, deliver, wrong, complete, combo, milestone, win, isOn, isSupported, toggle };
})();
