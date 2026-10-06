// Rewrites the README's Security section: one badge per public repo (not
// forks, not archived) with its count of open Dependabot alerts. Repos with
// Dependabot alerts turned off are left out. Only the lines between the two
// markers change, and the file is written only when they do.
//
// Run by .github/workflows/security-badges.yml every day. Locally, to
// preview: GH_TOKEN=$(gh auth token) node scripts/security-badges.mjs
//
// GH_TOKEN must be able to read Dependabot alerts: the workflow's is a
// fine-grained token with "Dependabot alerts: Read-only" on all repos.

import { readFileSync, writeFileSync } from 'node:fs';

const OWNER = process.env.GITHUB_REPOSITORY_OWNER ?? 'Terrence721';
const TOKEN = process.env.GH_TOKEN;
const README = 'README.md';
const START = '<!-- security-badges:start -->';
const END = '<!-- security-badges:end -->';

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
 * turned off (403, or 404 for a repo with nothing to scan).
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

/** Text for a shields.io static badge: - and _ doubled, the rest URL-encoded. */
const shield = (text) =>
  encodeURIComponent(text.replaceAll('-', '--').replaceAll('_', '__'));

/** One linked badge: the repo's name, then its alerts, green at none. */
function badge(repo, alerts) {
  const message = alerts === 1 ? '1 alert' : `${alerts} alerts`;
  const color = alerts === 0 ? 'brightgreen' : 'red';
  const image = `https://img.shields.io/badge/${shield(repo)}-${shield(message)}-${color}`;
  return `[![${repo}: ${message}](${image})](https://github.com/${OWNER}/${repo}/security)`;
}

const counted = [];
for (const repo of await publicRepos()) {
  const alerts = await openAlerts(repo);
  if (alerts !== null) {
    counted.push({ repo, alerts });
  }
}

const readme = readFileSync(README, 'utf8');
// The file's own line ending (CRLF in a Windows checkout), kept as it is.
const eol = readme.includes('\r\n') ? '\r\n' : '\n';

const section = [
  START,
  '',
  ...counted.map(({ repo, alerts }) => badge(repo, alerts)),
  '',
  'Open Dependabot alerts in each public repo, updated daily by [a GitHub Action](.github/workflows/security-badges.yml).',
  '',
  END,
].join(eol);

const start = readme.indexOf(START);
const end = readme.indexOf(END);
if (start < 0 || end < start) {
  throw new Error(`${README} needs the ${START} and ${END} markers.`);
}
// Slices, not String.replace, so a $ in the text is never special.
const updated =
  readme.slice(0, start) + section + readme.slice(end + END.length);

for (const { repo, alerts } of counted) {
  console.log(`${repo}: ${alerts}`);
}
if (updated === readme) {
  console.log('No change.');
} else {
  writeFileSync(README, updated);
  console.log(`Updated ${README}.`);
}
