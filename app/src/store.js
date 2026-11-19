// SPDX-License-Identifier: MIT
// store.js — the tracker's saved state: which trophies are earned, the
// player's own counts toward PSN's progress targets, and the spoiler setting.
// Everything lives in one localStorage key; export writes it to a file and
// import reads such a file back. No cookies, no network, no other storage.
export const STORAGE_KEY = 'leonida-platinum-progress-v1';

// blankState returns a fresh, empty state.
export function blankState() {
  return { earned: [], counts: {}, spoilers: true };
}

// loadState reads the saved state, tolerating a missing or damaged entry.
export function loadState() {
  const state = blankState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return state;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.earned)) state.earned = parsed.earned.filter((n) => typeof n === 'string');
    if (parsed.counts && typeof parsed.counts === 'object') {
      for (const [id, value] of Object.entries(parsed.counts)) {
        const n = Math.floor(Number(value));
        if (Number.isFinite(n) && n >= 0) state.counts[id] = n;
      }
    }
    if (typeof parsed.spoilers === 'boolean') state.spoilers = parsed.spoilers;
  } catch {
    // A damaged save is ignored; the tracker starts empty rather than dying.
  }
  return state;
}

// saveState writes the state back to localStorage.
export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// isEarned reports whether a trophy name is ticked.
export function isEarned(state, name) {
  return state.earned.includes(name);
}

// toggleEarned ticks or unticks one trophy and saves.
export function toggleEarned(state, name) {
  if (isEarned(state, name)) state.earned = state.earned.filter((n) => n !== name);
  else state.earned.push(name);
  saveState(state);
}

// trophyCount reads the player's logged count for a trophy id (0 if none).
export function trophyCount(state, id) {
  return state.counts[String(id)] ?? 0;
}

// setTrophyCount logs a count toward a trophy's PSN target, clamped to it.
export function setTrophyCount(state, id, target, value) {
  const n = Math.max(0, Math.min(target, Math.floor(Number(value)) || 0));
  if (n === 0) delete state.counts[String(id)];
  else state.counts[String(id)] = n;
  saveState(state);
}

// exportFile downloads the state as a JSON file the tracker can import back.
export function exportFile(state) {
  const payload = {
    app: 'leonida-platinum',
    version: 1,
    exportedAt: new Date().toISOString(),
    earned: [...state.earned].sort(),
    counts: state.counts,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const anchor = document.createElement('a');
  anchor.href = URL.createObjectURL(blob);
  anchor.download = 'leonida-platinum-progress.json';
  anchor.click();
  URL.revokeObjectURL(anchor.href);
}

// importFile reads an exported file and replaces the state with it, keeping
// only trophy names the list actually holds. It returns what it kept and
// what it refused, so the app can report both.
export function importFile(state, text, knownNames) {
  const parsed = JSON.parse(text);
  const known = new Set(knownNames);
  const earned = Array.isArray(parsed.earned) ? parsed.earned.filter((n) => known.has(n)) : [];
  const rejected = Array.isArray(parsed.earned) ? parsed.earned.filter((n) => !known.has(n)) : [];
  const counts = {};
  if (parsed.counts && typeof parsed.counts === 'object') {
    for (const [id, value] of Object.entries(parsed.counts)) {
      const n = Math.floor(Number(value));
      if (Number.isFinite(n) && n >= 0) counts[id] = n;
    }
  }
  state.earned = [...new Set(earned)];
  state.counts = counts;
  if (typeof parsed.spoilers === 'boolean') state.spoilers = parsed.spoilers;
  saveState(state);
  return { imported: state.earned.length, rejected };
}
