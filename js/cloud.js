/* ============================================================
   Word Solitaire — Cloud sync (Firebase)

   Keeps a player's progress (coins, unlocked level, hearts) mirrored to
   a Firestore document so it can be carried over to another device,
   instead of being stuck in one browser's localStorage. There's no
   account/login system in this game, so identity is a short random
   "sync code" generated on first run: entering that same code on
   another device points it at the same cloud document.

   Every write still requires anonymous Firebase Auth (see the security
   rules in the setup guide) purely so Firestore can reject writes from
   outside this app — the code itself, not the auth identity, is what
   ties a player's devices together.

   If js/firebase-config.js still has its placeholder values, everything
   here quietly no-ops: the game keeps saving to localStorage only, same
   as before this file existed.
   ============================================================ */

const SYNC_CODE_KEY = "solitaireGrow_syncCode_v1";
const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I — easy to misread out loud

function randomSyncCode() {
  let code = "";
  for (let i = 0; i < 8; i++) code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  return code;
}

function isFirebaseConfigured() {
  return typeof firebaseConfig !== "undefined" && !!firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith("YOUR_");
}

const CloudSync = (function () {
  let db = null;
  let ready = false;
  let pushTimer = null;
  let status = "not-configured"; // not-configured | connecting | synced | error
  let onStatusChange = null;

  function setStatus(next) {
    status = next;
    if (onStatusChange) onStatusChange(status);
  }

  /* The code is generated once per browser and kept forever after that
     — it's the thing the player copies to their other device, so it
     must stay stable across reloads. */
  function getCode() {
    let code = localStorage.getItem(SYNC_CODE_KEY);
    if (!code) {
      code = randomSyncCode();
      localStorage.setItem(SYNC_CODE_KEY, code);
    }
    return code;
  }

  function docForCode(code) {
    return db.collection("players").doc(code);
  }

  /* Reconciles this device's local save with whatever's already in the
     cloud under its code. Whichever side has the newer updatedAt wins —
     the loser gets overwritten. First run on a fresh code has nothing to
     reconcile against, so the local save just becomes the cloud copy. */
  async function pullOrPush() {
    const code = getCode();
    const ref = docForCode(code);
    const snap = await ref.get();
    const local = Game.getSave();
    if (snap.exists) {
      const cloud = snap.data();
      if ((cloud.updatedAt || 0) > (local.updatedAt || 0)) {
        Game.applyCloudSave(cloud);
        return;
      }
    }
    await ref.set({ ...local, updatedAt: local.updatedAt || Date.now() });
  }

  async function init() {
    if (!isFirebaseConfigured()) {
      setStatus("not-configured");
      return;
    }
    try {
      setStatus("connecting");
      firebase.initializeApp(firebaseConfig);
      db = firebase.firestore();
      await firebase.auth().signInAnonymously();
      ready = true;
      await pullOrPush();
      setStatus("synced");
    } catch (e) {
      console.error("CloudSync init failed", e);
      setStatus("error");
    }
  }

  /* Debounced so a burst of local saves (combo bonuses, a completed
     category, a move) collapses into one Firestore write instead of
     one per keystroke of gameplay. */
  function pushDebounced(save) {
    if (!ready) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(() => {
      docForCode(getCode())
        .set(save)
        .then(() => setStatus("synced"))
        .catch((e) => {
          console.error("CloudSync push failed", e);
          setStatus("error");
        });
    }, 1200);
  }

  /* Points THIS device at another device's code and adopts its progress
     — the "restore on a new device" flow. Overwrites whatever local
     save this browser had, so the UI should confirm with the player
     before calling this. */
  async function restoreFromCode(inputCode) {
    const code = (inputCode || "").trim().toUpperCase();
    if (!code) return { ok: false, reason: "empty" };
    if (!ready) return { ok: false, reason: "offline" };
    try {
      const snap = await docForCode(code).get();
      if (!snap.exists) return { ok: false, reason: "not-found" };
      localStorage.setItem(SYNC_CODE_KEY, code);
      Game.applyCloudSave(snap.data());
      setStatus("synced");
      return { ok: true };
    } catch (e) {
      console.error("CloudSync restore failed", e);
      return { ok: false, reason: "error" };
    }
  }

  function getStatus() {
    return status;
  }

  function setOnStatusChange(fn) {
    onStatusChange = fn;
  }

  return {
    init,
    getCode,
    pushDebounced,
    restoreFromCode,
    getStatus,
    setOnStatusChange,
    isConfigured: isFirebaseConfigured,
  };
})();

document.addEventListener("DOMContentLoaded", () => {
  Game.setOnSaveChanged((save) => CloudSync.pushDebounced(save));
  CloudSync.init();
});
