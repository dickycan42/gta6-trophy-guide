// SPDX-License-Identifier: MIT
// sources.js — the source directory for this guide: every trophy's guide names
// its sources by id, and this table turns each id into the name and link the
// reader sees beside the guide. A source is cited, never copied: the official
// names and descriptions are the exception and are shown as PlayStation
// publishes them. Links open only when the reader follows them; the app
// itself fetches nothing over the network.
export const SOURCES = {
  exophase: {
    name: 'Exophase — Grand Theft Auto VI trophies (PS5)',
    url: 'https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/',
    covers: 'Official trophy names, descriptions and grades, as listed before this bounty opened.',
  },
  psnprofiles: {
    name: 'PSNProfiles — Grand Theft Auto VI trophies',
    url: 'https://psnprofiles.com/trophies/43531-grand-theft-auto-vi',
    covers: "PlayStation's progress counts (PSN targets such as 0/250 stunts and 0/42 shooting-range challenges).",
  },
  outputlag: {
    name: 'OutputLag — GTA 6 Trophy List: All 55 Trophies and Achievements',
    url: 'https://outputlag.com/guides/gta-6-trophy-list/',
    covers: 'Visible / hidden split (27 visible, 28 hidden), the missable warning, no mission replay, and the methods for the robbery, partner, tank, plane and money trophies.',
  },
  egamers: {
    name: 'EGamers.io — GTA 6 Trophy List: All 55 Trophies And Achievements, Plus The Hardest Ones',
    url: 'https://egamers.io/gta-6-trophy-list-all-55-trophies-and-achievements-plus-the-hardest-ones/',
    covers: 'Positive Mental Attitude as the only trophy reported as possibly missable; A Long Road as the hardest trophy.',
  },
  ofzen: {
    name: 'Of Zen and Computing — GTA 6 Trophy List (November 2026) All 55 Trophies',
    url: 'https://www.ofzenandcomputing.com/gta-6-trophy-list-trophies-achievements/',
    covers: 'The 27 non-hidden and 28 hidden trophies as separate lists.',
  },
};

// sourceEntries returns the directory as an ordered list for the Sources tab.
export function sourceEntries() {
  return Object.entries(SOURCES).map(([id, source]) => ({ id, ...source }));
}

// sourceLinks builds the "Sources:" line for one trophy's guide: one link
// per source id, in the order the trophy lists them.
export function sourceLinks(ids) {
  return ids
    .map((id) => SOURCES[id])
    .filter(Boolean)
    .map((source) => ({ name: source.name, url: source.url, covers: source.covers }));
}
