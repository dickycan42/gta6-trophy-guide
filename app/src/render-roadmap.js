// SPDX-License-Identifier: MIT
// render-roadmap.js — the roadmap, missables and sources tabs. The roadmap
// is built from the official descriptions alone (chapters, missions,
// collectibles and counts, in order); the missables tab names the two
// trophies that can be missed or put at risk and the save rules that protect
// them; the sources tab lists every source the guides cite.
import { isEarned } from './store.js';
import { sourceEntries } from './sources.js';

// renderRoadmap draws the seven stages to the platinum with their trophies.
export function renderRoadmap(box, roadmap, trophies, state, onSelect) {
  box.replaceChildren();
  const note = document.createElement('p');
  note.className = 'tab-note';
  note.textContent = roadmap.note;
  box.append(note);
  for (const stage of roadmap.stages) {
    const card = document.createElement('section');
    card.className = 'stage';
    const head = document.createElement('h3');
    const done = stage.trophyIds.filter((id) => {
      const trophy = trophies.find((t) => t.id === id);
      return trophy && isEarned(state, trophy.name);
    }).length;
    head.textContent = `Stage ${stage.stage} — ${stage.title} (${done}/${stage.trophyIds.length})`;
    card.append(head);
    const advice = document.createElement('p');
    advice.textContent = stage.advice;
    card.append(advice);
    if (stage.warning) {
      const warning = document.createElement('p');
      warning.className = 'missable-warning';
      warning.textContent = stage.warning;
      card.append(warning);
    }
    const chips = document.createElement('div');
    chips.className = 'stage-chips';
    for (const id of stage.trophyIds) {
      const trophy = trophies.find((t) => t.id === id);
      if (!trophy) continue;
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = `chip ${isEarned(state, trophy.name) ? 'chip-earned' : ''}`;
      chip.textContent = `${isEarned(state, trophy.name) ? '✓ ' : ''}${trophy.name} · ${trophy.grade}`;
      chip.addEventListener('click', () => onSelect(trophy.id));
      chips.append(chip);
    }
    card.append(chips);
    box.append(card);
  }
}

// renderMissables draws the missable cards and the save rules.
export function renderMissables(box, trophies, state, onSelect) {
  box.replaceChildren();
  const intro = document.createElement('p');
  intro.className = 'tab-note';
  intro.textContent = 'Only two trophies on this list can be missed or put at risk, both flagged from the official descriptions and the launch guides. Everything else stays available after the credits, including every side-story finale and the 100% checklist.';
  box.append(intro);

  for (const trophy of trophies.filter((t) => t.missable)) {
    const card = document.createElement('section');
    card.className = 'stage missable-card';
    const head = document.createElement('h3');
    head.textContent = `${trophy.name} — ${trophy.grade}`;
    card.append(head);
    const warn = document.createElement('p');
    warn.className = 'missable-warning';
    warn.textContent = trophy.missableNote;
    card.append(warn);
    const guide = document.createElement('p');
    guide.textContent = trophy.guide;
    card.append(guide);
    const open = document.createElement('button');
    open.type = 'button';
    open.className = 'button';
    open.textContent = 'Open its full guide';
    open.addEventListener('click', () => onSelect(trophy.id));
    card.append(open);
    box.append(card);
  }

  const rules = document.createElement('section');
  rules.className = 'stage';
  const rulesHead = document.createElement('h3');
  rulesHead.textContent = 'Save rules that protect a whole playthrough';
  rules.append(rulesHead);
  const list = document.createElement('ul');
  for (const rule of [
    'There is no mission replay and no New Game Plus: once a story mission is done you cannot select it again.',
    'Keep one manual save at the start of every chapter and one untouched save from just before the final mission. The game has 15 manual save slots plus one autosave — rotate the rest.',
    'Never use cheats on your trophy save: cheats are reported to switch off both trophies and saving.',
    'Side-story finales, collectibles, activities and the 100% checklist all stay open after the credits — only the two trophies above need doing on time.',
  ]) {
    const item = document.createElement('li');
    item.textContent = rule;
    list.append(item);
  }
  rules.append(list);
  box.append(rules);
}

// renderSources draws the source directory and the honesty note.
export function renderSources(box) {
  box.replaceChildren();
  const intro = document.createElement('p');
  intro.className = 'tab-note';
  intro.textContent = 'Every guide in this tracker names its sources beside it. A source is cited, never copied: the guides are written in our own words, and the official trophy names and descriptions are the exception — they are shown exactly as PlayStation publishes them.';
  box.append(intro);
  const list = document.createElement('ul');
  list.className = 'source-list';
  for (const source of sourceEntries()) {
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
    list.append(item);
  }
  box.append(list);
  const honesty = document.createElement('section');
  honesty.className = 'stage';
  const head = document.createElement('h3');
  head.textContent = 'What this guide does not claim';
  honesty.append(head);
  const text = document.createElement('p');
  text.textContent = 'Grand Theft Auto VI released on 19 November 2026, the day this guide was built, so most detailed methods have not been checked inside the game yet. Where a place or step is unconfirmed, the guide says so in plain words instead of inventing one. The game has no online trophies, no difficulty trophies and no mission medals — all 55 are offline single-player — and the platinum is long (around 200 hours by launch estimates), not hard.';
  honesty.append(text);
  const unofficial = document.createElement('p');
  unofficial.className = 'honesty';
  unofficial.textContent = 'Unofficial fan guide. Not affiliated with Rockstar Games, and it shows no Rockstar logo, official artwork, box art or screenshot from the game. The look is our own.';
  honesty.append(unofficial);
  box.append(honesty);
}
