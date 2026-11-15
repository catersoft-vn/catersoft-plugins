import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildAll } from './build-plugins.mjs';
import { resolveDefaultClis, verifyAll } from './verify-plugins.mjs';

/** Extract owner/repo slug from repository metadata URL. */
export function parseRepoSlug(repoUrl) {
  const cleaned = String(repoUrl || '').trim().replace(/\.git$/, '');
  const sshMatch = cleaned.match(/github\.com[:/]([^/]+\/[^/]+)$/);
  if (sshMatch) return sshMatch[1];
  throw new Error(`Cannot parse GitHub owner/repo slug from repository URL: ${repoUrl}`);
}

function ghExists(args, ghCli = 'gh') {
  try {
    const out = execFileSync(ghCli, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    return { exists: true, stdout: out.trim() };
  } catch {
    return { exists: false, stdout: '' };
  }
}

/** Probe GitHub organization and repository visibility using gh CLI. */
export function probeGithubTarget(repoSlug, ghCli = 'gh') {
  const [org] = repoSlug.split('/');
  const orgRes = ghExists(['api', `users/${org}`, '--jq', '.type'], ghCli);
  const repoRes = orgRes.exists ? ghExists(['api', `repos/${repoSlug}`, '--jq', '.full_name'], ghCli) : { exists: false };
  return {
    org,
    repoSlug,
    orgExists: orgRes.exists,
    orgType: orgRes.exists ? orgRes.stdout : null,
    repoExists: repoRes.exists,
  };
}

function readPluginMetas(rootDir) {
  const srcRoot = path.join(rootDir, 'src');
  return fs
    .readdirSync(srcRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(srcRoot, entry.name, 'plugin.meta.json')))
    .map((entry) => entry.name)
    .sort()
    .map((dirName) => JSON.parse(fs.readFileSync(path.join(srcRoot, dirName, 'plugin.meta.json'), 'utf8')));
}

function ensureTagAtHead(rootDir, tagName, message) {
  let existing = null;
  try {
    existing = execFileSync('git', ['rev-parse', '-q', '--verify', `refs/tags/${tagName}^{commit}`], {
      cwd: rootDir,
      encoding: 'utf8',
    }).trim();
  } catch {
    existing = null;
  }

  if (existing) {
    const head = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: rootDir, encoding: 'utf8' }).trim();
    if (existing !== head) {
      throw new Error(
        `Refusing to force-move existing immutable tag ${tagName} (${existing} != ${head}). Bump plugin version first.`,
      );
    }
    return;
  }

  execFileSync('git', ['tag', '-a', tagName, '-m', message], { cwd: rootDir, encoding: 'utf8' });
}

function testRemoteCliInstalls(repoSlug, metas) {
  const { claudeCli, agyCli, codexCli } = resolveDefaultClis();
  const tmpHome = fs.mkdtempSync(path.join(os.tmpdir(), 'cs-remote-plugin-check-'));
  const tmpCodexHome = path.join(tmpHome, '.codex');
  fs.mkdirSync(tmpCodexHome, { recursive: true });
  const env = { ...process.env, HOME: tmpHome, CODEX_HOME: tmpCodexHome };

  try {
    // 1. Claude Code GitHub marketplace install
    execFileSync(claudeCli, ['plugin', 'marketplace', 'add', repoSlug], { env, encoding: 'utf8' });
    for (const meta of metas) {
      execFileSync(claudeCli, ['plugin', 'install', `${meta.name}@catersoft-plugins`], { env, encoding: 'utf8' });
    }
    const claudeList = execFileSync(claudeCli, ['plugin', 'list', '--json'], { env, encoding: 'utf8' });

    // 2. Antigravity GitHub install (subpath first for multi-plugin repos, then repo root)
    const agyResults = [];
    for (const meta of metas) {
      const candidates = [
        `https://github.com/${repoSlug}/tree/main/plugins/${meta.name}`,
        `https://github.com/${repoSlug}`,
      ];
      let installedFrom = null;
      let lastErr = null;
      for (const candidate of candidates) {
        try {
          execFileSync(agyCli, ['plugin', 'install', candidate], { env, encoding: 'utf8' });
          installedFrom = candidate;
          break;
        } catch (err) {
          lastErr = err;
        }
      }
      if (!installedFrom) {
        throw new Error(`AGY GitHub install failed for ${meta.name}: ${lastErr?.message || 'unknown error'}`);
      }
      agyResults.push({ plugin: meta.name, installedFrom });
    }
    const agyList = JSON.parse(execFileSync(agyCli, ['plugin', 'list', '--json'], { env, encoding: 'utf8' }));

    // 3. Codex GitHub marketplace install
    execFileSync(codexCli, ['plugin', 'marketplace', 'add', repoSlug, '--json'], { env, encoding: 'utf8' });
    for (const meta of metas) {
      execFileSync(codexCli, ['plugin', 'add', `${meta.name}@catersoft-plugins`], { env, encoding: 'utf8' });
    }
    const codexList = JSON.parse(execFileSync(codexCli, ['plugin', 'list', '--json'], { env, encoding: 'utf8' }));

    return {
      claude: { marketplace: repoSlug, listOutput: JSON.parse(claudeList) },
      agy: { results: agyResults, listCount: Array.isArray(agyList) ? agyList.length : undefined },
      codex: {
        marketplace: repoSlug,
        listCount: Array.isArray(codexList.installed) ? codexList.installed.length : undefined,
      },
    };
  } finally {
    fs.rmSync(tmpHome, { recursive: true, force: true });
  }
}

/** Build, verify, and publish CaterSoft plugins to the official catersoft-vn GitHub org. */
export function runPublish({
  rootDir,
  dryRun = false,
  skipBuildVerify = false,
  quiet = false,
  probeFn = probeGithubTarget,
  ghCli = 'gh',
} = {}) {
  const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
  const repoSlug = parseRepoSlug(pkg.repository?.url);
  const metas = readPluginMetas(rootDir);

  if (!skipBuildVerify) {
    buildAll({ rootDir, quiet: true });
    verifyAll({ rootDir, quiet: true });
  }

  const github = probeFn(repoSlug, ghCli);
  const tagsToPush = [];
  const releaseAssets = [];

  for (const meta of metas) {
    tagsToPush.push(`${meta.name}--v${meta.version}`);
    releaseAssets.push(`dist/codex/${meta.name}-v${meta.version}.zip`);
  }

  if (dryRun) {
    const plan = {
      status: 'dry-run',
      repoSlug,
      orgExists: github.orgExists,
      orgType: github.orgType,
      repoExists: github.repoExists,
      tagsToPush,
      releaseAssets,
      remoteVerifyTargets: ['claude', 'agy', 'codex'],
    };
    if (!quiet) console.log(JSON.stringify(plan, null, 2));
    return plan;
  }

  if (!github.orgExists) {
    const msg = [
      `Organization GitHub "${github.org}" chưa tồn tại (trả về 404).`,
      `Vui lòng tạo Organization rỗng (gói Free) trên web tại:`,
      `  https://github.com/account/organizations/new?plan=free`,
      `Sau đó chạy lại "npm run publish:github" để tự động tạo repo Public, push, gắn tag, tạo Release và kiểm thử cài từ xa.`,
    ].join('\n');
    if (!quiet) console.error(msg);
    const err = new Error(msg);
    err.exitCode = 2;
    err.logged = true;
    throw err;
  }

  const dirty = execFileSync('git', ['status', '--porcelain'], { cwd: rootDir, encoding: 'utf8' }).trim();
  if (dirty) {
    throw new Error(`Working tree has uncommitted changes; commit first before publishing:\n${dirty}`);
  }

  // Ensure auth before touching GitHub
  execFileSync(ghCli, ['auth', 'status'], { encoding: 'utf8', stdio: 'pipe' });

  const expectedRemoteUrl = `https://github.com/${repoSlug}.git`;
  try {
    const currentRemote = execFileSync('git', ['remote', 'get-url', 'origin'], {
      cwd: rootDir,
      encoding: 'utf8',
    }).trim();
    if (currentRemote !== expectedRemoteUrl) {
      execFileSync('git', ['remote', 'set-url', 'origin', expectedRemoteUrl], { cwd: rootDir, encoding: 'utf8' });
    }
  } catch {
    execFileSync('git', ['remote', 'add', 'origin', expectedRemoteUrl], { cwd: rootDir, encoding: 'utf8' });
  }

  if (!github.repoExists) {
    execFileSync(
      ghCli,
      [
        'repo',
        'create',
        repoSlug,
        '--public',
        '--description',
        'Official CaterSoft AI plugins for Claude Code, Google Antigravity, and OpenAI Codex',
        '--homepage',
        'https://guide.catersoft.vn/bat-dau/tro-ly-ai-catersoft',
      ],
      { cwd: rootDir, encoding: 'utf8' },
    );
  }

  execFileSync('git', ['push', '-u', 'origin', 'main'], { cwd: rootDir, encoding: 'utf8' });

  for (const meta of metas) {
    ensureTagAtHead(rootDir, `${meta.name}--v${meta.version}`, `Release ${meta.name} v${meta.version}`);
  }
  execFileSync('git', ['push', 'origin', '--tags'], { cwd: rootDir, encoding: 'utf8' });

  const releases = [];
  for (const meta of metas) {
    const releaseTag = `${meta.name}--v${meta.version}`;
    const zipRelPath = path.join('dist', 'codex', `${meta.name}-v${meta.version}.zip`);
    const existingRelease = ghExists(['release', 'view', releaseTag, '--repo', repoSlug], ghCli);
    if (existingRelease.exists) {
      execFileSync(ghCli, ['release', 'upload', releaseTag, zipRelPath, '--repo', repoSlug, '--clobber'], {
        cwd: rootDir,
        encoding: 'utf8',
      });
    } else {
      execFileSync(
        ghCli,
        [
          'release',
          'create',
          releaseTag,
          zipRelPath,
          '--repo',
          repoSlug,
          '--title',
          `${meta.name} v${meta.version}`,
          '--notes',
          `Phát hành plugin ${meta.name} v${meta.version} (100% thao tác qua giao diện Web CaterSoft) kèm gói .zip sạch cho OpenAI Codex/ChatGPT.`,
        ],
        { cwd: rootDir, encoding: 'utf8' },
      );
    }
    releases.push({ tag: releaseTag, asset: zipRelPath });
  }

  const remoteVerify = testRemoteCliInstalls(repoSlug, metas);
  const receipt = {
    status: 'published',
    repoSlug,
    url: `https://github.com/${repoSlug}`,
    tagsPushed: tagsToPush,
    releases,
    remoteVerify,
  };
  if (!quiet) console.log(JSON.stringify(receipt, null, 2));
  return receipt;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const dryRun = process.argv.includes('--dry-run');
  try {
    runPublish({ rootDir: repoRoot, dryRun });
  } catch (err) {
    if (!err?.logged && err?.message) console.error(err.message);
    process.exitCode = typeof err?.exitCode === 'number' ? err.exitCode : 1;
  }
}
