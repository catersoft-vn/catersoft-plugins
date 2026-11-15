import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isJunkName } from './build-plugins.mjs';

const BASE_SENSITIVE_PATTERNS = [
  { label: 'local home path', regex: /\/Users\// },
  { label: 'internal port', regex: /:(3029|3129|3229|3929)\b/ },
  { label: 'automation email', regex: /automation@/i },
  { label: 'github token', regex: /gho_/ },
  { label: 'google api key', regex: /AIza/ },
  { label: 'openai/anthropic api key', regex: /\bsk-/ },
];

function loadSensitivePatterns(rootDir) {
  const patterns = [...BASE_SENSITIVE_PATTERNS];
  const localBlocklistPath = path.join(rootDir, 'scripts', 'verify-blocklist.local.json');
  if (fs.existsSync(localBlocklistPath)) {
    const raw = JSON.parse(fs.readFileSync(localBlocklistPath, 'utf8'));
    for (const item of raw.extraPatterns || []) {
      patterns.push({
        label: item.label,
        regex: new RegExp(item.pattern, item.flags || ''),
      });
    }
  }
  return patterns;
}

function resolveCli(candidates, fallbackCmd) {
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }
  try {
    return execFileSync('which', [fallbackCmd], { encoding: 'utf8' }).trim();
  } catch {
    throw new Error(`Required CLI not found: ${fallbackCmd} (checked ${candidates.join(', ')})`);
  }
}

function scanTreeForJunkAndSecrets(rootDir, relativeRoots, sensitivePatterns) {
  const errors = [];
  const checkedFiles = [];

  function walk(absDir) {
    if (!fs.existsSync(absDir)) return;
    for (const entry of fs.readdirSync(absDir, { withFileTypes: true })) {
      const absPath = path.join(absDir, entry.name);
      const relPath = path.relative(rootDir, absPath);

      if (relPath === path.join('scripts', 'verify-blocklist.local.json')) {
        continue;
      }

      if (isJunkName(entry.name)) {
        errors.push(`Forbidden junk file/dir found: ${relPath}`);
        continue;
      }

      if (entry.isSymbolicLink()) {
        errors.push(`Unexpected symlink inside distributable tree: ${relPath}`);
        continue;
      }

      if (entry.isDirectory()) {
        walk(absPath);
        continue;
      }

      if (!entry.isFile()) continue;
      checkedFiles.push(relPath);

      const content = fs.readFileSync(absPath, 'utf8');
      for (const { label, regex } of sensitivePatterns) {
        if (regex.test(content)) {
          errors.push(`Sensitive pattern (${label}) matched in ${relPath}`);
        }
      }
    }
  }

  for (const rel of relativeRoots) {
    const absTarget = path.join(rootDir, rel);
    if (fs.existsSync(absTarget) && fs.statSync(absTarget).isFile()) {
      checkedFiles.push(rel);
      const content = fs.readFileSync(absTarget, 'utf8');
      for (const { label, regex } of sensitivePatterns) {
        if (regex.test(content)) {
          errors.push(`Sensitive pattern (${label}) matched in ${rel}`);
        }
      }
    } else {
      walk(absTarget);
    }
  }

  return { errors, checkedFiles };
}

function scanZipContents(zipPath) {
  const raw = execFileSync('/usr/bin/unzip', ['-Z1', zipPath], { encoding: 'utf8' });
  const entries = raw.split('\n').filter(Boolean);
  const bad = entries.filter((entry) => {
    const base = path.basename(entry.replace(/\/$/, ''));
    return isJunkName(base) || entry.includes('__MACOSX');
  });
  if (bad.length > 0) {
    throw new Error(`Archive ${zipPath} contains forbidden junk entries: ${bad.join(', ')}`);
  }
  return entries;
}

/** Run full junk/secret scan plus Claude, Antigravity, and Codex CLI validation. */
export function verifyAll({ rootDir, quiet = false } = {}) {
  const sensitivePatterns = loadSensitivePatterns(rootDir);
  const { errors, checkedFiles } = scanTreeForJunkAndSecrets(
    rootDir,
    [
      'src',
      'plugins',
      'scripts/build-plugins.mjs',
      'scripts/build-plugins.test.mjs',
      'README.md',
      'package.json',
      '.claude-plugin',
      '.agents',
      'dist/claude',
      'dist/agy',
      'dist/codex',
    ],
    sensitivePatterns,
  );
  if (errors.length > 0) {
    throw new Error(`Security/hygiene scan failed:\n- ${errors.join('\n- ')}`);
  }

  const pluginDirs = fs
    .readdirSync(path.join(rootDir, 'src'), { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(rootDir, 'src', entry.name, 'plugin.meta.json')))
    .map((entry) => entry.name)
    .sort();

  const claudeCli = resolveCli(
    [path.join(os.homedir(), '.local/bin/claude'), '/opt/homebrew/bin/claude', '/usr/local/bin/claude'],
    'claude',
  );
  const agyCli = resolveCli(
    ['/Applications/Gemini.app/Contents/Helpers/agy', '/opt/homebrew/bin/agy', '/usr/local/bin/agy'],
    'agy',
  );
  const codexCli = resolveCli(
    [
      '/Applications/ChatGPT.app/Contents/Resources/codex-cli/bin/codex',
      '/opt/homebrew/bin/codex',
      '/usr/local/bin/codex',
    ],
    'codex',
  );

  const report = {
    status: 'ok',
    scannedFiles: checkedFiles.length,
    claude: [],
    agy: [],
    codex: {},
    zips: {},
  };

  // 1. Claude strict validations (root marketplace + plugin + dist/claude)
  const claudeTargets = [
    { label: 'repo-marketplace', target: '.', expected: 'Validating marketplace manifest' },
    { label: 'dist-claude-marketplace', target: './dist/claude', expected: 'Validating marketplace manifest' },
    ...pluginDirs.flatMap((name) => [
      { label: `repo-plugin:${name}`, target: `./plugins/${name}`, expected: 'Validating plugin manifest' },
      { label: `dist-claude-plugin:${name}`, target: `./dist/claude/plugins/${name}`, expected: 'Validating plugin manifest' },
    ]),
  ];

  for (const item of claudeTargets) {
    const out = execFileSync(claudeCli, ['plugin', 'validate', '--strict', item.target], {
      cwd: rootDir,
      encoding: 'utf8',
    });
    const compact = out.replace(/\s+/g, ' ').trim();
    if (!compact.includes(item.expected.replace(/\s+/g, '')) && !out.includes('Validation') && !compact.includes('Validationpassed')) {
      throw new Error(`Unexpected Claude validate output for ${item.target}: ${out}`);
    }
    report.claude.push({ label: item.label, passed: true });
  }

  // 2. Antigravity strict validations (repo plugin + dist/agy)
  for (const name of pluginDirs) {
    for (const [label, target] of [
      [`repo-plugin:${name}`, `./plugins/${name}`],
      [`dist-agy:${name}`, `./dist/agy/${name}`],
    ]) {
      const out = execFileSync(agyCli, ['plugin', 'validate', '--strict', '--json', target], {
        cwd: rootDir,
        encoding: 'utf8',
      });
      const parsed = JSON.parse(out);
      if (!Array.isArray(parsed.findings) || parsed.findings.length > 0) {
        throw new Error(`AGY strict validation findings for ${target}: ${out}`);
      }
      report.agy.push({
        label,
        skills: parsed.components?.skills ?? 0,
        rules: parsed.components?.rules ?? 0,
        findings: parsed.findings.length,
      });
    }
  }

  // 3. Codex zip clean verification + isolated marketplace add/install/list verification
  for (const name of pluginDirs) {
    const meta = JSON.parse(fs.readFileSync(path.join(rootDir, 'src', name, 'plugin.meta.json'), 'utf8'));
    const zipPath = path.join(rootDir, 'dist', 'codex', `${meta.name}-v${meta.version}.zip`);
    if (!fs.existsSync(zipPath)) {
      throw new Error(`Missing Codex zip archive: ${zipPath}`);
    }
    const entries = scanZipContents(zipPath);
    for (const required of ['plugin.json', '.codex-plugin/plugin.json', 'assets/logo.svg', 'README.md']) {
      if (!entries.includes(required)) {
        throw new Error(`Archive ${zipPath} missing required entry: ${required}`);
      }
    }
    report.zips[name] = { file: path.basename(zipPath), entriesCount: entries.length };
  }

  const tmpHome = fs.mkdtempSync(path.join(os.tmpdir(), 'cs-codex-verify-'));
  const tmpCodexHome = path.join(tmpHome, '.codex');
  fs.mkdirSync(tmpCodexHome, { recursive: true });
  try {
    const isolatedEnv = { ...process.env, HOME: tmpHome, CODEX_HOME: tmpCodexHome };
    const addMpRaw = execFileSync(codexCli, ['plugin', 'marketplace', 'add', rootDir, '--json'], {
      env: isolatedEnv,
      encoding: 'utf8',
    });
    const addMp = JSON.parse(addMpRaw);
    if (addMp.marketplaceName !== 'catersoft-plugins') {
      throw new Error(`Unexpected Codex marketplaceName: ${addMpRaw}`);
    }

    const installed = [];
    for (const name of pluginDirs) {
      const addPluginOut = execFileSync(codexCli, ['plugin', 'add', `${name}@catersoft-plugins`], {
        env: isolatedEnv,
        encoding: 'utf8',
      });
      if (!addPluginOut.includes(`Added plugin \`${name}\``)) {
        throw new Error(`Unexpected Codex plugin add output: ${addPluginOut}`);
      }
      installed.push(name);
    }

    const listOut = execFileSync(codexCli, ['plugin', 'list', '--json'], {
      env: isolatedEnv,
      encoding: 'utf8',
    });
    const listJson = JSON.parse(listOut);
    report.codex = {
      marketplaceName: addMp.marketplaceName,
      installed,
      listCount: Array.isArray(listJson.installed) ? listJson.installed.length : undefined,
    };
  } finally {
    fs.rmSync(tmpHome, { recursive: true, force: true });
  }

  if (!quiet) {
    console.log(JSON.stringify(report, null, 2));
  }
  return report;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  verifyAll({ rootDir: repoRoot });
}
