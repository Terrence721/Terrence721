# Terrence Daniels

Principal Full-Stack Engineer — Laravel/PHP backend, React/Inertia frontend, containerized infrastructure.

**[LinkedIn](https://www.linkedin.com/in/terrence-daniels)** · **[Portfolio hub ↗](https://terrence721.github.io/)**

## Featured projects

### [coolify-full](https://github.com/Terrence721/coolify-full) — Principal Full-Stack Engineering Demonstration

An enhanced fork of Coolify (a self-hostable Heroku/Vercel alternative) used as a technical portfolio piece: a live, real-world Laravel monolith modernized incrementally rather than rewritten from scratch.

- **84/84 pages** migrated from Livewire to Inertia.js + React, one page at a time, each conversion verified with automated tests — not a big-bang rewrite
- **PHPStan baseline taken from 1,306 → 55** suppressed errors, phase by phase, each phase individually verified with a full test-suite run
- **1,200+ Pest tests**, real pre-existing bugs found and fixed along the way (documented, not hidden)
- Full Docker Compose dev environment, de-commercialized (billing/subscription surface area removed) for a clean self-hosted fork

Every claim in that repo's README is checkable against its own commit history — see the README's "Reading the commit history" section for exactly how.

### [platform-main](https://github.com/Terrence721/platform-main) — Principal Frontend Engineering Demonstration

A from-scratch rebuild of NgRx's core state-management libraries, module by module: real, MIT-licensed source ported where fidelity to a battle-tested implementation matters, and specific classes deliberately redesigned where the original violates its own interface.

- **6 classes redesigned** from RxJS inheritance to composition, fixing a genuine Interface Segregation violation in the real upstream source — found across three audit passes, not a spot-check
- **1,411 Vitest tests, 0 lint errors**, across the 4 of 12 modules ported so far
- **An 18×/4.5× real performance fix**, found by refusing to accept a reporting-config change that only looked like a fix, and tracing it to the actual bug instead
- **6 CodeQL security findings** (ReDoS + prototype pollution) found and fixed in ported source, landed through a real Pull Request

Every claim in that repo's README/case study is checkable against its own commit history and live CI — see [`docs/case-study.md`](https://github.com/Terrence721/platform-main/blob/main/docs/case-study.md) for the full writeup.
