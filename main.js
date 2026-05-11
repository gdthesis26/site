const words = [
  'transience', 'connection', 'awareness',
  'mourning', 'focus', 'encryption', 'permanence',
];

const wrap       = document.getElementById('tickerWrap');
const tracks     = [];
const directions = [1, -1, 1, -1, 1, -1, 1]; // 1 = left, -1 = right
const speeds     = [0.6, 0.85, 0.55, 0.75, 0.65, 0.9, 0.5];

/* shuffle words */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* no repeat words next to each other */
function shuffleSafe(arr, prevLast, nextFirst) {
  let attempt;
  let tries = 0;
  do {
    attempt = shuffle(arr);
    tries++;
  } while (
    tries < 50 &&
    (attempt[0] === prevLast || attempt[attempt.length - 1] === nextFirst)
  );

  if (attempt[0] === prevLast) {
    const swapIdx = attempt.findIndex((w, i) => i > 0 && w !== prevLast);
    [attempt[0], attempt[swapIdx]] = [attempt[swapIdx], attempt[0]];
  }
  if (attempt[attempt.length - 1] === nextFirst) {
    const last = attempt.length - 1;
    const swapIdx = attempt.findIndex((w, i) => i < last && w !== nextFirst);
    [attempt[last], attempt[swapIdx]] = [attempt[swapIdx], attempt[last]];
  }
  return attempt;
}

/* rows of words */
words.forEach((_, i) => {
  const row   = document.createElement('div');
  row.className = 'ticker-row';

  const track = document.createElement('div');
  track.className = 'ticker-track';

  /* no adjacent repeats */
  const REPS = 6;
  const sets = [];
  for (let r = 0; r < REPS; r++) {
    const prevLast  = r === 0 ? null : sets[r - 1][sets[r - 1].length - 1];
    // nextFirst will be sets[0][0] for the last set (since we duplicate for looping)
    // We don't know sets[0] yet for r===REPS-1, so pass null and fix after
    const nextFirst = null;
    sets.push(shuffleSafe(words, prevLast, nextFirst));
  }

  // Fix the seam between the last set and the first set (loop boundary)
  const lastSet  = sets[REPS - 1];
  const firstSet = sets[0];
  if (lastSet[lastSet.length - 1] === firstSet[0]) {
    // Swap the last element of the last set with any non-matching element
    const last = lastSet.length - 1;
    const swapIdx = lastSet.findLastIndex((w, idx) => idx < last && w !== firstSet[0]);
    if (swapIdx !== -1) {
      [lastSet[last], lastSet[swapIdx]] = [lastSet[swapIdx], lastSet[last]];
    }
  }


  const sequence = sets.flat();
  sequence.forEach(word => {
    const span = document.createElement('span');
    span.className   = 'ticker-word';
    span.textContent = word;
    track.appendChild(span);
  });

  track.innerHTML += track.innerHTML;

  row.appendChild(track);
  wrap.appendChild(row);
  tracks.push({ track, dir: directions[i] });
});

/* animation */
let positions;

function initPositions() {
  positions = tracks.map(({ track, dir }) =>
    dir === 1 ? 0 : track.scrollWidth / 2
  );
}

function animate() {
  tracks.forEach(({ track, dir }, i) => {
    const half = track.scrollWidth / 2;
    positions[i] += speeds[i] * dir;
    if (dir ===  1 && positions[i] >=  half) positions[i] -= half;
    if (dir === -1 && positions[i] <= -half) positions[i] += half;
    track.style.transform = `translateX(${-positions[i]}px)`;
  });
  requestAnimationFrame(animate);
}

initPositions();
animate();

/* Menu */
function toggleMenu() {
  document.body.classList.toggle('menu-open');
}