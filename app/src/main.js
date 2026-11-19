// SPDX-License-Identifier: MIT
// main.js — the boot for Leonida Platinum: it loads the trophy list and the
// roadmap, wires the tabs, the filters, the spoiler setting and export and
// import, and keeps the checklist, the guide pane and the progress header in
// step. The app loads nothing but its own files and makes no network request.
import { loadState, saveState, toggleEarned, setTrophyCount, exportFile, importFile } from './store.js';
import { KIND_FILTERS, kindCount, filterTrophies } from './filters.js';
import { renderProgressHeader } from './render-progress.js';
import { renderChecklist, renderDetailPane } from './render-checklist.js';
import { renderRoadmap, renderMissables, renderSources } from './render-roadmap.js';

const state = loadState();
const revealed = new Set();
let trophies = [];
let roadmap = null;
let selectedId = 28;
let options = { kind: 'all', grade: 'all', earned: 'all', query: '' };

const list = document.getElementById('trophy-list');
const pane = document.getElementById('detail-pane');
const emptyNote = document.getElementById('empty-note');

// renderAll redraws the header, the checklist and the guide pane together.
function renderAll() {
  renderProgressHeader(trophies, state);
  const filtered = filterTrophies(trophies, state, options);
  emptyNote.hidden = !(options.kind === 'online');
  if (options.kind === 'online') {
    emptyNote.textContent = 'No online trophies: all 55 trophies on this list are offline single-player, so this filter matches nothing by design.';
  }
  renderChecklist(list, filtered, state, revealed, selectedId, selectTrophy, toggleTrophy);
  const selected = trophies.find((t) => t.id === selectedId) ?? null;
  renderDetailPane(pane, selected, state, revealed, revealTrophy, toggleTrophy, changeCount);
}

// selectTrophy opens one trophy's guide and switches to the tracker tab.
function selectTrophy(id) {
  selectedId = id;
  showTab('tracker');
  renderAll();
}

// toggleTrophy ticks or unticks a trophy and redraws.
function toggleTrophy(trophy) {
  toggleEarned(state, trophy.name);
  renderAll();
}

// revealTrophy unmasks one story trophy for this session only.
function revealTrophy(id) {
  revealed.add(id);
  renderAll();
}

// changeCount logs a count toward a trophy's PSN target and redraws.
function changeCount(trophy, value) {
  setTrophyCount(state, trophy.id, trophy.target, value);
  renderAll();
}

// showTab switches the visible tab and updates the address hash.
function showTab(name) {
  for (const tab of document.querySelectorAll('.tab')) {
    tab.classList.toggle('active', tab.dataset.tab === name);
    tab.setAttribute('aria-selected', String(tab.dataset.tab === name));
  }
  for (const section of document.querySelectorAll('.tab-panel')) {
    section.hidden = section.dataset.panel !== name;
  }
  if (location.hash !== `#/${name}`) history.replaceState(null, '', `#/${name}`);
}

// buildKindChips builds the kind filter buttons with their trophy counts.
function buildKindChips() {
  const box = document.getElementById('kind-chips');
  box.replaceChildren();
  for (const filter of KIND_FILTERS) {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chip';
    chip.textContent = `${filter.label} (${kindCount(trophies, filter.id)})`;
    chip.setAttribute('aria-pressed', String(options.kind === filter.id));
    chip.addEventListener('click', () => {
      options.kind = filter.id;
      for (const other of box.children) other.setAttribute('aria-pressed', 'false');
      chip.setAttribute('aria-pressed', 'true');
      renderAll();
    });
    box.append(chip);
  }
}

// wireControls connects the search box, selects, spoiler switch and the
// export, import and reset buttons.
function wireControls() {
  document.getElementById('search').addEventListener('input', (event) => {
    options.query = event.target.value;
    renderAll();
  });
  document.getElementById('grade').addEventListener('change', (event) => {
    options.grade = event.target.value;
    renderAll();
  });
  document.getElementById('earned-filter').addEventListener('change', (event) => {
    options.earned = event.target.value;
    renderAll();
  });
  document.getElementById('spoilers').addEventListener('change', (event) => {
    state.spoilers = event.target.checked;
    saveState(state);
    renderAll();
  });
  document.getElementById('spoilers').checked = state.spoilers;
  document.getElementById('export').addEventListener('click', () => exportFile(state));
  document.getElementById('import').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const report = document.getElementById('import-report');
    try {
      const result = importFile(state, await file.text(), trophies.map((t) => t.name));
      report.textContent = `Imported ${result.imported} earned trophies.` + (result.rejected.length ? ` ${result.rejected.length} unknown names ignored.` : '');
    } catch {
      report.textContent = 'That file could not be imported: it is not a progress file this tracker wrote.';
    }
    event.target.value = '';
    renderAll();
  });
  document.getElementById('reset').addEventListener('click', () => {
    if (window.confirm('Clear all earned ticks and counts? This cannot be undone.')) {
      state.earned = [];
      state.counts = {};
      saveState(state);
      renderAll();
    }
  });
  for (const tab of document.querySelectorAll('.tab')) {
    tab.addEventListener('click', () => showTab(tab.dataset.tab));
  }
}

// boot loads the data, builds the controls and renders the first screen.
async function boot() {
  const [trophyDoc, roadmapDoc] = await Promise.all([
    (await fetch('data/trophies.json')).json(),
    (await fetch('data/roadmap.json')).json(),
  ]);
  trophies = trophyDoc.trophies;
  roadmap = roadmapDoc;
  document.getElementById('list-makeup').textContent =
    `${trophies.length} trophies · 1 platinum · 2 gold · 6 silver · 46 bronze · 28 hidden on PSN · 0 online`;
  buildKindChips();
  wireControls();
  renderRoadmap(document.getElementById('roadmap-panel'), roadmap, trophies, state, selectTrophy);
  renderMissables(document.getElementById('missable-panel'), trophies, state, selectTrophy);
  renderSources(document.getElementById('sources-panel'));
  const tab = location.hash.replace('#/', '') || 'tracker';
  showTab(['tracker', 'roadmap', 'missable', 'sources'].includes(tab) ? tab : 'tracker');
  renderAll();
}

boot();
