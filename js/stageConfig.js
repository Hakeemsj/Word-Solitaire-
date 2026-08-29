/* ============================================================
   Word Solitaire — Stage Configuration
   Only a stage NUMBER is ever shown to the player (no A1/A2/B1
   labels). Each stage lists a POOL of relation groups — more
   groups than there are foundation slots, so collector cards
   rotate through the slots as earlier ones get completed. Words
   that already appeared in an earlier stage are flagged "review"
   automatically, which is how repetition-for-reinforcement happens.

   Slot count varies stage to stage (3, 4, or 5 — never wider or
   narrower) and the tableau always has exactly that many columns, so
   the foundation row and the board below it are always the same width.
   Pool size is 2.5x the slot count, rounded (3 slots -> 8 collector
   cards waiting, 4 -> 10, 5 -> 13), which is what drives the bigger
   word counts at every stage — see poolTargetFor() for why 2.5x and
   not the flat 3x this started at.

   This file is the ONLY place stage difficulty is defined. Everything
   below a STAGES entry either comes straight from that entry, or — if
   the entry doesn't specify it — falls back to a default formula
   computed here. resolveStageConfig() is the single function the game
   engine calls; it never reads STAGES or these formulas directly. That
   means adding a new stage is just adding a new entry: give it
   `columns` / `wordsPerGroup` / `stockReserveRatio` / `tableauMarkerRatio`
   only if you want to override that stage's default, and nothing in
   game.js needs to change either way.
   ============================================================ */

const SLOT_COUNT = 4; // fallback default for any stage that doesn't set its own
const MAX_WORDS_PER_GROUP = 5;

// Most collector cards stay stock-only — a collector buried in a tableau
// column can wall it off until it's dug out, which the stock never risks.
// Only this fraction of a stage's collector cards are ever genuinely mixed
// into the tableau deal; the rest are forced into the stock. This was 2/7
// back when pools topped out around 8-9 collectors; now that pools run
// 8-13 (2.5x the slot count), that same fraction meant 2-3 collectors
// competing for tableau space at once, which was a big part of why a
// 165-game sample only solved 14.5% of the time. Dropped to 1/10 — still
// a few collectors genuinely turn up mid-tableau, just not enough of them
// to jam multiple columns simultaneously.
const DEFAULT_TABLEAU_MARKER_RATIO = 0.1;

// The stock (drawn one at a time, freely recyclable) has only a single
// blocking point at any moment; the tableau has several simultaneously.
// Keeping most cards in the stock — rather than the more "visually busy"
// tableau — is what makes a genuinely-shuffled collector card reliably
// reachable instead of occasionally walling off the board. Raised to
// 0.75 during the 2.5x-pool solvability crisis; nudged back down to
// 0.70 by request to put more cards on the board. Confirmed via the
// solver this trades solvability from ~65-70% down to ~40-45% — an
// accepted tradeoff, not a bug, if a stage feels unsolvable.
const DEFAULT_STOCK_RESERVE_RATIO = 0.7;

/* Foundation slots and tableau columns always match (a 3-slot stage
   gets a 3-column board, a 5-slot stage a 5-column board), and slot
   count only ever ranges 3-5 — never wider, never narrower.

   Pool size started at a flat 3x the slot count, but that left 8-10
   categories permanently "waiting" at once and made almost every stage
   unsolvable (measured 3.6% across a 165-game sample, even with
   unlimited moves) — too many collector cards jam the tableau/stock
   with words that can never be delivered until a slot frees up.
   Dropped to 2.5x (3 slots -> 8, 4 -> 10, 5 -> 13) as a middle ground:
   still a much bigger pool than before, while keeping most stages
   genuinely finishable. */
const MIN_SLOTS = 3;
const MAX_SLOTS = 5;
const POOL_PER_SLOT_RATIO = 2.5;

function poolTargetFor(slots) {
  return Math.round(slots * POOL_PER_SLOT_RATIO);
}

function clampSlots(n) {
  return Math.max(MIN_SLOTS, Math.min(MAX_SLOTS, n));
}

/* Hands out group ids round-robin from the full library, in library
   order, wrapping around once every group has had a turn. Shared
   across both the curated stages below (topped up to the new pool
   size) and the generated stages after them, so usage stays spread
   out across the whole 1-500 run rather than resetting per section. */
function makeGroupCursor(allGroupIds) {
  let i = 0;
  return {
    take(count, exclude) {
      const picked = [];
      let guard = 0;
      while (picked.length < count && guard++ < allGroupIds.length * 3) {
        const gid = allGroupIds[i % allGroupIds.length];
        i++;
        if (!exclude.includes(gid) && !picked.includes(gid)) picked.push(gid);
      }
      return picked;
    },
  };
}

/* Stages 1-5 are the difficulty on-ramp: 1 is a short, guided tutorial
   level (small pool, everything easy to reach — see js/tutorial.js),
   2-5 step up gradually in slot count / pool size / words-per-group,
   and stage 6 picks up exactly where the old stage 1 used to start.
   Each explicitly overrides `pool` (collector-card pool size) and
   `wordsPerGroup` here rather than relying on the defaults every
   later stage uses, so this on-ramp is fully self-contained and can
   never change stage 6+'s difficulty — see poolTargetFor() and
   DEFAULT_WORDS_PER_GROUP_BY_STAGE below for why. */
const CURATED_STAGES_BASE = [
  { id: 1, slots: 3, pool: 3, wordsPerGroup: 3, stockReserveRatio: 0.4, tableauMarkerRatio: 0.7, tutorial: true, groups: ["cat_furniture", "cat_fruits", "cat_weather"] },
  { id: 2, slots: 3, pool: 5, wordsPerGroup: 3, groups: ["ant_fullness", "syn_smart", "partof_body", "activity_beach", "context_airport"] },
  { id: 3, slots: 3, pool: 6, wordsPerGroup: 3, groups: ["syn_big", "syn_smart", "ant_speed", "ant_moisture", "cat_furniture", "cat_kitchen"] },
  { id: 4, slots: 4, pool: 7, wordsPerGroup: 4, groups: ["syn_happy", "activity_beach", "ant_difficulty", "func_actions", "cat_transport", "cat_sports", "ant_price"] },
  { id: 5, slots: 4, pool: 7, wordsPerGroup: 4, groups: ["concept_money", "syn_big", "cat_emotions", "ant_temperature", "ant_price", "ant_state", "cat_weather"] },
  { id: 6, slots: 4, groups: ["context_airport", "ant_strength", "ant_state", "concept_time", "context_restaurant", "partof_house", "syn_smart"] },
  { id: 7, slots: 5, groups: ["partof_car", "ant_speed", "ant_temperature", "func_security", "cat_furniture", "cat_jobs", "activity_morning", "ant_fullness"], hints: 2 },
  { id: 8, slots: 4, groups: ["partof_body", "ant_fullness", "cat_fruits", "concept_time", "activity_morning", "func_actions"], hints: 2 },
  { id: 9, slots: 3, groups: ["activity_morning", "concept_money", "concept_time", "partof_house", "cat_kitchen"], hints: 2 },
  { id: 10, slots: 4, groups: ["cat_weather", "cat_jobs", "syn_happy", "partof_car", "ant_difficulty", "cat_emotions", "ant_speed"], hints: 2 },
  { id: 11, slots: 5, groups: ["cat_emotions", "activity_beach", "cat_weather", "partof_house", "partof_car", "ant_price", "concept_money", "func_security"], hints: 2 },
  { id: 12, slots: 5, groups: ["func_actions", "cat_jobs", "partof_house", "cat_transport", "context_airport", "ant_temperature", "syn_big", "cat_sports"], hints: 2 },
  { id: 13, slots: 5, groups: ["cat_kitchen", "cat_sports", "cat_transport", "ant_strength", "ant_price", "ant_moisture", "partof_body", "context_restaurant", "activity_beach"], hints: 2 },
  { id: 14, slots: 5, groups: ["cat_fruits", "cat_furniture", "cat_sports", "ant_moisture", "func_security", "ant_state", "concept_time", "syn_happy", "partof_car"], hints: 2 },
  { id: 15, slots: 4, groups: ["context_restaurant", "cat_emotions", "cat_weather", "ant_state", "cat_fruits", "func_actions"], hints: 2 },
];

/* Stage 1-500 assembly: the 15 curated stages keep their original,
   hand-picked groups as a base and get topped up (via the shared
   cursor) to the new pool-per-slot target; stages 16-500 are generated
   from scratch, cycling slot count through 3/4/5 so the board shape
   stays varied rather than climbing in a straight line. */
const GENERATED_STAGE_COUNT = 485; // 15 curated + 485 generated = 500 stages total
const SLOTS_CYCLE = [3, 4, 5, 4, 3, 5];

// Generated stages (16+) mix in review on top of new content, rather
// than only ever advancing through fresh groups: ~20% of each stage's
// pool is pulled back from whatever showed up in the last few stages,
// so a category can resurface within as little as REVIEW_WINDOW_STAGES
// levels instead of only once per full ~13-stage lap of the library.
// The curated on-ramp (1-15) is untouched by this — it keeps its own
// hand-picked groups exactly as before.
const REVIEW_RATIO = 0.2;
const REVIEW_WINDOW_STAGES = 3;

const STAGES = (function () {
  const allGroupIds = RELATIONS.map((r) => r.id);
  const cursor = makeGroupCursor(allGroupIds);

  const curated = CURATED_STAGES_BASE.map((stage) => {
    const slots = clampSlots(stage.slots);
    const target = stage.pool || poolTargetFor(slots);
    const groups = stage.groups.slice();
    if (groups.length < target) {
      groups.push(...cursor.take(target - groups.length, groups));
    }
    return Object.assign({}, stage, { slots, groups });
  });

  const generated = [];
  // Seeded with the tail of the curated run so stage 16 already has
  // real review candidates from stages 13-15, instead of starting cold.
  let recentWindow = curated.slice(-REVIEW_WINDOW_STAGES).map((s) => s.groups);
  for (let i = 0; i < GENERATED_STAGE_COUNT; i++) {
    const slots = SLOTS_CYCLE[i % SLOTS_CYCLE.length];
    const target = poolTargetFor(slots);
    const reviewTarget = Math.round(target * REVIEW_RATIO);

    // Recently-used groups (last REVIEW_WINDOW_STAGES stages), oldest
    // first, deduplicated — the review candidates for this stage.
    const recentPool = Array.from(new Set(recentWindow.flat()));
    const newCount = Math.max(0, target - reviewTarget);
    const newGroups = cursor.take(newCount, []);
    const reviewGroups = recentPool.filter((gid) => !newGroups.includes(gid)).slice(0, reviewTarget);

    let groups = newGroups.concat(reviewGroups);
    // The review window won't have enough distinct groups yet on the
    // very first few generated stages — top up with fresh ones instead
    // of shipping an undersized pool.
    if (groups.length < target) {
      groups = groups.concat(cursor.take(target - groups.length, groups));
    }

    generated.push({
      id: 15 + i + 1,
      slots,
      groups,
      hints: 2,
    });

    recentWindow.push(groups);
    if (recentWindow.length > REVIEW_WINDOW_STAGES) recentWindow.shift();
  }

  return curated.concat(generated);
})();

const DEFAULT_HINTS = 3;
const DEFAULT_UNDOS = 8;

function achievableTotal(groupIds, cap) {
  return groupIds.reduce((sum, gid) => sum + Math.min(cap, RELATIONS_BY_ID[gid].words.length), 0);
}

/* Per-category word count also grows with the stage number — but a raw
   "+1 per stage" cap can't be trusted on its own: our library groups range
   from 4 to 8 words, so two stages built from coincidentally small groups
   could end up with the LATER one holding fewer total cards than the
   earlier one, even with a higher cap. Instead, each stage's cap starts
   from that baseline progression and then ratchets up (capped at 8, our
   largest group size) only as far as needed so its total card count
   actually beats the previous stage's — guaranteeing a real "more than
   last time" feel no matter which specific groups a stage happens to use.
   Only the DEFAULT: a stage can override it with an explicit
   `wordsPerGroup` field. */
const DEFAULT_WORDS_PER_GROUP_BY_STAGE = (function () {
  const caps = {};
  let prevTotal = -Infinity;
  STAGES.forEach((stage) => {
    let cap = Math.min(MAX_WORDS_PER_GROUP + Math.min(stage.id - 1, 3), 8);
    while (cap < 8 && achievableTotal(stage.groups, cap) <= prevTotal) cap++;
    caps[stage.id] = cap;
    prevTotal = achievableTotal(stage.groups, cap);
  });
  return caps;
})();

function defaultWordsPerGroupFor(stageId) {
  return DEFAULT_WORDS_PER_GROUP_BY_STAGE[stageId] || MAX_WORDS_PER_GROUP;
}

function wordsForGroups(groupIds) {
  const seen = new Set();
  const words = [];
  for (const gid of groupIds) {
    const group = RELATIONS_BY_ID[gid];
    if (!group) continue;
    for (const w of group.words) {
      if (!seen.has(w)) {
        seen.add(w);
        words.push(w);
      }
    }
  }
  return words;
}

/* First stage in which each word's GROUP appears in the pool, so later
   re-use can be flagged as a "review" card for the player. */
function computeWordFirstStage() {
  const map = {};
  for (const stage of STAGES) {
    const words = wordsForGroups(stage.groups);
    for (const w of words) {
      if (!(w in map)) map[w] = stage.id;
    }
  }
  return map;
}

const WORD_FIRST_STAGE = computeWordFirstStage();

/* The single entry point the game engine calls. Every field on the
   returned object is either the stage's own explicit value or a computed
   default — the engine never needs to know which. Returns null for an
   unknown stage id. */
function resolveStageConfig(stageId) {
  const entry = STAGES.find((s) => s.id === stageId);
  if (!entry) return null;
  const slots = entry.slots || SLOT_COUNT;
  return {
    id: entry.id,
    groups: entry.groups,
    hints: entry.hints || DEFAULT_HINTS,
    undos: entry.undos || DEFAULT_UNDOS,
    slots,
    columns: entry.columns || slots, // the tableau is always exactly as wide as the foundation row
    wordsPerGroup: entry.wordsPerGroup || defaultWordsPerGroupFor(entry.id),
    stockReserveRatio: entry.stockReserveRatio || DEFAULT_STOCK_RESERVE_RATIO,
    tableauMarkerRatio: entry.tableauMarkerRatio ?? DEFAULT_TABLEAU_MARKER_RATIO,
    tutorial: !!entry.tutorial,
  };
}
