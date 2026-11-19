// SPDX-License-Identifier: MIT
// render-checklist.js — the checklist itself and the guide pane beside it:
// one row per trophy with its official name, description and grade, a tick
// box, its kind and missable flags, and the PSN target count where the game
// tracks one; and a detail pane with the full guide, its sources, the
// spoiler-masked state, and a count stepper for tracked trophies.
import { isEarned, toggleEarned, trophyCount, setTrophyCount } from './store.js';
import { KIND_LABELS, isSpoilerMasked } from './filters.js';
import { sourceLinks } from './sources.js';

// gradeDot returns the medal dot for a grade.
function gradeDot(grade) {
  const dot = document.createElement('span');
  dot.className = `medal medal-${grade}`;
  dot.textContent = grade === 'platinum' ? 'P' : grade[0].toUpperCase();
  dot.title = grade;
  return dot;
}

// kindTags builds the small kind labels for one trophy.
function kindTags(trophy) {
  const wrap = document.createElement('span');
  wrap.className = 'tags';
  for (const kind of trophy.kind) {
    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.textContent = KIND_LABELS[kind] ?? kind;
    wrap.append(tag);
  }
  if (trophy.hidden) {
    const tag = document.createElement('span');
    tag.className = 'tag tag-hidden';
    tag.textContent = 'Hidden on PSN';
    wrap.append(tag);
  }
  if (trophy.missable) {
    const tag = document.createElement('span');
    tag.className = 'tag tag-missable';
    tag.textContent = 'Missable';
    wrap.append(tag);
  }
  return wrap;
}

// renderChecklist rebuilds the trophy rows for the filtered list.
export function renderChecklist(list, trophies, state, revealed, selectedId, onSelect, onToggle) {
  list.replaceChildren();
  if (trophies.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'empty';
    empty.textContent = 'No trophies match these filters.';
    list.append(empty);
    return;
  }
  for (const trophy of trophies) {
    const row = document.createElement('li');
    row.className = 'trophy-row';
    if (trophy.id === selectedId) row.classList.add('selected');
    if (isEarned(state, trophy.name)) row.classList.add('earned');

    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = isEarned(state, trophy.name);
    box.setAttribute('aria-label', `Mark ${trophy.name} as earned`);
    box.addEventListener('change', () => onToggle(trophy));
    row.append(box);
    row.append(gradeDot(trophy.grade));

    const body = document.createElement('button');
    body.type = 'button';
    body.className = 'row-body';
    body.addEventListener('click', () => onSelect(trophy.id));

    const masked = isSpoilerMasked(trophy, state, revealed);
    const name = document.createElement('span');
    name.className = 'row-name';
    name.textContent = masked ? 'Hidden story trophy' : trophy.name;
    const desc = document.createElement('span');
    desc.className = 'row-desc';
    desc.textContent = masked ? 'Hidden on PlayStation until earned — turn spoilers off or earn it to reveal.' : trophy.description;
    body.append(name, desc);
    body.append(kindTags(trophy));

    if (trophy.target !== null) {
      const chip = document.createElement('span');
      chip.className = 'target-chip';
      chip.textContent = `PSN ${trophyCount(state, trophy.id)}/${trophy.target}`;
      body.append(chip);
    }
    row.append(body);
    list.append(row);
  }
}

// renderDetailPane shows one trophy's full guide beside the checklist.
export function renderDetailPane(pane, trophy, state, revealed, onReveal, onToggle, onCount) {
  pane.replaceChildren();
  if (!trophy) {
    const hint = document.createElement('p');
    hint.className = 'pane-hint';
    hint.textContent = 'Pick a trophy from the list to read its guide.';
    pane.append(hint);
    return;
  }

  const masked = isSpoilerMasked(trophy, state, revealed);
  const head = document.createElement('div');
  head.className = 'pane-head';
  head.append(gradeDot(trophy.grade));
  const title = document.createElement('h2');
  title.textContent = masked ? 'Hidden story trophy' : trophy.name;
  head.append(title);
  pane.append(head);

  const meta = document.createElement('p');
  meta.className = 'pane-meta';
  meta.textContent = masked
    ? 'Story trophy · hidden on PlayStation until earned'
    : `${trophy.grade[0].toUpperCase() + trophy.grade.slice(1)} · ${trophy.description}`;
  pane.append(meta);

  if (masked) {
    const note = document.createElement('p');
    note.className = 'spoiler-note';
    note.textContent = 'Spoilers are on, so this story trophy stays hidden until you earn it. Its name, description and guide name a story mission.';
    pane.append(note);
    const reveal = document.createElement('button');
    reveal.type = 'button';
    reveal.className = 'button';
    reveal.textContent = 'Reveal this trophy anyway';
    reveal.addEventListener('click', () => onReveal(trophy.id));
    pane.append(reveal);
  } else {
    if (trophy.missable) {
      const warn = document.createElement('p');
      warn.className = 'missable-warning';
      warn.textContent = `Missable — ${trophy.missableNote}`;
      pane.append(warn);
    }
    if (trophy.target !== null) {
      pane.append(countStepper(trophy, state, onCount));
    }
    const guideTitle = document.createElement('h3');
    guideTitle.textContent = 'Guide';
    pane.append(guideTitle);
    const guide = document.createElement('p');
    guide.className = 'guide-text';
    guide.textContent = trophy.guide;
    pane.append(guide);

    const sourcesTitle = document.createElement('h3');
    sourcesTitle.textContent = 'Sources';
    pane.append(sourcesTitle);
    const sources = document.createElement('ul');
    sources.className = 'source-list';
    for (const source of sourceLinks(trophy.sources)) {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = source.url;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = source.name;
      item.append(link);
      const covers = document.createElement('span');
      covers.textContent = ` — ${source.covers}`;
      item.append(covers);
      sources.append(item);
    }
    pane.append(sources);
    const honesty = document.createElement('p');
    honesty.className = 'honesty';
    honesty.textContent = 'Guides are written in our own words for this entry. Where a place or step has not been checked in the game yet, the guide says so instead of guessing.';
    pane.append(honesty);
  }

  const earnedButton = document.createElement('button');
  earnedButton.type = 'button';
  earnedButton.className = 'button button-earned';
  earnedButton.textContent = isEarned(state, trophy.name) ? '✓ Earned — unmark' : 'Mark as earned';
  earnedButton.addEventListener('click', () => onToggle(trophy));
  pane.append(earnedButton);
}

// countStepper builds the +/- stepper that logs progress toward a PSN target.
function countStepper(trophy, state, onCount) {
  const wrap = document.createElement('div');
  wrap.className = 'counter';
  const label = document.createElement('span');
  label.textContent = `Your progress (PSN tracks 0/${trophy.target}):`;
  const minus = document.createElement('button');
  minus.type = 'button';
  minus.textContent = '−';
  minus.setAttribute('aria-label', 'Decrease count');
  minus.addEventListener('click', () => onCount(trophy, trophyCount(state, trophy.id) - 1));
  const value = document.createElement('input');
  value.type = 'number';
  value.min = '0';
  value.max = String(trophy.target);
  value.value = String(trophyCount(state, trophy.id));
  value.setAttribute('aria-label', `Count toward ${trophy.name}`);
  value.addEventListener('change', () => onCount(trophy, Number(value.value)));
  const plus = document.createElement('button');
  plus.type = 'button';
  plus.textContent = '+';
  plus.setAttribute('aria-label', 'Increase count');
  plus.addEventListener('click', () => onCount(trophy, trophyCount(state, trophy.id) + 1));
  const total = document.createElement('span');
  total.textContent = `/ ${trophy.target}`;
  wrap.append(label, minus, value, plus, total);
  return wrap;
}
