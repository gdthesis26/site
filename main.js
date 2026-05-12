/* ─────────────────────────────────────────────
   RESIST — Thesis Exhibition
   main.js  |  homepage ticker + bg fade + menu
───────────────────────────────────────────── */

// Each row is one phrase (name + word), displayed as a repeating ticker
const rows = [
  'lannie yu permanence',
  'cindy hoang nguyen transience',
  'nina mayne connection',
  'vivan nadkarni encryption',
  'haotian shen imposition',
  'anny long focus',
  'zoey zhu mourning',
];

const colors = [
  '#FE9785',
  '#E8AC33',
  '#A34988',
  '#74960E',
  '#85143B',
  '#173345',
  '#6FBECB',
];

const wrap       = document.getElementById('tickerWrap');
const tracks     = [];
const directions = [1, -1, 1, -1, 1, -1, 1];
const speeds     = [0.6, 0.85, 0.55, 0.75, 0.65, 0.9, 0.5];

/* ── BUILD ROWS ── */
rows.forEach((phrase, i) => {
  const row = document.createElement('div');
  row.className = 'ticker-row';

  const track = document.createElement('div');
  track.className = 'ticker-track';

  // Repeat phrase enough times to fill screen width generously
  const REPS = 20;
  for (let r = 0; r < REPS; r++) {
    const span = document.createElement('span');
    span.className = 'ticker-word';
    span.textContent = phrase;
    track.appendChild(span);

    // single space separator
    const sep = document.createElement('span');
    sep.className = 'ticker-sep';
    sep.textContent = ' ';
    track.appendChild(sep);
  }
  track.innerHTML += track.innerHTML; // duplicate for seamless loop

  row.appendChild(track);
  wrap.appendChild(row);
  tracks.push({ track, dir: directions[i] });
});

/* ── ANIMATION ── */
let positions;

function initPositions() {
  positions = tracks.map(({ dir }) =>
    dir === 1 ? 0 : tracks[0].track.scrollWidth / 2
  );
  // recalc per track since widths differ slightly
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

/* ── BACKGROUND COLOR FADE ── */
let currentColor = 0;

function cycleColor() {
  const next = (currentColor + 1) % colors.length;
  document.body.style.backgroundColor = colors[next];
  currentColor = next;
}

// Set initial color instantly
document.body.style.backgroundColor = colors[0];
// Fade every 2.5s
setInterval(cycleColor, 2500);

/* ── MENU ── */
function toggleMenu() {
  document.body.classList.toggle('menu-open');
}