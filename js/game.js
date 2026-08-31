/* ============================================================
   Word Solitaire — Game Engine (Klondike-style word collector)

   Layout per stage:
   - A POOL of relation groups (more than the 4 visible slots).
     Each group's collector card is shuffled into the tableau and
     stock like any other card — genuinely mixed in, at any depth.
     Tapping a collector card claims an empty slot (or a slot whose
     previous category is already complete) and reveals that
     group's name, target and crown. Only then can matching word
     cards be sent to it. If all 4 slots are busy with unfinished
     categories, the collector card is blocked until one frees up.
   - 4 Tableau columns dealt from the stage's words + collector
     cards. Only the front (bottom-most) card of a column is face
     up and playable; clearing it reveals the card underneath.
   - A Stock pile (face down) and a Waste pile. Tapping the stock
     draws ONE card at a time onto the waste — the new card is
     placed on top (playable right away) and the previous one
     slides behind it: still visible, but not playable until the
     card in front of it is cleared. When the stock is empty,
     tapping it recycles the waste back into the stock so play can
     continue.
   ============================================================ */

const SAVE_KEY = "solitaireGrow_save_v4";
const DRAW_COUNT = 1;
const VISIBLE_WASTE = 3; // the front card plus 2 peeking behind it

const MAX_LIVES = 5;
const LIFE_REGEN_MS = 30 * 60 * 1000; // one heart every 30 minutes
const HEART_REFILL_COST = 50;
const SHUFFLE_COST = 99;
const JOKER_COST = 99;

const DEFAULT_SAVE = { coins: 20, unlockedStage: 1, lives: MAX_LIVES, lastLifeLostAt: null, updatedAt: 0 };

/* Guards against more than just a JSON parse failure: a save written by
   an older/newer version, a partial write cut off mid-write, or a
   hand-edited localStorage value could all produce a validly-parsed
   object with a missing or garbage coins/unlockedStage — which would
   otherwise turn into NaN the moment it's used (save.coins += reward,
   etc.) and quietly corrupt the coin badge from then on. Anything that
   doesn't look like a real number/stage id falls back to the default
   for just that field, not the whole save. */
function sanitizeSave(raw) {
  const save = raw && typeof raw === "object" ? raw : {};
  const coins = Number.isFinite(save.coins) && save.coins >= 0 ? Math.floor(save.coins) : DEFAULT_SAVE.coins;
  const maxStage = typeof STAGES !== "undefined" ? STAGES.length : 100;
  const unlockedStage =
    Number.isInteger(save.unlockedStage) && save.unlockedStage >= 1 && save.unlockedStage <= maxStage
      ? save.unlockedStage
      : DEFAULT_SAVE.unlockedStage;
  const lives = Number.isInteger(save.lives) && save.lives >= 0 && save.lives <= MAX_LIVES ? save.lives : MAX_LIVES;
  const lastLifeLostAt = Number.isFinite(save.lastLifeLostAt) && save.lastLifeLostAt <= Date.now() ? save.lastLifeLostAt : null;
  const updatedAt = Number.isFinite(save.updatedAt) && save.updatedAt >= 0 ? save.updatedAt : 0;
  return { coins, unlockedStage, lives, lastLifeLostAt, updatedAt };
}

/* Hearts refill one at a time while below the cap, LIFE_REGEN_MS apart —
   computed fresh from the stored timestamp every time the save is read,
   rather than needing a running timer, so it's correct even after the
   game was closed for a while. Stops (and clears the timestamp) once
   full. */
function regenLives(save) {
  if (save.lives >= MAX_LIVES || !save.lastLifeLostAt) return save;
  const gained = Math.floor((Date.now() - save.lastLifeLostAt) / LIFE_REGEN_MS);
  if (gained <= 0) return save;
  save.lives = Math.min(MAX_LIVES, save.lives + gained);
  save.lastLifeLostAt = save.lives >= MAX_LIVES ? null : save.lastLifeLostAt + gained * LIFE_REGEN_MS;
  return save;
}

function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const save = regenLives(sanitizeSave(JSON.parse(raw)));
      saveGame(save);
      return save;
    }
  } catch (e) {
    /* corrupted JSON — fall through to the default save below */
  }
  return { ...DEFAULT_SAVE };
}

/* Never let a storage failure (Safari private mode, a full/disabled
   store, a browser extension blocking localStorage) throw up through
   whatever move triggered it — bumpCombo/checkEnd/buyMoves all call
   this mid-move, and an uncaught exception there would freeze that
   move instead of just silently not persisting this one save. */
function saveGame(save) {
  save.updatedAt = Date.now();
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  } catch (e) {
    /* progress for this session still works in memory; it just won't
       survive a reload until storage is available again */
  }
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* How many consecutive cards at the front of a column share the same
   category as the very frontmost one — that run is a "cluster" that
   drags and delivers as a single unit. A collector card can sit
   anywhere inside that run (front, buried under later same-category
   words, or both) — as long as every card in the run is the same
   category, the whole thing moves and delivers together.
   Crucially, this only ever looks at cards that are ALREADY face-up:
   a still-hidden card underneath just happening to share the same
   category (pure luck of the deal) must never get swept along for
   free — the player hasn't uncovered it yet, so it isn't "part of"
   anything until it's revealed on its own. */
function frontClusterSize(col, wordToCategory) {
  if (col.length === 0) return 0;
  const catOf = (c) => (c.isMarker ? c.categoryIndex : wordToCategory[c.word]);
  const front = col[col.length - 1];
  if (!front.faceUp) return 0;
  const frontCategory = catOf(front);
  let count = 1;
  for (let i = col.length - 2; i >= 0; i--) {
    const c = col[i];
    if (!c.faceUp || catOf(c) !== frontCategory) break;
    count++;
  }
  return count;
}

/* Reveals a column's new front card exactly once — used everywhere a
   move uncovers the card underneath, so the UI can play a one-shot
   flip animation instead of the card just silently appearing. */
function revealFront(col) {
  if (col.length === 0) return;
  const front = col[col.length - 1];
  if (!front.faceUp) {
    front.faceUp = true;
    front.justRevealed = true;
  }
}

/* Combo bonus coins for a streak of correct moves: nothing for the
   first couple, then the payout steps up in tiers (rather than a flat
   +1/hit) so a long streak keeps feeling more rewarding instead of
   flattening out once it hits a low cap. Tiers line up with the
   milestone toasts in ui.js (3 / 6 / 10 / 15). */
function comboBonusFor(streak) {
  if (streak < 3) return 0;
  if (streak < 6) return 1;
  if (streak < 10) return 2;
  if (streak < 15) return 4;
  return 6;
}

/* A card (word or collector) may land on an empty column, or on a
   column whose front card belongs to the SAME category — a collector
   card may cap a pile of its own words, but a plain word may never
   bury a collector card. Landing on a DIFFERENT category's front card
   is never allowed either way. The only place a word "joins" its
   collector is the actual delivery to the foundation slot — stacking
   a word on top of a collector card in the tableau would look like
   progress without being any, so it's blocked here. */
function isValidTableauTarget(card, dst, wordToCategory) {
  if (dst.length === 0) return true;
  const dstFront = dst[dst.length - 1];
  const dstCategory = dstFront.isMarker ? dstFront.categoryIndex : wordToCategory[dstFront.word];
  const cardCategory = card.isMarker ? card.categoryIndex : wordToCategory[card.word];
  if (dstCategory !== cardCategory) return false;
  if (dstFront.isMarker && !card.isMarker) return false;
  return true;
}

/* Deals a stage's cards between the tableau and the stock, and shapes
   the tableau columns front-to-back. Pure geometry: takes the totals
   and ratio it needs as arguments and knows nothing about stages —
   see js/stageConfig.js for where stockReserveRatio comes from. */
function distributeTableau(total, columns, stockReserveRatio) {
  const stockReserve = Math.max(4, Math.round(total * stockReserveRatio));
  const tableauTotal = Math.max(0, total - stockReserve);

  // The classic Klondike look: the leftmost column is barely started
  // (1-2 cards), the next one steps up noticeably (3-4), and each one
  // after that keeps growing by the same steady amount — never a flat
  // spread. Every column gets at least 1 card first; whatever's left
  // over is handed out shallow-to-deep using that 1:3:5:7:9 shape.
  const baseline = Math.min(columns, tableauTotal);
  const depths = new Array(columns).fill(0);
  for (let i = 0; i < baseline; i++) depths[i] = 1;
  let extra = Math.max(0, tableauTotal - baseline);

  const weights = Array.from({ length: columns }, (_, i) => 2 * i + 1);
  const weightSum = weights.reduce((a, b) => a + b, 0);
  const shares = weights.map((w) => Math.floor((extra * w) / weightSum));
  for (let i = 0; i < columns; i++) depths[i] += shares[i];
  let remainder = extra - shares.reduce((a, b) => a + b, 0);
  let i = columns - 1;
  while (remainder > 0) {
    depths[i]++;
    remainder--;
    i = (i - 1 + columns) % columns;
  }
  return depths;
}

const Game = (function () {
  let state = null;
  let history = [];

  function snapshot() {
    history.push(JSON.parse(JSON.stringify(state)));
    if (history.length > 40) history.shift();
  }

  function dropSnapshot() {
    history.pop();
  }

  /* Any successful move that clearly required judging categories —
     delivering a word/collector to its slot, OR stacking a card onto a
     same-category match in the tableau — extends the streak the same
     way. A pure "no real choice" action (drawing the stock) never
     touches this. */
  function bumpCombo() {
    state.comboStreak += 1;
    const bonus = comboBonusFor(state.comboStreak);
    if (bonus > 0) {
      const save = loadSave();
      save.coins += bonus;
      saveGame(save);
      state.coins = save.coins;
    }
    state.lastCombo = { streak: state.comboStreak, bonus };
  }

  function start(stageId) {
    const config = resolveStageConfig(stageId);
    if (!config) throw new Error("Unknown stage " + stageId);

    // Each group in the pool contributes at most wordsPerGroup words (a
    // random sample) — this grows with the stage number, so later
    // levels collect bigger sets from the same library categories.
    // usedWords guarantees no word is ever sampled twice within the
    // SAME stage: a couple of words (e.g. "table") legitimately belong
    // to more than one relation group in the library, and if a stage's
    // pool happened to combine both groups, the word would otherwise be
    // dealt as two physical cards that both resolve to whichever
    // category wordToCategory last recorded for it — silently making
    // the other category impossible to complete. Skipping
    // already-claimed words keeps every word in a stage unique, even if
    // that occasionally leaves a group a word short of its usual target.
    const usedWords = new Set();
    const categoryPool = config.groups.map((gid) => {
      const group = RELATIONS_BY_ID[gid];
      const available = group.words.filter((w) => !usedWords.has(w));
      const sample = shuffle(available).slice(0, config.wordsPerGroup);
      sample.forEach((w) => usedWords.add(w));
      return {
        groupId: gid,
        name: group.name,
        type: group.type,
        words: sample,
        target: sample.length,
        collected: 0,
        lastWord: null,
        slotIndex: null,
        completed: false,
      };
    });

    const wordToCategory = {};
    categoryPool.forEach((cat, idx) => {
      cat.words.forEach((w) => {
        wordToCategory[w] = idx;
      });
    });

    let seq = 0;
    const wordCards = [];
    categoryPool.forEach((cat) => {
      cat.words.forEach((word) => {
        wordCards.push({
          id: "c" + seq++ + "_" + word,
          word,
          isMarker: false,
          isReview: WORD_FIRST_STAGE[word] !== config.id,
        });
      });
    });
    const markerCards = categoryPool.map((cat, idx) => ({
      id: "m" + seq++ + "_" + cat.groupId,
      word: cat.name,
      isMarker: true,
      categoryIndex: idx,
      relationType: cat.type,
      isReview: false,
    }));

    const total = wordCards.length + markerCards.length;

    // Most collector cards stay stock-only, same as before — a collector
    // buried in a column can wall it off until it's dug out, which the
    // stock never risks. Only a small minority are genuinely mixed into
    // the tableau deal (config.tableauMarkerRatio), so a bigger pool
    // doesn't multiply that risk across more simultaneous columns.
    const tableauEligibleCount = Math.max(0, Math.round(markerCards.length * config.tableauMarkerRatio));
    const shuffledMarkers = shuffle(markerCards);
    const tableauEligibleMarkers = shuffledMarkers.slice(0, tableauEligibleCount);
    const stockOnlyMarkers = shuffledMarkers.slice(tableauEligibleCount);

    const shuffledDeck = shuffle(wordCards.concat(tableauEligibleMarkers));
    const depths = distributeTableau(shuffledDeck.length, config.columns, config.stockReserveRatio);
    const tableau = Array.from({ length: config.columns }, () => []);
    let cursor = 0;
    depths.forEach((depth, colIdx) => {
      const col = [];
      for (let i = 0; i < depth; i++) col.push(shuffledDeck[cursor++]);
      col.forEach((card, i) => {
        card.faceUp = i === col.length - 1; // only the bottom-most (frontmost) card is revealed
      });
      tableau[colIdx] = col;
    });

    const stock = shuffle(shuffledDeck.slice(cursor).concat(stockOnlyMarkers));
    const moveBudget = Math.round(total * 1.6) + Math.round(stock.length * 0.9) + 16;

    const save = loadSave();

    state = {
      stageId,
      tutorial: !!config.tutorial,
      categoryPool,
      wordToCategory,
      slots: new Array(config.slots).fill(null),
      tableau,
      stock,
      waste: [],
      movesLeft: moveBudget,
      movesUsed: 0,
      totalCards: total,
      cardsLeft: total,
      hintsLeft: config.hints,
      hintsUsed: 0,
      hintMode: false,
      undosLeft: config.undos,
      purchases: 0,
      coins: save.coins,
      status: "playing", // playing | won | stuck
      lastHint: null,
      lastBlocked: null,
      reward: 0,
      comboStreak: 0,
      lastCombo: null,
      lastCompletedCategory: null,
    };
    history = [];
    return getState();
  }

  function getState() {
    return state;
  }

  function spendMove() {
    state.movesLeft = Math.max(0, state.movesLeft - 1);
    state.movesUsed += 1;
  }

  function checkEnd() {
    if (state.cardsLeft === 0) {
      state.status = "won";
      const reward = 15 + (state.movesLeft > 0 ? 5 : 0) + (state.hintsUsed === 0 ? 5 : 0);
      const save = loadSave();
      save.coins += reward;
      save.unlockedStage = Math.max(save.unlockedStage, Math.min(state.stageId + 1, STAGES.length));
      saveGame(save);
      state.coins = save.coins;
      state.reward = reward;
    } else if (state.movesLeft === 0) {
      state.status = "stuck";
    }
  }

  function findOpenSlot() {
    return state.slots.findIndex((s) => s === null);
  }

  /* Returns true if the card was actually played (removed from the board). */
  function tryPlay(card) {
    state.lastBlocked = null;

    if (card.isMarker) {
      const slotIdx = findOpenSlot();
      if (slotIdx === -1) {
        state.lastBlocked = { reason: "slotsFull", categoryName: card.word };
        return false;
      }
      state.slots[slotIdx] = card.categoryIndex;
      state.categoryPool[card.categoryIndex].slotIndex = slotIdx;
      state.cardsLeft -= 1;
      spendMove();
      checkEnd();
      return true;
    }

    const category = state.categoryPool[state.wordToCategory[card.word]];
    if (category.slotIndex === null) {
      state.lastBlocked = { reason: "categoryLocked", word: card.word, categoryName: category.name };
      return false;
    }

    category.collected += 1;
    category.lastWord = card.word;
    if (category.collected >= category.target) {
      // Free the slot the instant the set is complete, so it's
      // immediately available for a new collector card.
      category.completed = true;
      state.slots[category.slotIndex] = null;
      category.slotIndex = null;
    }
    state.cardsLeft -= 1;
    spendMove();
    checkEnd();
    return true;
  }

  /* Precise placement: the player drags the front card (or front
     cluster) of a pile onto a SPECIFIC foundation slot — not just
     "any open one". The dragged card may be a collector sitting alone,
     a collector already parked atop its own matching word pile, or a
     plain word whose pile happens to have its collector buried
     somewhere inside it: whichever cards belong to that one cluster
     all deliver together, in the same single move.
     - If the cluster still carries its (unplayed) collector card, the
       chosen slot must be open — that's what actually claims it.
     - If the collector was already played earlier and this is just
       more of that category's words, the category's own existing slot
       is used regardless of which slot the drop landed near (a plain
       word only ever has the one home). */
  function playClusterToSlot(card, slotIndex, source) {
    if (!state || state.status !== "playing") return getState();
    state.lastCombo = null;
    state.lastCompletedCategory = null;
    if (slotIndex < 0 || slotIndex >= state.slots.length) return getState();

    // The dragged card might be any member of a cluster, not just its
    // front (grabbing a buried label mid-stack is allowed) — so once we
    // know which COLUMN it came from, the actual front cluster of that
    // column is what moves, regardless of which specific card the
    // player's finger happened to be on.
    const fromWaste = state.waste.length > 0 && state.waste[state.waste.length - 1].id === card.id;
    let fromCol = null;
    if (!fromWaste) {
      const colIdx = source && source.type === "tableau" ? source.colIdx : state.tableau.findIndex((c) => c.some((x) => x.id === card.id));
      if (colIdx !== -1 && colIdx !== undefined && state.tableau[colIdx] && state.tableau[colIdx].length > 0) {
        fromCol = colIdx;
      }
    }
    if (!fromWaste && fromCol === null) return getState();

    const categoryIndex = card.isMarker ? card.categoryIndex : state.wordToCategory[card.word];
    const category = state.categoryPool[categoryIndex];
    const clusterSize = fromWaste ? 1 : frontClusterSize(state.tableau[fromCol], state.wordToCategory);
    const cluster = fromWaste ? [card] : state.tableau[fromCol].slice(state.tableau[fromCol].length - clusterSize);
    const hasMarker = cluster.some((c) => c.isMarker);

    // `card` only ever supplies which category to credit — everything
    // actually delivered comes from `cluster`, derived independently
    // from the column's CURRENT front. Normally those always agree,
    // but a caller can pass a stale `card` (e.g. a leftover tap-
    // selection from before an unrelated drag moved the board), in
    // which case category and cluster have silently drifted apart:
    // without this check, a card from a completely different category
    // gets delivered and credited to `card`'s category instead of its
    // own. If `card` isn't actually IN the cluster being delivered,
    // bail rather than credit the wrong category.
    if (!cluster.some((c) => c.id === card.id)) return getState();

    // Precise targeting cuts both ways: a collector needs an OPEN slot
    // (any one — that's the player's choice), but a plain word must be
    // dropped on the exact slot its own category already lives in, not
    // just anywhere inside the foundations row.
    const targetSlot = slotIndex;
    if (hasMarker) {
      if (state.slots[targetSlot] !== null) return getState();
    } else {
      if (category.slotIndex === null || category.slotIndex !== targetSlot) return getState();
    }

    snapshot();
    if (fromWaste) {
      state.waste.pop();
    } else {
      state.tableau[fromCol].splice(state.tableau[fromCol].length - clusterSize, clusterSize);
      revealFront(state.tableau[fromCol]);
    }

    if (hasMarker) {
      state.slots[targetSlot] = categoryIndex;
      category.slotIndex = targetSlot;
    }

    for (let i = cluster.length - 1; i >= 0; i--) {
      const c = cluster[i];
      state.cardsLeft -= 1;
      if (!c.isMarker) {
        category.collected += 1;
        category.lastWord = c.word;
      }
    }

    bumpCombo();

    if (category.collected >= category.target) {
      category.completed = true;
      state.lastCompletedCategory = { name: category.name, slotIndex: category.slotIndex };
      state.slots[category.slotIndex] = null;
      category.slotIndex = null;
    }

    spendMove();
    checkEnd();
    return getState();
  }

  /* Any failed drop — a category mismatch, a mis-stacked tableau card,
     or dropping somewhere with no valid target at all — resets the
     streak. The UI calls this for every rejected drop, not just
     foundation mismatches, so the streak really does mean "no mistakes
     yet" rather than just "no wrong category guesses yet". */
  function breakCombo() {
    if (!state) return getState();
    const priorStreak = state.comboStreak;
    state.comboStreak = 0;
    state.lastCombo = null;
    return { priorStreak };
  }

  /* Classic tableau digging: move a column's front card (and any
     same-category cards already clustered with it — they travel as
     one piece) onto an empty column, or stack it onto another
     column's front card/cluster that shares its category. Doesn't
     collect anything by itself; it's purely a reorganizing move. */
  function moveTableauCard(fromCol, toCol) {
    if (!state || state.status !== "playing") return getState();
    state.lastCombo = null;
    if (fromCol === toCol) return getState();
    const src = state.tableau[fromCol];
    if (!src || src.length === 0) return getState();
    const card = src[src.length - 1];
    if (!card.faceUp) return getState();
    const dst = state.tableau[toCol];
    if (!isValidTableauTarget(card, dst, state.wordToCategory)) return getState();

    snapshot();
    const moveCount = frontClusterSize(src, state.wordToCategory);
    const moving = src.splice(src.length - moveCount, moveCount);
    revealFront(src);
    moving.forEach((c) => {
      c.faceUp = true;
      dst.push(c);
    });
    bumpCombo();
    spendMove();
    checkEnd();
    return getState();
  }

  /* Paid escape hatch for a genuinely stuck column: relocates a front
     cluster onto ANY other column, ignoring the category match
     isValidTableauTarget normally requires. Doesn't collect or
     deliver anything (still purely a reorganizing move, just an
     unrestricted one) — frontClusterSize/renderTableau already treat
     "same category as whatever's currently at the front" as the only
     rule for what counts as a moving cluster, so a column ending up
     with two different categories stacked in it (the whole point of
     this move) needs no special-casing anywhere else. Not undoable
     and doesn't spend a move, matching buyMoves()/refillLives(): a
     coin purchase, not a normal play. */
  function jokerMove(fromCol, toCol) {
    if (!state || state.status !== "playing") return getState();
    if (fromCol === toCol) return getState();
    const src = state.tableau[fromCol];
    if (!src || src.length === 0) return getState();
    const card = src[src.length - 1];
    if (!card.faceUp) return getState();
    const dst = state.tableau[toCol];

    const save = loadSave();
    if (save.coins < JOKER_COST) return getState();
    save.coins -= JOKER_COST;
    saveGame(save);
    state.coins = save.coins;

    const moveCount = frontClusterSize(src, state.wordToCategory);
    const moving = src.splice(src.length - moveCount, moveCount);
    revealFront(src);
    moving.forEach((c) => {
      c.faceUp = true;
      dst.push(c);
    });
    state.lastCombo = null;
    // Same reasoning as shuffleBoard(): with no snapshot of its own, an
    // Undo reaching back past this point would silently erase the board
    // change the player just paid for while the coins stay spent. Wiping
    // history here means Undo simply can't cross this boundary.
    history = [];
    return getState();
  }

  /* Paid escape hatch for a genuinely deadlocked board: every card not
     yet delivered (stock, waste, and the whole tableau — collected
     words already left these arrays for good, so they're untouched)
     goes back into one pool and gets redealt from scratch, using the
     same distribution the stage originally used. Category progress,
     moves left, hints, undos — everything outside these three arrays
     — is untouched. Not undoable, same reasoning as jokerMove. */
  function shuffleBoard() {
    if (!state || state.status !== "playing") return getState();

    const save = loadSave();
    if (save.coins < SHUFFLE_COST) return getState();
    save.coins -= SHUFFLE_COST;
    saveGame(save);
    state.coins = save.coins;

    const pool = [];
    state.tableau.forEach((col) => pool.push(...col));
    pool.push(...state.stock);
    pool.push(...state.waste);

    const config = resolveStageConfig(state.stageId);

    // Same split start() uses: only a minority of collector cards are
    // ever eligible to land in the tableau, where they can wall off a
    // column. Pooling every card together with no regard for "marker
    // vs word" (as this used to) could redeal FAR more collectors into
    // the tableau than the stage was ever tuned for — a "helper" that
    // makes the board harder, not easier.
    const markerCards = pool.filter((c) => c.isMarker);
    const wordCards = pool.filter((c) => !c.isMarker);
    const tableauEligibleCount = Math.max(0, Math.round(markerCards.length * config.tableauMarkerRatio));
    const shuffledMarkers = shuffle(markerCards);
    const tableauEligibleMarkers = shuffledMarkers.slice(0, tableauEligibleCount);
    const stockOnlyMarkers = shuffledMarkers.slice(tableauEligibleCount);

    const shuffledDeck = shuffle(wordCards.concat(tableauEligibleMarkers));
    const depths = distributeTableau(shuffledDeck.length, config.columns, config.stockReserveRatio);
    const tableau = Array.from({ length: config.columns }, () => []);
    let cursor = 0;
    depths.forEach((depth, colIdx) => {
      const col = [];
      for (let i = 0; i < depth; i++) col.push(shuffledDeck[cursor++]);
      col.forEach((c, i) => {
        c.faceUp = i === col.length - 1;
        if (c.faceUp) c.justRevealed = true;
      });
      tableau[colIdx] = col;
    });
    const stock = shuffle(shuffledDeck.slice(cursor).concat(stockOnlyMarkers));
    stock.forEach((c) => {
      c.faceUp = false;
    });

    state.tableau = tableau;
    state.stock = stock;
    state.waste = [];
    state.lastCombo = null;
    history = [];
    return getState();
  }

  /* A waste card can join (or start) a tableau cluster the same way —
     dropped on an empty column, or on a column fronted by a card
     that shares its category. */
  function moveWasteToTableau(toCol) {
    if (!state || state.status !== "playing") return getState();
    state.lastCombo = null;
    if (state.waste.length === 0) return getState();
    const card = state.waste[state.waste.length - 1];
    const dst = state.tableau[toCol];
    if (!isValidTableauTarget(card, dst, state.wordToCategory)) return getState();

    snapshot();
    state.waste.pop();
    card.faceUp = true;
    dst.push(card);
    bumpCombo();
    spendMove();
    checkEnd();
    return getState();
  }

  function drawStock() {
    if (!state || state.status !== "playing") return getState();
    state.lastBlocked = null;

    if (state.stock.length === 0) {
      if (state.waste.length === 0) return getState();
      snapshot();
      // Recycle in the SAME order as the original deal, not reversed —
      // waste[0] is the very first card ever drawn (draws come off the
      // front of stock and get pushed onto the end of waste, so waste
      // keeps that same order), so it should be the first one drawn
      // again too.
      state.stock = state.waste;
      state.waste = [];
      return getState();
    }

    snapshot();
    const drawn = state.stock.splice(0, DRAW_COUNT);
    state.waste.push(...drawn);
    spendMove();
    checkEnd();
    return getState();
  }

  function playWaste() {
    if (!state || state.status !== "playing") return getState();
    if (state.waste.length === 0) return getState();
    const card = state.waste[state.waste.length - 1];
    snapshot();
    if (tryPlay(card)) state.waste.pop();
    else dropSnapshot();
    return getState();
  }

  function playTableau(colIndex) {
    if (!state || state.status !== "playing") return getState();
    const col = state.tableau[colIndex];
    if (!col || col.length === 0) return getState();
    const card = col[col.length - 1];
    if (!card.faceUp) return getState();

    if (card.isMarker) {
      snapshot();
      if (tryPlay(card)) {
        col.pop();
        revealFront(col);
      } else {
        dropSnapshot();
      }
      return getState();
    }

    // Word card: deliver the whole same-category cluster at the front
    // as one move. If a not-yet-played collector card is buried inside
    // that cluster, claim any open slot with it in the same motion;
    // otherwise the category must already be active.
    state.lastBlocked = null;
    const category = state.categoryPool[state.wordToCategory[card.word]];
    const clusterSize = frontClusterSize(col, state.wordToCategory);
    const cluster = col.slice(col.length - clusterSize);
    const buriedMarker = cluster.find((c) => c.isMarker);

    let slotIndex = category.slotIndex;
    if (slotIndex === null) {
      if (!buriedMarker) {
        state.lastBlocked = { reason: "categoryLocked", word: card.word, categoryName: category.name };
        return getState();
      }
      slotIndex = findOpenSlot();
      if (slotIndex === -1) {
        state.lastBlocked = { reason: "slotsFull", categoryName: category.name };
        return getState();
      }
    }

    snapshot();
    if (slotIndex !== category.slotIndex) {
      state.slots[slotIndex] = state.wordToCategory[card.word];
      category.slotIndex = slotIndex;
    }
    for (let i = 0; i < clusterSize; i++) {
      const delivered = col.pop();
      state.cardsLeft -= 1;
      if (!delivered.isMarker) {
        category.collected += 1;
        category.lastWord = delivered.word;
      }
    }
    if (category.collected >= category.target) {
      category.completed = true;
      state.slots[category.slotIndex] = null;
      category.slotIndex = null;
    }
    revealFront(col);
    spendMove();
    checkEnd();
    return getState();
  }

  function undo() {
    if (!state || state.status !== "playing") return getState();
    if (state.undosLeft <= 0 || history.length === 0) return getState();
    const undosLeft = state.undosLeft - 1;
    state = history.pop();
    state.undosLeft = undosLeft;
    state.lastBlocked = null;
    state.lastHint = null;
    // Coins live in TWO places: this snapshot's own copy (just for display)
    // and the authoritative localStorage save, which combo bonuses already
    // wrote to the moment they were earned and which undo never reverts.
    // Re-syncing from the save here keeps the badge honest instead of
    // showing a stale pre-bonus number until the next coin-touching action.
    state.coins = loadSave().coins;
    return getState();
  }

  function armHint() {
    if (!state || state.status !== "playing") return getState();
    if (state.hintsLeft <= 0) return getState();
    state.hintMode = true;
    return getState();
  }

  function cancelHint() {
    if (!state) return getState();
    state.hintMode = false;
    return getState();
  }

  function hintForCard(card) {
    if (!state || !card) return getState();
    state.hintsLeft -= 1;
    state.hintsUsed += 1;
    state.hintMode = false;

    if (card.isMarker) {
      const cat = state.categoryPool[card.categoryIndex];
      state.lastHint = {
        word: card.word,
        meaning: `Tap this card to claim a slot for the "${cat.name}" collection.`,
        example: `Once claimed, matching words can be sent to it.`,
        relationType: cat.type,
        relationName: cat.name,
        isMarker: true,
      };
      return getState();
    }

    const info = WORDS[card.word];
    const category = state.categoryPool[state.wordToCategory[card.word]];
    state.lastHint = {
      word: card.word,
      meaning: info.meaning,
      example: info.example,
      relationType: category.type,
      relationName: category.name,
      isMarker: false,
    };
    return getState();
  }

  function dismissHint() {
    if (!state) return getState();
    state.lastHint = null;
    return getState();
  }

  function nextMoveCost() {
    if (!state) return 0;
    return 10 + state.purchases * 5;
  }

  function buyMoves() {
    if (!state || state.status !== "stuck") return getState();
    const cost = nextMoveCost();
    const save = loadSave();
    if (save.coins < cost) return getState();

    save.coins -= cost;
    saveGame(save);

    state.coins = save.coins;
    state.purchases += 1;
    state.movesLeft += 5;
    state.status = "playing";
    return getState();
  }

  function restart() {
    return start(state.stageId);
  }

  function getSave() {
    return loadSave();
  }

  /* Called when the player walks away from a failed attempt (stuck,
     then Restart or Give Up) rather than paying coins to keep going.
     Winning never costs a heart, and neither does retrying while a
     level is still in progress — only abandoning one that's already
     out of moves does. */
  function loseLife() {
    const save = loadSave();
    if (save.lives <= 0) return save;
    save.lives -= 1;
    if (!save.lastLifeLostAt) save.lastLifeLostAt = Date.now();
    saveGame(save);
    return save;
  }

  function msUntilNextLife() {
    const save = loadSave();
    if (save.lives >= MAX_LIVES || !save.lastLifeLostAt) return 0;
    return Math.max(0, save.lastLifeLostAt + LIFE_REGEN_MS - Date.now());
  }

  /* Instantly tops up to full for HEART_REFILL_COST coins. Returns the
     updated save, or null if the player can't afford it (caller
     decides how to react — nothing is deducted in that case). */
  function refillLives() {
    const save = loadSave();
    if (save.coins < HEART_REFILL_COST) return null;
    save.coins -= HEART_REFILL_COST;
    save.lives = MAX_LIVES;
    save.lastLifeLostAt = null;
    saveGame(save);
    return save;
  }

  function getFrontClusterSize(colIndex) {
    if (!state) return 0;
    return frontClusterSize(state.tableau[colIndex], state.wordToCategory);
  }

  return {
    start,
    getState,
    drawStock,
    playWaste,
    playTableau,
    playClusterToSlot,
    breakCombo,
    moveTableauCard,
    jokerMove,
    shuffleBoard,
    moveWasteToTableau,
    getFrontClusterSize,
    undo,
    armHint,
    cancelHint,
    hintForCard,
    dismissHint,
    buyMoves,
    nextMoveCost,
    restart,
    getSave,
    loseLife,
    msUntilNextLife,
    refillLives,
  };
})();
