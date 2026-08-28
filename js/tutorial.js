/* ============================================================
   Word Solitaire — First-run tutorial

   Stage 1 is configured (see js/stageConfig.js: pool 3, 3 words each,
   more of the deal dealt face-up) as a short, easy on-ramp rather than
   a normal stage. The first time anyone reaches it, this module layers
   two things on top of ordinary play:

   - A 2-screen intro, shown once before the player touches the board,
     explaining what a category card is and how collecting works.
   - A few interactive coach marks during that first playthrough. Each
     one spotlights whatever's actually reachable right now — never a
     fixed card, since the deal is still randomly shuffled — and only
     advances once the player performs the real action, not on a timer.

   Shown once per browser (a localStorage flag, same pattern as the
   save data in js/game.js). Replayable from Settings, which only
   replays the static intro — the interactive half only ever runs
   during an actual stage-1 playthrough.
   ============================================================ */

const TUTORIAL_KEY = "solitaireGrow_tutorialDone_v1";

const TUTORIAL_INTRO_SLIDES = [
  {
    emoji: "🎯",
    title: "Match the words",
    text: "Each stage hides a few word groups, like Fruits or Furniture. Find every matching word to collect the group.",
  },
  {
    emoji: "👆",
    title: "Tap to collect",
    text: "Tap a category card to open it, then tap or drag its matching words onto it to collect them.",
  },
];

const Tutorial = (function () {
  let coaching = false;
  let step = 0; // 0 = "open a category", 1 = "deliver a word", 2 = final message
  let cardsLeftAtStepStart = null;
  let introIndex = 0;
  let introOnDone = null;

  function isDone() {
    try {
      return localStorage.getItem(TUTORIAL_KEY) === "1";
    } catch (e) {
      return false;
    }
  }

  function markDone() {
    try {
      localStorage.setItem(TUTORIAL_KEY, "1");
    } catch (e) {
      /* tutorial just won't remember it's been seen this session — not fatal */
    }
  }

  // ---------- intro ----------

  function renderIntroSlide() {
    const slide = TUTORIAL_INTRO_SLIDES[introIndex];
    const modal = document.getElementById("tutorial-intro-modal");
    document.getElementById("tutorial-intro-emoji").textContent = slide.emoji;
    document.getElementById("tutorial-intro-title").textContent = slide.title;
    document.getElementById("tutorial-intro-text").textContent = slide.text;
    document.getElementById("tutorial-intro-next-btn").textContent = introIndex === TUTORIAL_INTRO_SLIDES.length - 1 ? "Let's play" : "Next";
    const dots = document.getElementById("tutorial-intro-dots");
    dots.innerHTML = TUTORIAL_INTRO_SLIDES.map((_, i) => `<span class="tutorial-dot${i === introIndex ? " active" : ""}"></span>`).join("");
    setModalOpen(modal, modal.querySelector(".modal"), true);
  }

  function closeIntro() {
    const modal = document.getElementById("tutorial-intro-modal");
    setModalOpen(modal, modal.querySelector(".modal"), false);
  }

  function advanceIntro() {
    if (introIndex < TUTORIAL_INTRO_SLIDES.length - 1) {
      introIndex++;
      renderIntroSlide();
    } else {
      closeIntro();
      const cb = introOnDone;
      introOnDone = null;
      if (cb) cb();
    }
  }

  /* Shows the 2-screen intro, then calls onDone. Used both for the
     real first-playthrough flow (onDone starts the coach marks) and
     for the Settings "How to Play" replay (onDone does nothing). */
  function showIntro(onDone) {
    introIndex = 0;
    introOnDone = onDone || null;
    renderIntroSlide();
  }

  function replayIntro() {
    showIntro(null);
  }

  // ---------- coach marks ----------

  function frontOf(pile) {
    return pile.length ? pile[pile.length - 1] : null;
  }

  function findReachableMarker(s) {
    for (const col of s.tableau) {
      const front = frontOf(col);
      if (front && front.faceUp && front.isMarker) return front;
    }
    const w = frontOf(s.waste);
    return w && w.isMarker ? w : null;
  }

  function findReachableWordForOpenCategory(s) {
    const openIdx = new Set(s.categoryPool.map((c, i) => (c.slotIndex !== null ? i : -1)).filter((i) => i !== -1));
    if (openIdx.size === 0) return null;
    for (const col of s.tableau) {
      const front = frontOf(col);
      if (front && front.faceUp && !front.isMarker && openIdx.has(s.wordToCategory[front.word])) return front;
    }
    const w = frontOf(s.waste);
    if (w && !w.isMarker && openIdx.has(s.wordToCategory[w.word])) return w;
    return null;
  }

  function elForCard(card) {
    return document.querySelector('[data-card-id="' + card.id + '"]');
  }

  function positionSpotlight(targetEl) {
    const spotlight = document.getElementById("tutorial-spotlight");
    const bubble = document.getElementById("tutorial-bubble");
    if (!targetEl) {
      spotlight.style.display = "none";
      bubble.classList.add("no-target");
      return;
    }
    const r = targetEl.getBoundingClientRect();
    const pad = 6;
    spotlight.style.display = "block";
    spotlight.style.left = r.left - pad + "px";
    spotlight.style.top = r.top - pad + "px";
    spotlight.style.width = r.width + pad * 2 + "px";
    spotlight.style.height = r.height + pad * 2 + "px";
    bubble.classList.remove("no-target");

    // Prefer sitting just below the target; flip above if that would
    // run off the bottom of the screen.
    const bubbleRect = bubble.getBoundingClientRect();
    const spaceBelow = window.innerHeight - (r.bottom + pad);
    const top = spaceBelow > bubbleRect.height + 20 ? r.bottom + pad + 14 : Math.max(12, r.top - pad - bubbleRect.height - 14);
    let left = r.left + r.width / 2 - bubbleRect.width / 2;
    left = Math.max(12, Math.min(left, window.innerWidth - bubbleRect.width - 12));
    bubble.style.top = top + "px";
    bubble.style.left = left + "px";
  }

  function positionDestMarker(destEl) {
    const marker = document.getElementById("tutorial-dest-marker");
    if (!destEl) {
      marker.style.display = "none";
      return;
    }
    const r = destEl.getBoundingClientRect();
    const pad = 5;
    marker.style.display = "block";
    marker.style.left = r.left - pad + "px";
    marker.style.top = r.top - pad + "px";
    marker.style.width = r.width + pad * 2 + "px";
    marker.style.height = r.height + pad * 2 + "px";
  }

  function renderStep(s) {
    const bubbleText = document.getElementById("tutorial-bubble-text");
    if (step === 0) {
      const marker = findReachableMarker(s);
      const openSlotIdx = s.slots.findIndex((x) => x === null);
      const destEl = openSlotIdx !== -1 ? foundationsEl.children[openSlotIdx] : null;
      if (marker) {
        bubbleText.textContent = "Tap this card to open a category — it'll claim the empty slot marked below.";
        positionSpotlight(elForCard(marker));
        positionDestMarker(destEl);
      } else {
        bubbleText.textContent = "Tap the stock to draw a new card.";
        positionSpotlight(stockEl);
        positionDestMarker(null);
      }
    } else if (step === 1) {
      const word = findReachableWordForOpenCategory(s);
      if (word) {
        const category = s.categoryPool[s.wordToCategory[word.word]];
        bubbleText.textContent = `Now tap "${word.word}" — it goes to ${category.name}.`;
        positionSpotlight(elForCard(word));
        positionDestMarker(foundationsEl.children[category.slotIndex]);
      } else {
        bubbleText.textContent = "Draw more cards from the stock to find a match.";
        positionSpotlight(stockEl);
        positionDestMarker(null);
      }
    } else {
      bubbleText.textContent = "You've got it! Keep matching until the board is clear.";
      positionSpotlight(null);
      positionDestMarker(null);
    }
  }

  function begin(s) {
    coaching = true;
    step = 0;
    document.getElementById("tutorial-coach").classList.add("open");
    renderStep(s);
  }

  function end() {
    coaching = false;
    document.getElementById("tutorial-coach").classList.remove("open");
    markDone();
  }

  function onRender(s) {
    if (!coaching || !s) return;
    if (s.status !== "playing") {
      end();
      return;
    }
    if (step === 0 && s.slots.some((x) => x !== null)) {
      step = 1;
      cardsLeftAtStepStart = s.cardsLeft;
    } else if (step === 1 && s.cardsLeft < cardsLeftAtStepStart) {
      step = 2;
    }
    renderStep(s);
  }

  function skip() {
    end();
  }

  /* The intro's own Skip link: bail out of the whole tutorial, not
     just this slide — the interactive coach marks never start. */
  function skipIntro() {
    closeIntro();
    introOnDone = null;
    markDone();
  }

  /* Called after every stage start; only ever does something on a
     tutorial-flagged stage that hasn't been completed yet. */
  function maybeStart(state) {
    if (!state || !state.tutorial || isDone()) return;
    showIntro(() => begin(Game.getState()));
  }

  function cancel() {
    if (coaching) {
      coaching = false;
      document.getElementById("tutorial-coach").classList.remove("open");
    }
    closeIntro();
  }

  return { maybeStart, onRender, skip, cancel, replayIntro, isDone, advanceIntro, skipIntro };
})();

document.getElementById("tutorial-intro-next-btn").addEventListener("click", () => Tutorial.advanceIntro());
document.getElementById("tutorial-intro-skip-btn").addEventListener("click", () => Tutorial.skipIntro());
document.getElementById("tutorial-skip-btn").addEventListener("click", () => Tutorial.skip());
