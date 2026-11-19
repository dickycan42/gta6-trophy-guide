// SPDX-License-Identifier: MIT
// filters.js — the tracker's filters and the spoiler rule. Kinds are built
// from the official descriptions: story, missable, collectibles, activities,
// side stories, robbery and money. The list holds no online trophies — all 55
// are offline single-player — so the online filter honestly matches nothing
// and the app says so instead of pretending otherwise.
export const KIND_FILTERS = [
  { id: 'all', label: 'All trophies' },
  { id: 'story', label: 'Story' },
  { id: 'missable', label: 'Missable' },
  { id: 'collectible', label: 'Collectibles' },
  { id: 'activity', label: 'Activities' },
  { id: 'side', label: 'Side stories' },
  { id: 'robbery', label: 'Robbery & money' },
  { id: 'online', label: 'Online' },
];

export const KIND_LABELS = {
  platinum: 'Platinum',
  story: 'Story',
  side: 'Side story',
  collectible: 'Collectible',
  activity: 'Activity',
  robbery: 'Robbery',
  money: 'Money',
  grind: 'Grind',
};

// kindCount counts the trophies one filter chip covers, for its label.
export function kindCount(trophies, kind) {
  if (kind === 'all') return trophies.length;
  if (kind === 'missable') return trophies.filter((t) => t.missable).length;
  if (kind === 'online') return 0;
  if (kind === 'robbery') return trophies.filter((t) => t.kind.includes('robbery') || t.kind.includes('money')).length;
  return trophies.filter((t) => t.kind.includes(kind)).length;
}

// filterTrophies applies the kind, grade, earned-state and search filters.
// options: { kind, grade, earned, query } — each 'all'/'' means no filter.
export function filterTrophies(trophies, state, options) {
  const query = (options.query ?? '').trim().toLowerCase();
  return trophies.filter((trophy) => {
    if (options.kind && options.kind !== 'all') {
      if (options.kind === 'missable' && !trophy.missable) return false;
      if (options.kind === 'online') return false;
      if (options.kind === 'robbery' && !trophy.kind.includes('robbery') && !trophy.kind.includes('money')) return false;
      if (options.kind !== 'missable' && options.kind !== 'robbery' && !trophy.kind.includes(options.kind)) return false;
    }
    if (options.grade && options.grade !== 'all' && trophy.grade !== options.grade) return false;
    if (options.earned === 'earned' && !state.earned.includes(trophy.name)) return false;
    if (options.earned === 'remaining' && state.earned.includes(trophy.name)) return false;
    if (query) {
      const haystack = `${trophy.name} ${trophy.description} ${trophy.guide}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}

// isSpoilerMasked is the spoiler rule: with spoilers on, a story trophy the
// player has not earned yet shows neither its name nor its description.
export function isSpoilerMasked(trophy, state, revealed) {
  if (!state.spoilers) return false;
  if (state.earned.includes(trophy.name)) return false;
  if (revealed.has(trophy.id)) return false;
  return trophy.kind.includes('story');
}
