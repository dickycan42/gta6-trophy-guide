# Leonida Platinum — GTA 6 Trophy Guide & Tracker

[![gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?source=github&medium=readme&campaign=gta6-trophy-guide-01) [![rank](https://make.fun/badge/gta6-trophy-guide-01/dickycan42/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard) [![reward](https://make.fun/badge/gta6-trophy-guide-01/dickycan42/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

An offline guide and tracker for all 55 PlayStation 5 trophies of Grand Theft Auto VI: a checklist saved in the browser, a roadmap to the platinum, missable warnings, and a cited guide for every trophy. It runs fully offline in a desktop browser from its own files — no network, no account, nothing uploaded.

## What it does

- **Every trophy, as PlayStation publishes it** — all 55 official names, descriptions and grades (1 platinum, 2 gold, 6 silver, 46 bronze; 28 hidden on PSN, 0 online), with PSN's progress counts where the game tracks one (250 stunts, 42 shooting-range golds, 18 meditation spots, and the rest).
- **A tracker that remembers** — tick trophies off, log your own counts toward PSN's targets (0/250, 0/42…), and see overall, per-grade and per-kind progress. Progress is saved in localStorage and can be exported to a file and imported back.
- **Filters by kind** — story, missable, collectibles, activities, side stories, robbery & money, plus grade, earned/remaining and text search. There is an online filter too; it honestly matches nothing, because the list holds no online trophies.
- **A spoiler setting** — with spoilers on, story trophies stay hidden (name, description and guide) until you earn them; any single trophy can still be revealed on purpose.
- **A roadmap to the platinum** — seven stages built from the official descriptions: which story chapters and missions, which collectibles and counts, in what order, with the save rules that protect a playthrough (the game has no mission replay).
- **Missable warnings** — the two trophies that can be missed or put at risk (Positive Mental Attitude's Chapter 1 balcony meditation; Strangers & Freaks' time-sensitive Chapter 3 race), with when and how to protect them.
- **A cited guide for every trophy** — written in our own words for this entry, each naming its sources beside it (Exophase for the official list, PSNProfiles for PSN's counts, OutputLag and EGamers.io for the methods and the missable flags). Where a place or step has not been checked in the game yet, the guide says so instead of guessing.

## How to use it

1. Open the app (serve `app/` with any static server, for example `node serve.ts`, then visit http://localhost:8080).
2. Tick off trophies as you earn them; use the count steppers for trophies with a PSN target.
3. Read the Roadmap tab before a session, and the Missable tab before Chapter 1 ends.
4. Use Export progress to back up your checklist, and Import progress to restore it.

## How to hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library. No install, no build step, standard library only.

## Originality

An original design and original guide text. It uses no Rockstar Games logo, no official artwork, no box art and no screenshot from the game. Trophy names and descriptions are shown exactly as PlayStation publishes them; everything else is written for this entry, and every source is cited beside the guide that uses it.

## License

MIT — see [LICENSE](LICENSE).
