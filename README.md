# Terrence Daniels

Principal Full-Stack Engineer finding & fixing real defects across .NET, Java, Angular, React, Vue & Node.js/Laravel codebases.

**[LinkedIn](https://www.linkedin.com/in/terrence-daniels)** · **[Portfolio hub ↗](https://terrence721.github.io/)**

## Featured projects

### [coolify-full](https://github.com/Terrence721/coolify-full) — Principal Full-Stack Engineering Demonstration

An enhanced fork of Coolify (a self-hostable Heroku/Vercel alternative) used as a technical portfolio piece: a live, real-world Laravel monolith modernized incrementally rather than rewritten from scratch.

- **84/84 pages** migrated from Livewire to Inertia.js + React, one page at a time, each conversion verified with automated tests — not a big-bang rewrite
- **PHPStan baseline taken from 1,306 → 55** suppressed errors, phase by phase, each phase individually verified with a full test-suite run
- **1,483 Pest tests**, real pre-existing bugs found and fixed along the way (documented, not hidden)
- Full Docker Compose dev environment, de-commercialized (billing/subscription surface area removed) for a clean self-hosted fork

Every claim in that repo's README is checkable against its own commit history — see the README's "Reading the commit history" section for exactly how.

### [platform-main](https://github.com/Terrence721/platform-main) — Principal Frontend Engineering Demonstration

A from-scratch rebuild of NgRx's core state-management libraries, module by module: real, MIT-licensed source ported where fidelity to a battle-tested implementation matters, and specific classes deliberately redesigned where the original violates its own interface.

- **6 classes redesigned** from RxJS inheritance to composition, fixing a genuine Interface Segregation violation in the real upstream source — found across three audit passes, not a spot-check
- **5,389 Vitest tests, 0 lint errors**, across all 13 modules added
- **An 18×/4.5× real performance fix**, found by refusing to accept a reporting-config change that only looked like a fix, and tracing it to the actual bug instead
- **10 CodeQL security findings** (6x ReDoS + 4x prototype pollution) found and fixed in ported source, landed through real Pull Requests

Every claim in that repo's README/case study is checkable against its own commit history and live CI — see [`docs/case-study.md`](https://github.com/Terrence721/platform-main/blob/main/docs/case-study.md) for the full writeup.

### [saga-full](https://github.com/Terrence721/saga-full) — Principal Full-Stack Engineering Demonstration (Java)

A from-scratch implementation of the Distributed Saga pattern across independent microservices — a JWT-guarded API gateway in front of order placement, payment, and fulfillment, coordinated with compensating transactions instead of a shared database transaction. All six backend modules are built and wired end-to-end; a file-by-file code-review audit is now underway, the same discipline already proven on `coolify-full` and `platform-main`.

- **6/6 backend services complete, 111/111 tests passing**, verified against real Postgres and Kafka infrastructure, not mocked
- **17 real bugs found & fixed** — build-tooling incompatibilities (JDK 25 vs. Gradle, Lombok, Mockito, Spring Boot's bundled ASM), two real security fixes in the login flow (a user-enumeration issue and its timing-side-channel sibling), a live IDOR the code-review audit caught and closed, a Kafka poison-pill gap, a second cross-service log-injection trace, a data-integrity validation gap, a payment-decline path that never existed, and a refund compensation that never checked whose order it was refunding — found and fixed across `order-service`'s and `payment-service`'s code-review passes
- Original gRPC contract design, not a copy of any reference material used only for the module layout
- Full reasoning for every decision recorded in [`docs/architecture.md`](https://github.com/Terrence721/saga-full/blob/main/docs/architecture.md), progress tracked in [`todo.md`](https://github.com/Terrence721/saga-full/blob/main/todo.md), and work tracked on a public [project board](https://github.com/users/Terrence721/projects/3)

The code-review audit itself is still in progress — `user-contract`, `user-service`, and `order-service` are closed out, `payment-service` is 11/14 files in — see `todo.md` for current status rather than assuming it's finished.

### [conduit-full](https://github.com/Terrence721/conduit-full) — Full-Stack Engineering Demonstration (React/Express)

An independently modernized fork of the RealWorld Conduit example app — a Medium-style publishing platform (CRUD, auth, pagination) built with React 19/Vite/Express 5/Sequelize/PostgreSQL. Rather than copying the source repo over wholesale, it's being rebuilt one file at a time, with dependencies and patterns brought up to their current latest along the way.

- **Backend complete: 100% TypeScript, 214 tests passing**, 23 real bugs found and fixed along the way (disclosed in `todo.md`, not hidden)
- **Frontend in progress, TypeScript from file one**: all 16 planned API service modules and both context files (`AuthContext`, `FeedContext`) done; components layer started (2 of ~24). 4 more real bugs found along the way; a real gap disclosed too — the 20 frontend files built so far have no behavioral tests yet, tracked openly rather than hidden
- Yarn workspace, MIT license (original upstream copyright preserved), and CI (ESLint, Prettier, Vitest, CodeQL) in place — none of which existed in the source repo

Every claim here is checkable against this repo's own commit history and live CI — see [`todo.md`](https://github.com/Terrence721/conduit-full/blob/main/todo.md) and the [project board](https://github.com/users/Terrence721/projects/4) for current status.

### [eshop-full](https://github.com/Terrence721/eshop-full) — Full-Stack Engineering Demonstration (.NET Aspire)

An independently modernized version of Microsoft's dotnet/eShop reference app — a .NET Aspire microservices e-commerce platform (Catalog, Basket, Ordering, Identity, Payments, Webhooks, a React storefront in place of upstream's Blazor, RabbitMQ event bus). Rather than copying the source repo over wholesale, it's being added one file at a time, with every package version individually researched against what's actually current rather than assumed.

- **4 of 21 projects done** (EventBus, EventBusRabbitMQ, eShop.ServiceDefaults, IntegrationEventLogEF), a 5th (Identity.API, Duende IdentityServer) in progress — real bugs found and fixed along the way, not just version bumps: a Polly retry pipeline that never actually awaited its own operation (so it silently never retried the failures it was configured to catch), a null-conditional that made an error-handling branch unreachable dead code, a disabled JWT audience check that would have let a token issued for one downstream API be replayed against another, and a silent event-type-collision bug in the transactional outbox's reflection-based type resolver
- **Every completed project is fully tested**: MSTest on .NET's newer Microsoft.Testing.Platform runner, 83 passing tests across all 4 done projects, with CI coverage collection and PR-visible test reporting verified against real GitHub Actions runs. That Polly retry fix above? Verified end-to-end for the first time by one of those tests — not just fixed and assumed correct
- Full reasoning recorded in [`docs/architecturedesign.md`](https://github.com/Terrence721/eshop-full/blob/main/docs/architecturedesign.md), progress tracked in [`todo.md`](https://github.com/Terrence721/eshop-full/blob/main/todo.md), and work tracked on a public [project board](https://github.com/users/Terrence721/projects/5)

This one's still early — see `todo.md` for current status rather than assuming it's finished.

### [directus-main](https://github.com/Terrence721/directus-main) — Full-Stack Engineering Demonstration (Node.js/Vue, Yarn)

An independently maintained port of Directus's own monorepo — a real-time API/App dashboard for managing SQL database content — brought over one package at a time, with its package management switched from pnpm to Yarn along the way rather than left as-is.

- **All 40 workspace packages migrated to Yarn**: pnpm's `catalog:` version-catalog protocol (673 references across 40 files) resolved to pinned versions individually, `pnpm.overrides` translated to Yarn `resolutions`, and 17 GitHub Actions workflows rewritten off pnpm
- **A real gap found, fixed, then improved again**: `pnpm deploy` (used to build a standalone production bundle) has no Yarn equivalent — replaced with a custom script (`scripts/deploy-production.mjs`) built on `yarn workspaces focus`; an initial version pruned the repo's own root `node_modules` in place, later corrected to run inside a disposable `git worktree` instead, so the live working tree is never touched
- **Genuinely early**: 3 of 40 workspace packages have real source — `directus` (the CLI wrapper, complete but not runnable yet), `types` (source complete, 56 of 56 files, though it doesn't fully type-check yet — 3 cross-package dependencies still manifest-only), and `schema` (newly started, 3 of 16 files) — the rest are migrated `package.json` manifests, with source trees still to come one at a time
- Full reasoning recorded in [`architect.md`](https://github.com/Terrence721/directus-main/blob/main/architect.md), progress tracked in [`todo.md`](https://github.com/Terrence721/directus-main/blob/main/todo.md), and work tracked on a public [project board](https://github.com/users/Terrence721/projects/6)

This one's genuinely early — see `todo.md` for current status rather than assuming it's finished.
