import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isJunkName } from './build-plugins.mjs';

const BASE_SENSITIVE_PATTERNS = [
  { label: 'local home path', regex: /\/Users\// },
  { label: 'internal port', regex: /:(3029|3129|3229|3929)\b/ },
  { label: 'localhost url', regex: /\b(localhost|127\.0\.0\.1):\d+/ },
  { label: 'firebase url', regex: /(firebaseio\.com|firebasestorage\.googleapis\.com)/i },
  { label: 'automation email', regex: /automation@/i },
  { label: 'github token', regex: /gho_/ },
  { label: 'google api key', regex: /AIza/ },
  { label: 'openai/anthropic api key', regex: /\bsk-/ },
];

const OPENAI_ALLOWED_CATEGORIES = new Set([
  'Productivity',
  'Creativity',
  'Developer Tools',
  'Business & Operations',
  'Data & Analytics',
  'Communication',
  'Education & Research',
  'Security',
  'Finance',
  'Healthcare',
  'Travel',
  'Entertainment',
  'Other',
]);

function srgbChannelToLinear(value) {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function relativeLuminance(hex) {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return (
    0.2126 * srgbChannelToLinear(r) +
    0.7152 * srgbChannelToLinear(g) +
    0.0722 * srgbChannelToLinear(b)
  );
}

export function contrastRatio(hexA, hexB) {
  const l1 = relativeLuminance(hexA);
  const l2 = relativeLuminance(hexB);
  const [bright, dark] = l1 >= l2 ? [l1, l2] : [l2, l1];
  return (bright + 0.05) / (dark + 0.05);
}

function parseSkillFrontmatter(raw) {
  const normalized = raw.replace(/\r\n/g, '\n');
  if (!normalized.startsWith('---\n')) {
    throw new Error('SKILL.md missing opening --- frontmatter fence');
  }
  const endIdx = normalized.indexOf('\n---\n', 4);
  if (endIdx === -1) {
    throw new Error('SKILL.md missing closing --- frontmatter fence');
  }
  const fmText = normalized.slice(4, endIdx);
  const body = normalized.slice(endIdx + 5).trim();
  if (!body) throw new Error('SKILL.md body must not be empty');
  const map = {};
  const lines = fmText.split('\n');
  let activeKey = null;
  let blockLines = [];

  const flushActive = () => {
    if (!activeKey) return;
    const joined = blockLines.map((s) => s.trim()).filter(Boolean).join(' ');
    map[activeKey] = joined.replace(/^["']|["']$/g, '');
    activeKey = null;
    blockLines = [];
  };

  for (const line of lines) {
    if (activeKey && (/^\s+/.test(line) || line.trim() === '')) {
      blockLines.push(line);
      continue;
    }
    flushActive();
    const m = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (m) {
      const key = m[1];
      const val = m[2].trim();
      if (val === '>-' || val === '>' || val === '|-' || val === '|' || val === '') {
        activeKey = key;
        blockLines = [];
      } else {
        map[key] = val.replace(/^["']|["']$/g, '');
      }
    }
  }
  flushActive();
  return map;
}

/** Validate built dist/codex plugin against OpenAI Portal submission-errors rules. */
export function validateOpenAiSubmissionRules(pluginDir, codexManifest, zipEntries = []) {
  const issues = [];
  const checkSingleLine = (value, maxLen, fieldName) => {
    if (typeof value !== 'string' || !value.trim()) {
      issues.push(`${fieldName} is required and must be non-empty`);
      return;
    }
    if (/[\r\n]/.test(value)) {
      issues.push(`${fieldName} must fit on one line`);
    }
    if (value.length > maxLen) {
      issues.push(`${fieldName} length ${value.length} exceeds ${maxLen}`);
    }
  };

  if (typeof codexManifest.name !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(codexManifest.name)) {
    issues.push(`Invalid plugin name: ${codexManifest.name}`);
  }
  if (typeof codexManifest.version !== 'string' || !/^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/.test(codexManifest.version)) {
    issues.push(`Invalid semver version: ${codexManifest.version}`);
  }
  if (typeof codexManifest.description !== 'string' || !codexManifest.description.trim() || codexManifest.description.length > 1024) {
    issues.push('description must be 1..1024 chars');
  }
  checkSingleLine(codexManifest.author?.name, 120, 'author.name');
  if (codexManifest.author?.email !== undefined) {
    checkSingleLine(codexManifest.author.email, 320, 'author.email');
  }

  const iface = codexManifest.interface || {};
  checkSingleLine(iface.displayName, 30, 'interface.displayName');
  checkSingleLine(iface.shortDescription, 30, 'interface.shortDescription');
  checkSingleLine(iface.developerName, 80, 'interface.developerName');
  if (typeof iface.longDescription !== 'string' || !iface.longDescription.trim() || iface.longDescription.length > 4000) {
    issues.push('interface.longDescription must be 1..4000 chars');
  }
  if (!OPENAI_ALLOWED_CATEGORIES.has(iface.category)) {
    issues.push(`Unsupported interface.category: ${iface.category}`);
  }

  for (const urlField of ['websiteURL', 'supportURL', 'privacyPolicyURL', 'termsOfServiceURL']) {
    const val = iface[urlField];
    if (typeof val !== 'string' || !val.startsWith('https://') || val.length > 1024) {
      issues.push(`interface.${urlField} must be HTTPS <= 1024 chars`);
    }
  }

  const prompts = iface.defaultPrompt;
  if (!Array.isArray(prompts) || prompts.length === 0 || prompts.length > 3) {
    issues.push('interface.defaultPrompt must have 1..3 entries');
  } else {
    const seen = new Set();
    for (let i = 0; i < prompts.length; i += 1) {
      const p = prompts[i];
      checkSingleLine(p, 128, `interface.defaultPrompt[${i}]`);
      if (typeof p === 'string' && p.includes('@')) {
        issues.push(`interface.defaultPrompt[${i}] must not contain @`);
      }
      const norm = String(p || '')
        .normalize('NFKC')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();
      if (seen.has(norm)) {
        issues.push(`interface.defaultPrompt[${i}] duplicates another prompt`);
      }
      seen.add(norm);
    }
  }

  if (!/^#[0-9A-Fa-f]{6}$/.test(iface.brandColor || '')) {
    issues.push(`interface.brandColor invalid hex: ${iface.brandColor}`);
  } else if (contrastRatio(iface.brandColor, '#FFFFFF') < 2.0) {
    issues.push(`interface.brandColor ${iface.brandColor} has <2:1 contrast against #FFFFFF`);
  }

  if (!/^#[0-9A-Fa-f]{6}$/.test(iface.brandColorDark || '')) {
    issues.push(`interface.brandColorDark invalid hex: ${iface.brandColorDark}`);
  } else if (contrastRatio(iface.brandColorDark, '#212121') < 2.0) {
    issues.push(`interface.brandColorDark ${iface.brandColorDark} has <2:1 contrast against #212121`);
  }

  for (const assetField of ['logo', 'composerIcon']) {
    const assetRel = iface[assetField];
    if (typeof assetRel !== 'string' || !assetRel.startsWith('./') || assetRel.includes('..')) {
      issues.push(`interface.${assetField} must start with ./ and stay within plugin`);
      continue;
    }
    const assetAbs = path.join(pluginDir, assetRel.slice(2));
    if (!fs.existsSync(assetAbs) || !fs.statSync(assetAbs).isFile()) {
      issues.push(`interface.${assetField} missing file: ${assetRel}`);
    } else if (assetRel.endsWith('.svg')) {
      const svg = fs.readFileSync(assetAbs, 'utf8');
      const vb = svg.match(/viewBox=["']\s*[-0-9.]+\s+[-0-9.]+\s+([0-9.]+)\s+([0-9.]+)\s*["']/i);
      if (!vb) {
        issues.push(`SVG ${assetRel} missing numeric viewBox`);
      } else {
        const w = Number(vb[1]);
        const h = Number(vb[2]);
        if (!Number.isFinite(w) || w <= 0 || w !== h || w < 48) {
          issues.push(`SVG ${assetRel} must be square and >= 48x48 (got ${w}x${h})`);
        }
      }
    }
  }

  const openaiExt = codexManifest.extensions?.['com.openai'];
  if (!openaiExt || typeof openaiExt !== 'object') {
    issues.push('extensions["com.openai"] is required');
  } else {
    const ob = openaiExt.onboardingSkill;
    if (typeof ob !== 'string' || !ob.startsWith('./skills/') || !ob.endsWith('/SKILL.md')) {
      issues.push(`onboardingSkill invalid: ${ob}`);
    } else if (!fs.existsSync(path.join(pluginDir, ob.slice(2)))) {
      issues.push(`onboardingSkill file missing: ${ob}`);
    }
    const vi = openaiExt.publication?.translations?.['vi-VN'];
    if (!vi?.subtitle || !vi?.description) {
      issues.push('extensions["com.openai"].publication.translations["vi-VN"] requires subtitle and description');
    } else {
      checkSingleLine(vi.subtitle, 30, 'translations.vi-VN.subtitle');
    }
  }

  const skillsDir = path.join(pluginDir, 'skills');
  const seenSkills = new Set();
  if (!fs.existsSync(skillsDir)) {
    issues.push('skills/ directory missing');
  } else {
    for (const entry of fs.readdirSync(skillsDir, { withFileTypes: true })) {
      if (entry.name.startsWith('.')) {
        issues.push(`Hidden skill directory forbidden: ${entry.name}`);
        continue;
      }
      if (!entry.isDirectory()) {
        issues.push(`Non-directory entry inside skills/: ${entry.name}`);
        continue;
      }
      const skillMd = path.join(skillsDir, entry.name, 'SKILL.md');
      if (!fs.existsSync(skillMd)) {
        issues.push(`Skill ${entry.name} missing SKILL.md`);
        continue;
      }
      try {
        const fm = parseSkillFrontmatter(fs.readFileSync(skillMd, 'utf8'));
        if (!fm.name) issues.push(`Skill ${entry.name} frontmatter missing name`);
        if (!fm.description || fm.description.length > 1024) {
          issues.push(`Skill ${entry.name} description missing or > 1024 chars`);
        }
        if (fm.name) {
          const identity = `${codexManifest.name}:${fm.name}`;
          if (identity.length > 64) {
            issues.push(`skill_identity_too_long (${identity.length} > 64): ${identity}`);
          }
          if (seenSkills.has(fm.name)) {
            issues.push(`skill_identity_duplicate: ${fm.name}`);
          }
          seenSkills.add(fm.name);
        }
      } catch (err) {
        issues.push(`Skill ${entry.name}: ${err.message}`);
      }
    }
  }

  if (zipEntries.includes('plugin.json')) {
    issues.push('Conflicting root plugin.json must NOT appear in Codex zip alongside .codex-plugin/plugin.json');
  }
  for (const entry of zipEntries) {
    if (entry.startsWith('./') || entry.includes('\\') || entry.includes('..')) {
      issues.push(`Unsafe/invalid zip member path: ${entry}`);
    }
  }

  if (issues.length > 0) {
    throw new Error(`OpenAI submission validation failed for ${codexManifest.name}:\n- ${issues.join('\n- ')}`);
  }
}

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

/** Resolve local CLI binaries for Claude Code, Antigravity (AGY), and OpenAI Codex. */
export function resolveDefaultClis() {
  return {
    claudeCli: resolveCli(
      [path.join(os.homedir(), '.local/bin/claude'), '/opt/homebrew/bin/claude', '/usr/local/bin/claude'],
      'claude',
    ),
    agyCli: resolveCli(
      ['/Applications/Gemini.app/Contents/Helpers/agy', '/opt/homebrew/bin/agy', '/usr/local/bin/agy'],
      'agy',
    ),
    codexCli: resolveCli(
      [
        '/Applications/ChatGPT.app/Contents/Resources/codex-cli/bin/codex',
        '/opt/homebrew/bin/codex',
        '/usr/local/bin/codex',
      ],
      'codex',
    ),
  };
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
      'scripts/publish-github.mjs',
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

  const { claudeCli, agyCli, codexCli } = resolveDefaultClis();

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

  // 3. Codex zip clean verification + OpenAI submission linter + isolated marketplace add/install/list verification
  for (const name of pluginDirs) {
    const meta = JSON.parse(fs.readFileSync(path.join(rootDir, 'src', name, 'plugin.meta.json'), 'utf8'));
    const codexPluginDir = path.join(rootDir, 'dist', 'codex', meta.name);
    const codexManifest = JSON.parse(
      fs.readFileSync(path.join(codexPluginDir, '.codex-plugin', 'plugin.json'), 'utf8'),
    );
    const zipPath = path.join(rootDir, 'dist', 'codex', `${meta.name}-v${meta.version}.zip`);
    if (!fs.existsSync(zipPath)) {
      throw new Error(`Missing Codex zip archive: ${zipPath}`);
    }
    const entries = scanZipContents(zipPath);
    for (const required of ['.codex-plugin/plugin.json', 'assets/logo.svg', 'README.md']) {
      if (!entries.includes(required)) {
        throw new Error(`Archive ${zipPath} missing required entry: ${required}`);
      }
    }
    validateOpenAiSubmissionRules(codexPluginDir, codexManifest, entries);
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
