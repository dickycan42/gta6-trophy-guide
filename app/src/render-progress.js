// SPDX-License-Identifier: MIT
// render-progress.js — the progress header: the big earned count, the bar,
// and the per-grade and per-kind breakdowns. Every number comes from the
// saved state, so the header always agrees with the checklist.
import { isEarned } from './store.js';
import { KIND_FILTERS, kindCount } from './filters.js';

// renderProgressHeader rewrites the header numbers for the current state.
export function renderProgressHeader(trophies, state) {
  const earnedTotal = trophies.filter((t) => isEarned(state, t.name)).length;
  const total = trophies.length;
  const percent = total === 0 ? 0 : Math.round((earnedTotal / total) * 100);

  document.getElementById('big-count').textContent = `${earnedTotal} / ${total}`;
  document.getElementById('big-percent').textContent = `${percent}% to the platinum`;
  document.getElementById('progress-fill').style.width = `${percent}%`;
  document.getElementById('progress-fill').setAttribute('aria-valuenow', String(percent));
  document.getElementById('progress-note').textContent =
    earnedTotal === total
      ? 'Leonida Legend — every trophy earned.'
      : `${total - earnedTotal} trophies still to earn.`;

  renderGradeCounts(trophies, state);
  renderKindCounts(trophies, state);
}

// renderGradeCounts writes the earned/total line for each grade.
function renderGradeCounts(trophies, state) {
  const box = document.getElementById('grade-counts');
  box.replaceChildren();
  for (const grade of ['platinum', 'gold', 'silver', 'bronze']) {
    const inGrade = trophies.filter((t) => t.grade === grade);
    const earned = inGrade.filter((t) => isEarned(state, t.name)).length;
    const line = document.createElement('span');
    line.className = `grade-count grade-${grade}`;
    line.textContent = `${grade[0].toUpperCase() + grade.slice(1)} ${earned}/${inGrade.length}`;
    box.append(line);
  }
}

// renderKindCounts writes the earned/total line for each kind filter.
function renderKindCounts(trophies, state) {
  const box = document.getElementById('kind-counts');
  box.replaceChildren();
  for (const filter of KIND_FILTERS) {
    if (filter.id === 'all') continue;
    const total = kindCount(trophies, filter.id);
    const earned = trophies.filter((t) => {
      if (filter.id === 'missable') return t.missable && isEarned(state, t.name);
      if (filter.id === 'online') return false;
      if (filter.id === 'robbery') return (t.kind.includes('robbery') || t.kind.includes('money')) && isEarned(state, t.name);
      return t.kind.includes(filter.id) && isEarned(state, t.name);
    }).length;
    const line = document.createElement('span');
    line.className = 'kind-count';
    line.textContent = `${filter.label} ${earned}/${total}`;
    box.append(line);
  }
}
