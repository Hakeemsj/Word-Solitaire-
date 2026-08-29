/* ============================================================
   Word Solitaire — UI layer
   Renders the stage-select screen and the Klondike-style board,
   and wires clicks to the Game engine.
   ============================================================ */

/* TEMP, pre-launch only: gives free, unlocked access to any stage number
   (plus a "random stage" shortcut) via a small floating dev panel, so
   every stage can be spot-checked without grinding through the normal
   unlock progression or the hearts gate. Flip to false (or delete this
   whole block + setupDevPanel() call) before shipping. */
const DEV_MODE = true;

const el = (sel, root = document) => root.querySelector(sel);

/* The brand mark (in place of the old crown icon) — a heavy gold "W",
   same gradient treatment as the home screen's card logo, so a
   claimed/completed category reads as "stamped" with the game's own
   mark instead of a generic royalty icon. */
function wMarkIcon(extraClass) {
  return `<span class="w-mark${extraClass ? " " + extraClass : ""}" aria-hidden="true">W</span>`;
}

/* The coin "logo" (in place of the 🪙 emoji) — a hexagonal gold token
   with a beveled rim (a darker hexagon peeking out from behind a
   brighter one, offset upward) and a "W" struck on a raised center
   disc, matching the reference badge-style game-currency icon. */
function coinIcon(extraClass) {
  return `<svg class="coin-icon${extraClass ? " " + extraClass : ""}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <polygon points="22.5,12 17.25,21.09 6.75,21.09 1.5,12 6.75,2.91 17.25,2.91" fill="#d98c00"/>
    <polygon points="22.5,10.7 17.25,19.79 6.75,19.79 1.5,10.7 6.75,1.61 17.25,1.61" fill="#ffd83d"/>
    <circle cx="12" cy="10.7" r="5.4" fill="#f2a30d" stroke="#c97800" stroke-width="0.6"/>
    <text x="12" y="13.6" text-anchor="middle" font-size="8.6" font-weight="900" fill="#ffffff" font-family="Arial, Helvetica, sans-serif">W</text>
  </svg>`;
}

const screenStages = el("#screen-stages");
const screenGame = el("#screen-game");

const homeCoinsCount = el("#home-coins-count");
const homeAddBtn = el("#home-add-btn");
const homeHeartsCount = el("#home-hearts-count");
const homeHeartsLabel = el("#home-hearts-label");
const homeSettingsBtn = el("#home-settings-btn");
const homeContinueBtn = el("#home-continue-btn");
const homeContinueLevelNum = el("#home-continue-level-num");

const noHeartsModal = el("#no-hearts-modal");
const noHeartsModalBox = el(".modal", noHeartsModal);
const noHeartsTimer = el("#no-hearts-timer");
const refillHeartsBtn = el("#refill-hearts-btn");
const refillHeartsCost = el("#refill-hearts-cost");
const noHeartsCloseBtn = el("#no-hearts-close-btn");

const statMoves = el("#stat-moves");
const statHints = el("#stat-hints");
const statCoins = el("#stat-coins");
const statUndos = el("#stat-undos");
const hintBtn = el("#hint-btn");
const undoBtn = el("#undo-btn");
const gameSettingsBtn = el("#game-settings-btn");
const toastEl = el("#toast");

const wasteEl = el("#waste");
const stockEl = el("#stock");
const foundationsEl = el("#foundations");
const tableauEl = el("#tableau");

const hintModal = el("#hint-modal");
const hintModalBox = el(".modal", hintModal);
const hintWord = el("#hint-word");
const hintMeaning = el("#hint-meaning");
const hintExample = el("#hint-example");
const hintRelation = el("#hint-relation");
const hintCloseBtn = el("#hint-close-btn");
const hintSpeakBtn = el("#hint-speak-btn");

const stuckModal = el("#stuck-modal");
const stuckModalBox = el(".modal", stuckModal);
const stuckPairsLeft = el("#stuck-pairs-left");
const buyMovesBtn = el("#buy-moves-btn");
const restartBtn = el("#restart-btn");
const giveUpBtn = el("#give-up-btn");

const comboBadge = el("#combo-badge");

const winModal = el("#win-modal");
const winModalBox = el(".win-content", winModal);
const winStageNum = el("#win-stage-num");
const winTitle = el("#win-title");
const winReward = el("#win-reward");
const winMovesUsed = el("#win-moves-used");

const settingsModal = el("#settings-modal");
const settingsModalBox = el(".modal", settingsModal);
const settingsSoundBtn = el("#settings-sound-btn");
const settingsVibrationBtn = el("#settings-vibration-btn");
const settingsCloseBtn = el("#settings-close-btn");
const settingsBackBtn = el("#settings-back-btn");
const settingsHowToPlayBtn = el("#settings-howtoplay-btn");

/* Modal focus management: when a modal opens, focus moves INTO it (the
   inner tabindex="-1" container, not any specific button — several of
   the buttons in here can be disabled depending on state, e.g.
   buy-moves when the player can't afford it, so the container is the
   one target that's always focusable); when it closes, focus returns
   to whatever had it before the modal opened, instead of silently
   falling back to <body>. Escape closes whichever modal has an
   unambiguous "cancel" action — just the hint modal, since stuck/win
   have no neutral dismiss (every button there commits to something). */
let modalReturnFocus = null;
function setModalOpen(overlayEl, focusEl, shouldOpen) {
  const wasOpen = overlayEl.classList.contains("open");
  if (shouldOpen && !wasOpen) {
    modalReturnFocus = document.activeElement;
    overlayEl.classList.add("open");
    focusEl.focus();
  } else if (!shouldOpen && wasOpen) {
    overlayEl.classList.remove("open");
    if (modalReturnFocus && document.body.contains(modalReturnFocus)) modalReturnFocus.focus();
    modalReturnFocus = null;
  }
}
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (hintModal.classList.contains("open")) {
    Game.dismissHint();
    renderGame();
  } else if (noHeartsModal.classList.contains("open")) {
    setModalOpen(noHeartsModal, noHeartsModalBox, false);
  } else if (settingsModal.classList.contains("open")) {
    setModalOpen(settingsModal, settingsModalBox, false);
  }
});
const nextStageBtn = el("#next-stage-btn");
const winStagesBtn = el("#win-stages-btn");

let toastTimer = null;
let wonSoundPlayed = false;

function showToast(html, kind) {
  toastEl.innerHTML = html;
  toastEl.className = "toast show " + (kind || "");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 1400);
}


// Warm the audio pipeline up on the very first tap anywhere on the page —
// well before the player ever drags a card — so it's already fully awake
// by the time a real sound effect needs to play.
window.addEventListener("pointerdown", () => Sound.warmUp(), { once: true, capture: true });

/* ---------- Confetti + shake feedback ---------- */
function spawnConfetti(x, y) {
  const colors = ["#ff6b6b", "#4ecdc4", "#ffd93d", "#6c5ce7", "#ffa94d", "#51cf66"];
  for (let i = 0; i < 16; i++) {
    const p = document.createElement("div");
    p.className = "confetti-piece";
    p.style.background = colors[i % colors.length];
    p.style.left = x + "px";
    p.style.top = y + "px";
    document.body.appendChild(p);
    const angle = Math.random() * Math.PI * 2;
    const dist = 40 + Math.random() * 70;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist - 30;
    const rot = Math.random() * 720 - 360;
    const anim = p.animate(
      [
        { transform: "translate(0,0) rotate(0deg)", opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)`, opacity: 0 },
      ],
      { duration: 600 + Math.random() * 250, easing: "cubic-bezier(.2,.7,.3,1)" }
    );
    anim.onfinish = () => p.remove();
  }
}

function shakeElement(el) {
  if (!el) return;
  el.classList.remove("shake");
  // Force reflow so the animation restarts if it's still mid-shake.
  void el.offsetWidth;
  el.classList.add("shake");
  setTimeout(() => el.classList.remove("shake"), 350);
}

// Streak milestones — each crossing gets its own toast, a richer sound
// (see Sound.milestone), and a progressively bolder badge glow, so a
// long streak keeps feeling more exciting instead of flattening out
// after the first couple of hits. Thresholds line up with game.js's
// comboBonusFor tiers.
const COMBO_MILESTONES = [
  { threshold: 3, tier: 1, label: "Nice streak! 🔥" },
  { threshold: 6, tier: 2, label: "On fire! 🔥🔥" },
  { threshold: 10, tier: 3, label: "Unstoppable! ⚡" },
  { threshold: 15, tier: 4, label: "Legendary! 👑" },
];

function updateComboBadge(streak) {
  comboBadge.textContent = "🔥 ×" + streak;
  comboBadge.classList.toggle("active", streak >= 3);
  comboBadge.classList.toggle("tier-2", streak >= 6);
  comboBadge.classList.toggle("tier-3", streak >= 10);
  comboBadge.classList.toggle("tier-4", streak >= 15);
}

// The home screen's page background is a light cream; the game
// screen's is a dark green felt — one static <meta theme-color> can
// only ever match one of them, so the OS status bar (and any other
// chrome that reads this tag) would show a visible seam against
// whichever screen it doesn't match. Swapping it here keeps it
// blended with whichever screen is actually showing.
const THEME_COLORS = { stages: "#f3ecd9", game: "#0e5c34" };
function showScreen(name) {
  screenStages.classList.toggle("active", name === "stages");
  screenGame.classList.toggle("active", name === "game");
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  if (themeColorMeta && THEME_COLORS[name]) themeColorMeta.setAttribute("content", THEME_COLORS[name]);
  if (name === "stages") {
    hintModal.classList.remove("open");
    stuckModal.classList.remove("open");
    winModal.classList.remove("open");
    modalReturnFocus = null;
    if (typeof Tutorial !== "undefined") Tutorial.cancel();
  }
}

/* The home screen: a stats bar (coins / hearts / settings) plus a
   single "Continue" button that jumps straight into the player's next
   stage — no level-map to render, so unlike the old winding-path
   screen this is just a handful of text/class updates, cheap enough to
   call every second for the live hearts countdown. */
function formatCountdown(ms) {
  const totalSec = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function renderHome() {
  const save = Game.getSave();
  homeCoinsCount.textContent = save.coins;
  homeContinueLevelNum.textContent = save.unlockedStage;
  homeHeartsCount.textContent = save.lives;
  homeHeartsLabel.textContent = save.lives >= MAX_LIVES ? "Full" : formatCountdown(Game.msUntilNextLife());
  el("#home-hearts").classList.toggle("empty", save.lives <= 0);
}

function updateNoHeartsModal() {
  const save = Game.getSave();
  if (save.lives > 0) {
    setModalOpen(noHeartsModal, noHeartsModalBox, false);
    renderHome();
    return;
  }
  noHeartsTimer.textContent = formatCountdown(Game.msUntilNextLife());
}

function showNoHeartsModal() {
  refillHeartsCost.innerHTML = `${HEART_REFILL_COST} ${coinIcon()}`;
  setModalOpen(noHeartsModal, noHeartsModalBox, true);
  updateNoHeartsModal();
}

// One light-weight tick for both the home screen's live countdown and
// the no-hearts modal's timer — cheap text updates only, never a full
// rebuild, so running it every second regardless of which screen is
// showing costs nothing noticeable.
setInterval(() => {
  if (screenStages.classList.contains("active")) renderHome();
  if (noHeartsModal.classList.contains("open")) updateNoHeartsModal();
}, 1000);

function startStage(stageId) {
  Sound.warmUp();
  Game.start(stageId);
  wonSoundPlayed = false;
  selection = null;
  showScreen("game");
  renderGame();
  if (typeof Tutorial !== "undefined") Tutorial.maybeStart(Game.getState());
}

function openStage(stageId) {
  if (Game.getSave().lives <= 0) {
    showNoHeartsModal();
    return;
  }
  startStage(stageId);
}

/* TEMP dev-only entry point (see DEV_MODE above): same as openStage, but
   skips the hearts gate entirely so testing isn't rationed by lives. */
function devOpenStage(stageId) {
  startStage(Math.max(1, Math.min(STAGES.length, stageId)));
}

function setupDevPanel() {
  const panel = document.createElement("div");
  panel.className = "dev-panel";
  panel.innerHTML = `
    <span class="dev-panel-label">DEV</span>
    <input type="number" class="dev-panel-input" min="1" max="${STAGES.length}" value="1" aria-label="Stage number" />
    <button type="button" class="dev-panel-btn" data-action="go">Go</button>
    <button type="button" class="dev-panel-btn" data-action="random">Random</button>
  `;
  document.body.appendChild(panel);
  const input = panel.querySelector(".dev-panel-input");
  const go = () => {
    const n = parseInt(input.value, 10);
    if (Number.isFinite(n)) devOpenStage(n);
  };
  panel.querySelector('[data-action="go"]').addEventListener("click", go);
  panel.querySelector('[data-action="random"]').addEventListener("click", () => {
    const n = 1 + Math.floor(Math.random() * STAGES.length);
    input.value = n;
    devOpenStage(n);
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") go();
  });
}

/* Cards fill the actual board width for THIS stage's own column count
   (3, 4, or 5 — see js/stageConfig.js), instead of always being sized
   as if the board had 5 columns. Sizing for a fixed 5-column reference
   used to keep card size identical across every stage, but it meant a
   3- or 4-column stage (most of them — 5 is the max) left a whole
   extra column's worth of width, and the card size that comes with
   using it, sitting empty — cards ended up noticeably smaller and
   harder to grab than the screen had room for. */
function updateCardMetrics() {
  const s = Game.getState();
  const columns = (s && s.tableau && s.tableau.length) || 4;
  const w = tableauEl.clientWidth || window.innerWidth - 16;
  const divisor = (5 * columns - 1) / 4; // edge to edge across THIS stage's columns
  const fullW = w / divisor;
  const cardW = fullW * 0.85; // 15% smaller than a full-bleed card
  const cardH = cardW * (108 / 84); // keep the original card proportions
  const gap = cardW * 0.25;
  const fontSize = cardW * 0.2; // scale the word text with the card so it fills it well
  const root = document.documentElement.style;
  root.setProperty("--card-w", cardW.toFixed(1) + "px");
  root.setProperty("--card-h", cardH.toFixed(1) + "px");
  root.setProperty("--card-gap", gap.toFixed(1) + "px");
  root.setProperty("--card-fs", fontSize.toFixed(1) + "px");
  root.setProperty("--tableau-cols", columns);
  root.setProperty("--foundation-slots", (s && s.slots && s.slots.length) || 4);
  // The face-down stock sits just past the last tableau column, so it
  // never overlaps the board. The face-up waste (front card + its 2
  // peeks) is a separate pile entirely and sits immediately to the
  // stock's left, since it's the pile the player is actively working
  // from — anchored to the stock's OWN (already-clamped) position
  // rather than a fixed fraction of the row, so the two piles never
  // overlap regardless of how big a card ends up being on a
  // narrow-column stage (a 3-column stage's cards run noticeably
  // bigger than a 5-column stage's — see updateCardMetrics above).
  const contentWidth = columns * (cardW + gap); // left edge of the column just past the last one
  const wasteWidth = cardW * 1.64;
  const stockLeft = Math.max(0, Math.min(contentWidth, w - cardW));
  const wasteLeft = Math.max(0, stockLeft - gap - wasteWidth);
  root.setProperty("--stock-left", stockLeft.toFixed(1) + "px");
  root.setProperty("--waste-left", wasteLeft.toFixed(1) + "px");
  return { cardW, cardH, gap, fontSize, columns };
}

/* Auto-fit word text: start from the base size and shrink (never grow)
   just enough that the word stays on one line and actually fills the
   card, instead of wrapping to two lines and leaving empty space. */
const measureCtx = document.createElement("canvas").getContext("2d");
function fittedFontSize(text, basePx, maxWidthPx, weight) {
  measureCtx.font = `${weight} ${basePx}px Nunito, sans-serif`;
  const width = measureCtx.measureText(text).width;
  if (width <= maxWidthPx) return basePx;
  return Math.max(basePx * (maxWidthPx / width), basePx * 0.5);
}

function renderGame() {
  const s = Game.getState();
  if (!s) return;

  const metrics = updateCardMetrics();

  statMoves.textContent = s.movesLeft;
  statHints.textContent = s.hintsLeft;
  statCoins.textContent = s.coins;

  statMoves.classList.toggle("warn", s.movesLeft <= 4);
  hintBtn.disabled = s.hintsLeft <= 0;
  hintBtn.classList.toggle("armed", s.hintMode);
  statUndos.textContent = s.undosLeft;
  undoBtn.disabled = s.undosLeft <= 0;
  updateComboBadge(s.comboStreak);

  renderStock(s);
  renderWaste(s, metrics);
  renderSlots(s, metrics);
  renderTableau(s, metrics);

  setModalOpen(hintModal, hintModalBox, !!s.lastHint);
  if (s.lastHint) {
    hintWord.textContent = s.lastHint.word;
    hintMeaning.textContent = s.lastHint.meaning;
    hintExample.textContent = s.lastHint.example;
    hintRelation.textContent = `${s.lastHint.relationType}: ${s.lastHint.relationName}`;
    hintExample.style.display = s.lastHint.isMarker ? "none" : "block";
    el("#hint-example-label").style.display = s.lastHint.isMarker ? "none" : "block";
  }

  s.lastBlocked = null;
  s.lastCombo = null;
  s.lastCompletedCategory = null;

  setModalOpen(stuckModal, stuckModalBox, s.status === "stuck");
  if (s.status === "stuck") {
    stuckPairsLeft.textContent = s.cardsLeft;
    const cost = Game.nextMoveCost();
    buyMovesBtn.innerHTML = `Add 5 Moves — ${coinIcon()} ${cost}`;
    buyMovesBtn.disabled = s.coins < cost;
  }

  setModalOpen(winModal, winModalBox, s.status === "won");
  if (s.status === "won") {
    winStageNum.textContent = s.stageId;
    winTitle.textContent = s.hintsUsed === 0 && s.movesLeft > 0 ? "Perfect!" : "Level Complete!";
    winReward.textContent = s.reward;
    winMovesUsed.textContent = s.movesUsed;
    nextStageBtn.style.display = s.stageId >= STAGES.length ? "none" : "inline-block";
    if (!wonSoundPlayed) {
      wonSoundPlayed = true;
      Sound.win();
      Haptics.win();
    }
  }

  if (typeof Tutorial !== "undefined") Tutorial.onRender(s);
}

function makeCardFace(card, extraClass, s, metrics) {
  const div = document.createElement("div");
  div.dataset.cardId = card.id; // lets js/tutorial.js find a specific card's element to spotlight
  div.className = "card face-up" + (card.isMarker ? " marker-card" : "") + (extraClass ? " " + extraClass : "");
  const cardW = (metrics && metrics.cardW) || 84;
  const maxTextWidth = cardW - 16;
  if (card.isMarker) {
    const cat = s.categoryPool[card.categoryIndex];
    const baseFs = ((metrics && metrics.fontSize) || 16) * 0.9;
    const fs = fittedFontSize(card.word, baseFs, maxTextWidth, 900);
    div.innerHTML = `
      <div class="marker-progress">${cat.collected}/${cat.target}</div>
      <span class="card-word" style="font-size:${fs.toFixed(1)}px">${card.word}</span>
      <span class="marker-crown">${wMarkIcon()}</span>
    `;
  } else {
    const baseFs = (metrics && metrics.fontSize) || 16;
    const fs = fittedFontSize(card.word, baseFs, maxTextWidth, 800);
    div.innerHTML = `<span class="card-word" style="font-size:${fs.toFixed(1)}px">${card.word}</span>`;
  }
  return div;
}

/* ---------- Drag and drop ----------
   A card is picked up, follows the pointer, and is only played if
   it's dropped over a SPECIFIC target: a particular foundation slot
   (the player's choice, not auto-picked), or — for tableau cards only
   — another tableau column (empty, or fronted by a same-category
   card) to dig through the board Klondike-style. Dropped anywhere
   invalid, it just glides back; nothing is ever explained in a toast. */
let dragInfo = null;

/* Tap-to-move: an alternative to dragging. Tap a playable card to
   select it (tap it again to cancel), then tap a foundation slot or a
   tableau column to send it there — exactly the same moves dragging
   allows, just via two taps instead of one continuous gesture. Only
   one card is ever selected at a time. */
let selection = null;

function pointInRect(x, y, rect) {
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

/* Shared between the drag and tap paths so both sound the same and
   drive the same combo/streak feedback for an identical outcome. */
function playMoveFeedbackSound(result, combo) {
  if (result.success) {
    if (result.kind === "foundation") {
      Sound.deliver();
      Haptics.deliver();
    } else {
      Sound.stack();
      Haptics.stack();
    }
    if (combo && combo.bonus > 0) {
      const milestone = COMBO_MILESTONES.find((m) => m.threshold === combo.streak);
      if (milestone) {
        Sound.milestone(milestone.tier);
        Haptics.milestone(milestone.tier);
        showToast(`${milestone.label} +${combo.bonus} ${coinIcon("toast-coin")}`, "good");
      } else {
        Sound.combo(combo.streak);
        Haptics.combo(combo.streak);
        showToast(`🔥 Streak ×${combo.streak} — +${combo.bonus} ${coinIcon("toast-coin")}`, "good");
      }
    }
  } else if (result.kind) {
    Sound.wrong();
    Haptics.wrong();
    const { priorStreak } = Game.breakCombo();
    if (priorStreak >= 3) showToast("Streak broken 💔", "bad");
  }
}

function applyCategoryCompletionEffects(completed) {
  if (!completed) return;
  Sound.complete();
  Haptics.complete();
  const slotEl = foundationsEl.children[completed.slotIndex];
  if (slotEl) {
    const r = slotEl.getBoundingClientRect();
    spawnConfetti(r.left + r.width / 2, r.top + r.height / 2);
  }
}

/* Tapping a card: nothing selected yet → select this one. Tapping the
   already-selected card again → cancel. Otherwise the player already
   has a card in hand and just tapped a DIFFERENT tableau card — that
   reads as "send my selection to this card's column", the same as if
   they'd dragged it there and dropped it on that column. */
function handleCardTap(card, source) {
  if (selection && selection.card.id === card.id) {
    selection = null;
    renderGame();
    return;
  }
  if (!selection) {
    selection = { card, source };
    Sound.pickup();
    Haptics.pickup();
    renderGame();
    return;
  }
  if (source.type === "tableau") {
    attemptTapMoveToColumn(source.colIdx);
  } else {
    // The waste pile is never a valid move target, so tapping its front
    // card while something else is selected doesn't change anything —
    // but the tapped card's element was already pulled out of the DOM
    // by the drag-lift/tap machinery in finishDrag, so it still needs a
    // render to reappear instead of leaving a visible gap behind.
    renderGame();
  }
}

function attemptTapMoveToSlot(slotIndex) {
  if (!selection) return;
  const { card, source } = selection;
  selection = null;
  const targetEl = foundationsEl.children[slotIndex];
  const before = Game.getState().cardsLeft;
  Game.playClusterToSlot(card, slotIndex, source);
  const success = Game.getState().cardsLeft < before;
  const result = { success, kind: "foundation" };
  if (success) {
    const combo = Game.getState().lastCombo;
    const completed = Game.getState().lastCompletedCategory;
    playMoveFeedbackSound(result, combo);
    renderGame();
    applyCategoryCompletionEffects(completed);
  } else {
    if (targetEl) shakeElement(targetEl);
    playMoveFeedbackSound(result, null);
    setTimeout(renderGame, 350);
  }
}

function attemptTapMoveToColumn(colIdx) {
  if (!selection) return;
  const { card, source } = selection;
  if (source.type === "tableau" && source.colIdx === colIdx) {
    selection = null;
    renderGame();
    return;
  }
  selection = null;
  const colDivs = Array.from(tableauEl.querySelectorAll(".tableau-col"));
  const targetEl = colDivs[colIdx];
  let success;
  if (source.type === "tableau") {
    const before = Game.getState().tableau[source.colIdx].length;
    Game.moveTableauCard(source.colIdx, colIdx);
    success = Game.getState().tableau[source.colIdx].length < before;
  } else {
    const beforeWaste = Game.getState().waste.length;
    Game.moveWasteToTableau(colIdx);
    success = Game.getState().waste.length < beforeWaste;
  }
  const result = { success, kind: "tableau" };
  if (success) {
    const combo = Game.getState().lastCombo;
    const completed = Game.getState().lastCompletedCategory;
    playMoveFeedbackSound(result, combo);
    renderGame();
    applyCategoryCompletionEffects(completed);
  } else {
    if (targetEl) shakeElement(targetEl);
    playMoveFeedbackSound(result, null);
    setTimeout(renderGame, 350);
  }
}

/* Resolves a drop and returns { success, targetEl, kind } — targetEl (when
   present) is the DOM element the card actually landed on, used to
   glide the drag visual into place and, for a completed category, to
   anchor the confetti burst. `kind` tells the caller which sound fits:
   "foundation" (landed on a category card) or "tableau" (stacked onto a
   matching card in the tableau) — a plain failure omits it, since the
   caller plays one shared "wrong place" sound for any miss. */
function resolveDrop(card, source, x, y) {
  if (pointInRect(x, y, foundationsEl.getBoundingClientRect())) {
    // Precise per-slot targeting for every card, not just collectors:
    // the drop lands wherever the pointer actually is above the
    // category card, instead of an auto-picked/blind destination.
    const slotDivs = Array.from(foundationsEl.querySelectorAll(".foundation"));
    let targetSlot = -1;
    let targetEl = null;
    slotDivs.forEach((slotEl, i) => {
      if (pointInRect(x, y, slotEl.getBoundingClientRect())) {
        targetSlot = i;
        targetEl = slotEl;
      }
    });
    if (targetSlot === -1) return { success: false };
    const before = Game.getState().cardsLeft;
    Game.playClusterToSlot(card, targetSlot, source);
    const success = Game.getState().cardsLeft < before;
    if (!success) shakeElement(targetEl);
    return { success, targetEl: success ? targetEl : null, kind: "foundation" };
  }

  const colDivs = Array.from(tableauEl.querySelectorAll(".tableau-col"));
  for (let i = 0; i < colDivs.length; i++) {
    if (source.type === "tableau" && i === source.colIdx) continue;
    if (pointInRect(x, y, colDivs[i].getBoundingClientRect())) {
      if (source.type === "tableau") {
        const before = Game.getState().tableau[source.colIdx].length;
        Game.moveTableauCard(source.colIdx, i);
        const success = Game.getState().tableau[source.colIdx].length < before;
        if (!success) shakeElement(colDivs[i]);
        return { success, targetEl: success ? colDivs[i] : null, kind: "tableau" };
      }
      const beforeWaste = Game.getState().waste.length;
      Game.moveWasteToTableau(i);
      const success = Game.getState().waste.length < beforeWaste;
      if (!success) shakeElement(colDivs[i]);
      return { success, targetEl: success ? colDivs[i] : null, kind: "tableau" };
    }
  }

  return { success: false };
}

function attachDragOrHint(cardEl, card, source) {
  cardEl.addEventListener("pointerdown", (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    const s = Game.getState();
    if (s.hintMode) {
      // Without this, the browser's own default pointerdown-focus
      // behavior runs right after this handler and steals focus back
      // to <body> — undoing the modal's own focus() call inside
      // renderGame() a moment later.
      e.preventDefault();
      Game.hintForCard(card);
      renderGame();
      return;
    }
    if (s.status !== "playing") return;

    const rect = cardEl.getBoundingClientRect();

    // If this card is the front of a same-category tableau cluster,
    // carry the WHOLE thing visually — a little fan of cards behind
    // the one you actually grabbed — so it's clear you're moving the
    // group, not just the top card.
    let clusterCount = 1;
    if (source.type === "tableau") {
      clusterCount = Game.getFrontClusterSize(source.colIdx);
    }

    let moveEl = cardEl;
    if (clusterCount > 1) {
      // The rest of the cluster (the thin label bars above/below the
      // card actually grabbed) must disappear from the pile for the
      // duration of the drag too — otherwise they just sit there
      // looking left-behind while only the grabbed card visibly moves,
      // even though the whole cluster does move together underneath.
      if (source.type === "tableau" && cardEl.parentElement) {
        Array.from(cardEl.parentElement.querySelectorAll(".cluster-label")).forEach((el) => {
          if (el !== cardEl) el.style.visibility = "hidden";
        });
      }
      const wrapper = document.createElement("div");
      wrapper.className = "drag-stack";
      Object.assign(wrapper.style, {
        position: "fixed",
        left: rect.left + "px",
        top: rect.top + "px",
        width: rect.width + "px",
        height: rect.height + "px",
        zIndex: 1000,
      });
      const ghostCount = Math.min(clusterCount - 1, 3);
      for (let i = ghostCount; i >= 1; i--) {
        const ghost = document.createElement("div");
        ghost.className = "card card-back drag-ghost";
        ghost.style.transform = `translate(${i * 5}px, ${i * 5}px)`;
        wrapper.appendChild(ghost);
      }
      const badge = document.createElement("div");
      badge.className = "drag-count-badge";
      badge.textContent = "×" + clusterCount;
      wrapper.appendChild(badge);
      cardEl.style.position = "absolute";
      cardEl.style.left = "0";
      cardEl.style.top = "0";
      cardEl.style.margin = "0";
      wrapper.appendChild(cardEl);
      document.body.appendChild(wrapper);
      moveEl = wrapper;
    } else {
      document.body.appendChild(cardEl);
      Object.assign(cardEl.style, {
        position: "fixed",
        left: rect.left + "px",
        top: rect.top + "px",
        width: rect.width + "px",
        height: rect.height + "px",
        margin: "0",
        zIndex: 1000,
        transition: "none",
      });
    }

    dragInfo = {
      innerEl: cardEl,
      moveEl,
      startX: e.clientX,
      startY: e.clientY,
      origLeft: rect.left,
      origTop: rect.top,
    };
    Sound.pickup();
    Haptics.pickup();
    cardEl.setPointerCapture(e.pointerId);
    cardEl.classList.add("dragging");
    e.preventDefault();
  });

  cardEl.addEventListener("pointermove", (e) => {
    if (!dragInfo || dragInfo.innerEl !== cardEl) return;
    const dx = e.clientX - dragInfo.startX;
    const dy = e.clientY - dragInfo.startY;
    dragInfo.moveEl.style.left = dragInfo.origLeft + dx + "px";
    dragInfo.moveEl.style.top = dragInfo.origTop + dy + "px";
  });

  const finishDrag = (e) => {
    if (!dragInfo || dragInfo.innerEl !== cardEl) return;
    const { origLeft, origTop, moveEl, startX, startY } = dragInfo;
    cardEl.classList.remove("dragging");
    dragInfo = null;

    // Released almost exactly where it was picked up — that's a tap,
    // not a drag. Put it back down with no animation (nothing actually
    // moved) and hand it to the tap-to-select flow instead.
    const moved = Math.hypot(e.clientX - startX, e.clientY - startY) > 6;
    if (!moved) {
      moveEl.remove();
      handleCardTap(card, source);
      return;
    }

    const result = resolveDrop(card, source, e.clientX, e.clientY);
    if (result.success) {
      const st = Game.getState();
      const combo = st.lastCombo;
      const completed = st.lastCompletedCategory;
      playMoveFeedbackSound(result, combo);

      const finish = () => {
        renderGame();
        applyCategoryCompletionEffects(completed);
      };

      const targetRect = result.targetEl ? result.targetEl.getBoundingClientRect() : null;
      if (targetRect) {
        const w = moveEl.offsetWidth;
        const h = moveEl.offsetHeight;
        moveEl.style.transition = "left 0.16s ease, top 0.16s ease, opacity 0.16s ease";
        moveEl.style.left = targetRect.left + (targetRect.width - w) / 2 + "px";
        moveEl.style.top = targetRect.top + (targetRect.height - h) / 2 + "px";
        moveEl.style.opacity = "0.35";
        setTimeout(() => {
          moveEl.remove();
          finish();
        }, 160);
      } else {
        moveEl.remove();
        finish();
      }
    } else {
      // Only a drop clearly AIMED at a specific card (a category slot or
      // a tableau column) and rejected counts as a mistake. Releasing
      // over empty space isn't an attempt at anything — no kind at all —
      // so it just glides back with no sound and no cost to the streak.
      playMoveFeedbackSound(result, null);
      moveEl.style.transition = "left 0.22s ease, top 0.22s ease";
      moveEl.style.left = origLeft + "px";
      moveEl.style.top = origTop + "px";
      setTimeout(() => {
        moveEl.remove();
        renderGame();
      }, 230);
    }
  };

  cardEl.addEventListener("pointerup", finishDrag);
  cardEl.addEventListener("pointercancel", finishDrag);
  cardEl.addEventListener("lostpointercapture", finishDrag);
}

// Safety net: some input paths (trackpads, certain automated/assistive
// tools) can fail to deliver pointerup to the dragged element itself.
// Without this, the card would be stuck floating forever.
window.addEventListener("pointerup", (e) => {
  if (dragInfo && dragInfo.innerEl) dragInfo.innerEl.dispatchEvent(new PointerEvent("pointerup", e));
});

function renderStock(s) {
  stockEl.innerHTML = "";
  const canDraw = s.status === "playing" && (s.stock.length > 0 || s.waste.length > 0);
  const pile = document.createElement("button");
  pile.className = "card card-back stock-pile" + (s.stock.length === 0 ? " empty" : "");
  pile.disabled = !canDraw;
  pile.innerHTML =
    s.stock.length > 0
      ? `<span class="stock-count">${s.stock.length}</span>`
      : s.waste.length > 0
      ? `<span class="stock-recycle">↺</span>`
      : "";
  pile.addEventListener("click", () => {
    Game.drawStock();
    Sound.flip();
    Haptics.flip();
    renderGame();
  });
  stockEl.appendChild(pile);
}

/* A peek is a narrow, non-interactive sliver showing just a previous
   waste card's word turned sideways — visible so the player can see
   what's coming, but only the front card (a real .card) can actually
   be dragged or hinted. */
function makeWastePeek(card, metrics) {
  const div = document.createElement("div");
  div.className = "waste-peek" + (card.isReview ? " review" : "") + (card.isMarker ? " marker" : "");
  const cardH = (metrics && metrics.cardH) || 108;
  const maxTextLen = cardH - 20;
  const baseFs = (metrics && metrics.fontSize) || 16;
  const fs = fittedFontSize(card.word, baseFs * 0.85, maxTextLen, card.isMarker ? 900 : 800);
  div.innerHTML = `<span class="card-word waste-peek-word" style="font-size:${fs.toFixed(1)}px">${card.word}</span>`;
  return div;
}

function renderWaste(s, metrics) {
  wasteEl.innerHTML = "";
  const visible = s.waste.slice(-VISIBLE_WASTE);
  const n = visible.length;
  const cardW = (metrics && metrics.cardW) || 84;
  const peekWidth = cardW * 0.32;
  visible.forEach((card, i) => {
    const depth = n - 1 - i; // 0 = frontmost, 1 = next behind, 2 = furthest shown
    if (depth === 0) {
      const cardEl = makeCardFace(card, "waste-card playable", s, metrics);
      cardEl.style.left = "0px";
      cardEl.style.zIndex = 10;
      if (s.hintMode) cardEl.classList.add("hintable");
      if (selection && selection.card.id === card.id) cardEl.classList.add("tap-selected");
      attachDragOrHint(cardEl, card, { type: "waste" });
      wasteEl.appendChild(cardEl);
    } else {
      const peekEl = makeWastePeek(card, metrics);
      peekEl.style.left = (cardW + (depth - 1) * peekWidth).toFixed(1) + "px";
      peekEl.style.zIndex = 10 - depth;
      wasteEl.appendChild(peekEl);
    }
  });
}

function renderSlots(s, metrics) {
  foundationsEl.innerHTML = "";
  const cardW = (metrics && metrics.cardW) || 84;
  const baseFs = (metrics && metrics.fontSize) || 16;
  s.slots.forEach((catIdx, slotIndex) => {
    const wrap = document.createElement("div");
    const f = catIdx === null ? null : s.categoryPool[catIdx];
    const complete = f && f.collected >= f.target;

    wrap.className = "foundation" + (!f ? " locked" : f.collected === 0 ? " empty" : "") + (complete ? " complete" : "");

    let tag = "";
    let body;
    if (!f) {
      body = `<div class="foundation-mystery"><span class="foundation-mystery-w">W</span></div>`;
    } else if (f.collected === 0) {
      const nameFs = fittedFontSize(f.name, baseFs * 0.68, cardW - 14, 800);
      body = `<div class="foundation-name" style="font-size:${nameFs.toFixed(1)}px">${f.name}</div>
              <div class="foundation-progress">${f.collected}/${f.target}</div>
              <div class="foundation-crown">${wMarkIcon()}</div>`;
    } else {
      const tagFs = fittedFontSize(f.name, baseFs * 0.6, cardW - 18, 800);
      // The delivered word is the card's whole point, so it gets to be
      // the dominant thing on it — sized well past the tag/progress
      // text, same fit-then-shrink logic so a long word still fits.
      const wordFs = fittedFontSize(f.lastWord || "", baseFs * 1.2, cardW - 14, 800);
      tag = `<div class="foundation-tag" style="font-size:${tagFs.toFixed(1)}px">${f.name}</div>`;
      body = `<div class="foundation-last-word" style="font-size:${wordFs.toFixed(1)}px">${f.lastWord || ""}</div>
              ${complete ? `<div class="foundation-crown gold">${wMarkIcon()}</div>` : `<div class="foundation-progress big">${f.collected}/${f.target}</div>`}`;
    }

    const cardCls = "card foundation-card" + (f && !complete ? " active-cat" : "");
    wrap.innerHTML = `${tag}<div class="${cardCls}">${body}</div>`;
    wrap.addEventListener("click", () => attemptTapMoveToSlot(slotIndex));
    foundationsEl.appendChild(wrap);
  });
}

function renderTableau(s, metrics) {
  const cardH = (metrics && metrics.cardH) || 108;
  const backStep = cardH * 0.13;
  const clusterStep = cardH * 0.3;

  tableauEl.innerHTML = "";
  s.tableau.forEach((col, colIdx) => {
    const colEl = document.createElement("div");
    colEl.className = "tableau-col";

    const pileEl = document.createElement("div");
    pileEl.className = "tableau-pile";
    const backs = col.filter((c) => !c.faceUp);
    const faceUpCards = col.filter((c) => c.faceUp); // original order; last = frontmost
    const backsCount = backs.length;
    pileEl.style.height = backsCount * backStep + Math.max(0, faceUpCards.length - 1) * clusterStep + cardH + "px";

    backs.forEach((card, i) => {
      const backEl = document.createElement("div");
      backEl.className = "card card-back tableau-card-back";
      backEl.style.zIndex = i;
      backEl.style.top = i * backStep + "px";
      pileEl.appendChild(backEl);
    });

    faceUpCards.forEach((card, idx) => {
      const isFrontmost = idx === faceUpCards.length - 1;
      const top = backsCount * backStep + idx * clusterStep;
      if (isFrontmost) {
        const cardEl = makeCardFace(card, "tableau-card playable", s, metrics);
        cardEl.style.zIndex = 100 + idx;
        cardEl.style.top = top + "px";
        if (s.hintMode) cardEl.classList.add("hintable");
        if (card.justRevealed) {
          cardEl.classList.add("flip-in");
          card.justRevealed = false;
        }
        if (selection && selection.card.id === card.id) cardEl.classList.add("tap-selected");
        attachDragOrHint(cardEl, card, { type: "tableau", colIdx });
        pileEl.appendChild(cardEl);
      } else {
        const labelEl = document.createElement("div");
        labelEl.className = "cluster-label" + (card.isReview ? " review" : "") + (s.hintMode ? " hintable" : "") + (card.isMarker ? " marker" : "");
        const cardW = (metrics && metrics.cardW) || 84;
        const labelFs = fittedFontSize(card.word, ((metrics && metrics.fontSize) || 16) * 0.85, cardW - 14, 800);
        labelEl.style.fontSize = labelFs.toFixed(1) + "px";
        labelEl.textContent = card.word;
        labelEl.style.top = top + "px";
        // Full card height (not shrunk to clusterStep) — same as every
        // back card and the front card itself. A buried card in a real
        // stack doesn't get physically smaller; it's just as tall as
        // any other card, and the next card's higher z-index naturally
        // hides everything below where that next card starts. Shrinking
        // the label to fit the visible sliver was what made it read as
        // a separate floating tab instead of an actual card peeking out
        // from behind the one in front of it.
        labelEl.style.zIndex = 100 + idx;
        if (selection && selection.card.id === card.id) labelEl.classList.add("tap-selected");
        attachDragOrHint(labelEl, card, { type: "tableau", colIdx });
        pileEl.appendChild(labelEl);
      }
    });

    colEl.appendChild(pileEl);
    if (col.length === 0) colEl.classList.add("empty-col");

    // Only fires for a tap that lands on genuinely empty column space —
    // a tap that lands on an actual card is handled by that card's own
    // tap logic (attachDragOrHint/handleCardTap) instead, since the
    // event target there is the card, not colEl/pileEl themselves.
    colEl.addEventListener("click", (e) => {
      if (e.target === colEl || e.target === pileEl) attemptTapMoveToColumn(colIdx);
    });

    tableauEl.appendChild(colEl);
  });
}

hintBtn.addEventListener("click", () => {
  const s = Game.getState();
  selection = null;
  if (s.hintMode) Game.cancelHint();
  else Game.armHint();
  renderGame();
});

undoBtn.addEventListener("click", () => {
  selection = null;
  Game.undo();
  renderGame();
});

hintCloseBtn.addEventListener("click", () => {
  Game.dismissHint();
  renderGame();
});

hintSpeakBtn.addEventListener("click", () => {
  const s = Game.getState();
  if (!s || !s.lastHint) return;
  Sound.speak(s.lastHint.word);
  hintSpeakBtn.classList.remove("speaking");
  void hintSpeakBtn.offsetWidth; // restart the pulse animation on repeat clicks
  hintSpeakBtn.classList.add("speaking");
});

buyMovesBtn.addEventListener("click", () => {
  Game.buyMoves();
  renderGame();
});

// Restart/Give-up only ever appear on the stuck modal — reached this
// screen means the attempt already failed (out of moves), so walking
// away from it either way costs a heart. Paying for more moves
// (buyMovesBtn above) is the only way to keep the SAME attempt alive
// without losing one.
restartBtn.addEventListener("click", () => {
  selection = null;
  const save = Game.loseLife();
  if (save.lives <= 0) {
    showScreen("stages");
    renderHome();
    showNoHeartsModal();
    return;
  }
  Game.restart();
  renderGame();
});

giveUpBtn.addEventListener("click", () => {
  Game.loseLife();
  showScreen("stages");
  renderHome();
});

nextStageBtn.addEventListener("click", () => {
  const s = Game.getState();
  openStage(Math.min(s.stageId + 1, STAGES.length));
});

winStagesBtn.addEventListener("click", () => {
  showScreen("stages");
  renderHome();
});

homeContinueBtn.addEventListener("click", () => {
  openStage(Game.getSave().unlockedStage);
});

homeAddBtn.addEventListener("click", () => {
  showToast("Coin shop coming soon!", "good");
});

function updateSettingsSoundBtn() {
  settingsSoundBtn.setAttribute("aria-checked", Sound.isOn() ? "true" : "false");
}

function updateSettingsVibrationBtn() {
  settingsVibrationBtn.setAttribute("aria-checked", Haptics.isOn() ? "true" : "false");
}

function openSettings() {
  updateSettingsSoundBtn();
  updateSettingsVibrationBtn();
  settingsBackBtn.style.display = screenGame.classList.contains("active") ? "" : "none";
  setModalOpen(settingsModal, settingsModalBox, true);
}

homeSettingsBtn.addEventListener("click", openSettings);
gameSettingsBtn.addEventListener("click", openSettings);

settingsSoundBtn.addEventListener("click", () => {
  Sound.toggle();
  updateSettingsSoundBtn();
});

settingsVibrationBtn.addEventListener("click", () => {
  Haptics.toggle();
  updateSettingsVibrationBtn();
});

settingsBackBtn.addEventListener("click", () => {
  setModalOpen(settingsModal, settingsModalBox, false);
  showScreen("stages");
  renderHome();
});

settingsHowToPlayBtn.addEventListener("click", () => {
  setModalOpen(settingsModal, settingsModalBox, false);
  if (typeof Tutorial !== "undefined") Tutorial.replayIntro();
});

settingsCloseBtn.addEventListener("click", () => {
  setModalOpen(settingsModal, settingsModalBox, false);
});

refillHeartsBtn.addEventListener("click", () => {
  const save = Game.refillLives();
  if (!save) {
    showToast("Not enough coins", "bad");
    return;
  }
  setModalOpen(noHeartsModal, noHeartsModalBox, false);
  renderHome();
});

noHeartsCloseBtn.addEventListener("click", () => {
  setModalOpen(noHeartsModal, noHeartsModalBox, false);
});

function init() {
  renderHome();
  showScreen("stages");
  if (DEV_MODE) setupDevPanel();
}

document.addEventListener("DOMContentLoaded", init);
