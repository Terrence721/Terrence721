// Writes badges/<repo>.json for each public repo (not forks, not archived):
// a shields.io endpoint badge with its count of open Dependabot alerts.
// Repos with Dependabot alerts turned off get none. A file is written only
// when its badge changed, and one for a repo no longer counted is removed.
//
// Each repo shows its own badge with one line in its README:
//   [![security](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/Terrence721/Terrence721/main/badges/<repo>.json)](https://github.com/Terrence721/<repo>/security)
//
// Run by .github/workflows/security-badges.yml every day. Locally, to
// preview: GH_TOKEN=$(gh auth token) node scripts/security-badges.mjs
//
// GH_TOKEN must be able to read Dependabot alerts: the workflow's is a
// fine-grained token with "Dependabot alerts: Read-only" on all repos.

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';

const OWNER = process.env.GITHUB_REPOSITORY_OWNER ?? 'Terrence721';
const TOKEN = process.env.GH_TOKEN;
const BADGES = 'badges';

if (!TOKEN) {
  throw new Error('Set GH_TOKEN to a token that can read Dependabot alerts.');
}

/** A GitHub API GET; answers with the response, whatever its status. */
function get(url) {
  return fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
}

/** Every page of a list, following the Link header's "next". */
async function getAll(url) {
  const items = [];
  for (let next = url; next;) {
    const response = await get(next);
    if (!response.ok) {
      return { status: response.status, items };
    }
    items.push(...(await response.json()));
    next = /<([^>]+)>;\s*rel="next"/.exec(
      response.headers.get('link') ?? '',
    )?.[1];
  }
  return { status: 200, items };
}

/** The owner's public repos that are neither forks nor archived, by name. */
async function publicRepos() {
  const { status, items } = await getAll(
    `https://api.github.com/users/${OWNER}/repos?type=owner&per_page=100`,
  );
  if (status !== 200) {
    throw new Error(`Listing ${OWNER}'s repos answered ${status}.`);
  }
  return items
    .filter((repo) => !repo.fork && !repo.archived && !repo.private)
    .map((repo) => repo.name)
    .sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));
}

/**
 * How many open Dependabot alerts a repo has; null when its alerts are
 * turned off (403, or 404 for a repo with nothing to scan). Any other
 * failure stops the run, so no badge is written with a wrong count.
 */
async function openAlerts(repo) {
  const { status, items } = await getAll(
    `https://api.github.com/repos/${OWNER}/${repo}/dependabot/alerts?state=open&per_page=100`,
  );
  if (status === 403 || status === 404) {
    return null;
  }
  if (status !== 200) {
    throw new Error(`Reading ${repo}'s alerts answered ${status}.`);
  }
  return items.length;
}

/**
 * A shields.io endpoint badge (https://shields.io/badges/endpoint-badge):
 * "security | N alerts", green at none. Shields may cache it for an hour,
 * as the counts change at most daily.
 */
function badge(alerts) {
  return `${JSON.stringify(
    {
      schemaVersion: 1,
      label: 'security',
      message: alerts === 1 ? '1 alert' : `${alerts} alerts`,
      color: alerts === 0 ? 'brightgreen' : 'red',
      cacheSeconds: 3600,
    },
    null,
    2,
  )}\n`;
}

const counted = new Set();
let changed = 0;
mkdirSync(BADGES, { recursive: true });
for (const repo of await publicRepos()) {
  const alerts = await openAlerts(repo);
  if (alerts === null) {
    continue;
  }
  counted.add(`${repo}.json`);
  const file = join(BADGES, `${repo}.json`);
  const content = badge(alerts);
  // Line endings aside: a Windows checkout has CRLF.
  const before = existsSync(file)
    ? readFileSync(file, 'utf8').replaceAll('\r\n', '\n')
    : null;
  if (before !== content) {
    writeFileSync(file, content);
    changed++;
  }
  console.log(`${repo}: ${alerts}`);
}

// A repo that's gone, archived or had its alerts turned off loses its file.
for (const name of readdirSync(BADGES)) {
  if (name.endsWith('.json') && !counted.has(name)) {
    rmSync(join(BADGES, name));
    changed++;
    console.log(`removed ${name}`);
  }
}

console.log(changed === 0 ? 'No change.' : `${changed} badge file(s) changed.`);
