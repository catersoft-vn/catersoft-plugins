import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const JUNK_EXACT = new Set(['.DS_Store', 'Thumbs.db', '__MACOSX']);

export const MANDATORY_RULE_CALLOUT =
  '> **Quy tắc bắt buộc (100% UI-Only & 7 Quy tắc Vàng DOM):** Trên Claude Code và Codex, luôn đọc thêm file `../cs-ui-ban-do-thuc-don-du-tru/QUY-TAC-BAT-BUOC.md` trước khi thao tác trình duyệt (Antigravity nạp sẵn qua `rules/AGENTS.md`).';

/** Return true when a filename is Drive/OS sync junk or private local artifact. */
export function isJunkName(name) {
  return (
    name.startsWith('Icon') ||
    name.includes('\r') ||
    JUNK_EXACT.has(name) ||
    name.endsWith('.local') ||
    name.includes('.local.')
  );
}

/** Remove leading YAML frontmatter so plain rule markdown complies with Antigravity. */
export function stripFrontmatter(markdown) {
  const normalized = markdown.replace(/\r\n/g, '\n');
  if (!normalized.startsWith('---\n')) return normalized;
  const endIdx = normalized.indexOf('\n---\n', 4);
  if (endIdx === -1) return normalized;
  return normalized.slice(endIdx + 5).replace(/^\n+/, '');
}

/** Insert the cross-platform UI-only rule callout below the H1 heading if missing. */
export function injectMandatoryRuleNotice(markdown, skillDirName) {
  const normalized = markdown.replace(/\r\n/g, '\n');
  if (skillDirName === 'cs-ui-ban-do-thuc-don-du-tru') return normalized;
  if (normalized.includes('QUY-TAC-BAT-BUOC.md')) return normalized;

  const lines = normalized.split('\n');
  const h1Index = lines.findIndex((line) => line.startsWith('# '));
  if (h1Index === -1) {
    return `${MANDATORY_RULE_CALLOUT}\n\n${normalized}`;
  }

  lines.splice(h1Index + 1, 0, '', MANDATORY_RULE_CALLOUT);
  return lines.join('\n');
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function removeIfExists(targetPath) {
  fs.rmSync(targetPath, { recursive: true, force: true });
}

/** Copy clean plugin assets/rules/skills (dereferencing symlinks and stripping junk). */
export function copyCleanTree(srcDir, dstDir, options = {}) {
  const { stripRulesFrontmatter = true, injectRuleNoticeInSkills = true } = options;
  if (!fs.existsSync(srcDir)) return;
  fs.mkdirSync(dstDir, { recursive: true });

  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    if (isJunkName(entry.name)) continue;
    const srcPath = path.join(srcDir, entry.name);
    const dstPath = path.join(dstDir, entry.name);
    const realStat = fs.statSync(srcPath);

    if (realStat.isDirectory()) {
      copyCleanTree(srcPath, dstPath, options);
      continue;
    }

    if (!realStat.isFile()) continue;

    if (entry.name.endsWith('.md') || entry.name.endsWith('.svg')) {
      let text = fs.readFileSync(srcPath, 'utf8').replace(/\r\n/g, '\n');
      const normalizedSrc = srcPath.split(path.sep).join('/');
      if (
        stripRulesFrontmatter &&
        (normalizedSrc.includes('/rules/') || entry.name === 'QUY-TAC-BAT-BUOC.md')
      ) {
        text = stripFrontmatter(text);
      }
      if (injectRuleNoticeInSkills && entry.name === 'SKILL.md') {
        const skillDirName = path.basename(path.dirname(srcPath));
        text = injectMandatoryRuleNotice(text, skillDirName);
      }
      fs.writeFileSync(dstPath, text, 'utf8');
    } else {
      fs.copyFileSync(srcPath, dstPath);
    }
  }
}

/** Build the three platform-compliant manifests from one canonical plugin.meta.json. */
export function buildManifests(meta) {
  const agyPrompts = (meta.agySuggestedPrompts || []).slice(0, 3);
  const agyManifest = {
    name: meta.name,
    displayName: meta.displayName,
    version: meta.version,
    description: meta.description,
    author: meta.author,
    homepage: meta.homepage,
    repository: meta.repository,
    logo: meta.logo,
    suggestedPrompts: agyPrompts,
  };

  const claudeManifest = {
    name: meta.name,
    version: meta.version,
    description: meta.description,
    author: meta.author,
    homepage: meta.homepage,
    repository: meta.repository,
    license: meta.license || 'MIT',
    keywords: meta.keywords || [],
  };

  const codexManifest = {
    name: meta.name,
    version: meta.version,
    description: meta.description,
    author: meta.author,
    homepage: meta.homepage,
    repository: meta.repository,
    license: meta.license || 'MIT',
    keywords: meta.keywords || [],
    skills: './skills/',
    interface: {
      displayName: meta.displayName,
      shortDescription: meta.shortDescription,
      longDescription: meta.description,
      developerName: meta.author?.name || 'CaterSoft',
      category: meta.codexCategory || 'Productivity',
      capabilities: ['Interactive', 'Read', 'Write'],
      websiteURL: meta.homepage,
      privacyPolicyURL: 'https://www.catersoft.vn',
      termsOfServiceURL: 'https://www.catersoft.vn',
      defaultPrompt: meta.codexDefaultPrompts || agyPrompts,
      brandColor: meta.brandColor || '#1677FF',
      composerIcon: `./${meta.logo}`,
      logo: `./${meta.logo}`,
    },
  };

  return { agyManifest, claudeManifest, codexManifest };
}

function buildClaudeMarketplaceCatalog(metas, sourcePrefix) {
  return {
    $schema: 'https://anthropic.com/claude-code/marketplace.schema.json',
    name: 'catersoft-plugins',
    description:
      'Marketplace chính thức của CaterSoft cung cấp các bộ kỹ năng AI thao tác phần mềm qua giao diện Web (UI-only).',
    owner: {
      name: 'CaterSoft',
      url: 'https://guide.catersoft.vn',
    },
    plugins: metas.map((meta) => ({
      name: meta.name,
      description: meta.description,
      version: meta.version,
      author: meta.author,
      homepage: meta.homepage,
      repository: meta.repository,
      license: meta.license || 'MIT',
      keywords: meta.keywords || [],
      category: meta.claudeCategory || 'productivity',
      source: `${sourcePrefix}/${meta.name}`,
    })),
  };
}

function buildCodexMarketplaceCatalog(metas, pathPrefix) {
  return {
    name: 'catersoft-plugins',
    interface: {
      displayName: 'CaterSoft Plugins',
    },
    plugins: metas.map((meta) => ({
      name: meta.name,
      source: {
        source: 'local',
        path: `${pathPrefix}/${meta.name}`,
      },
      policy: {
        installation: 'AVAILABLE',
        authentication: 'ON_INSTALL',
      },
      category: meta.codexCategory || 'Productivity',
    })),
  };
}

function copyCommonPluginContent(srcPluginDir, dstPluginDir, { includeRules = true } = {}) {
  fs.mkdirSync(dstPluginDir, { recursive: true });
  const readmeSrc = path.join(srcPluginDir, 'README.md');
  if (fs.existsSync(readmeSrc)) {
    fs.writeFileSync(
      path.join(dstPluginDir, 'README.md'),
      fs.readFileSync(readmeSrc, 'utf8').replace(/\r\n/g, '\n'),
      'utf8',
    );
  }
  copyCleanTree(path.join(srcPluginDir, 'assets'), path.join(dstPluginDir, 'assets'));
  copyCleanTree(path.join(srcPluginDir, 'skills'), path.join(dstPluginDir, 'skills'));
  if (includeRules) {
    copyCleanTree(path.join(srcPluginDir, 'rules'), path.join(dstPluginDir, 'rules'));
  }
}

/** Build combined GitHub marketplace tree and isolated dist/ targets for all plugins in src/. */
export function buildAll({ rootDir, quiet = false, skipZip = false } = {}) {
  const srcRoot = path.join(rootDir, 'src');
  const pluginsOutRoot = path.join(rootDir, 'plugins');
  const claudeRootMetaDir = path.join(rootDir, '.claude-plugin');
  const codexRootMetaDir = path.join(rootDir, '.agents');
  const distRoot = path.join(rootDir, 'dist');

  removeIfExists(pluginsOutRoot);
  removeIfExists(claudeRootMetaDir);
  removeIfExists(codexRootMetaDir);
  removeIfExists(distRoot);

  const pluginDirs = fs
    .readdirSync(srcRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(srcRoot, entry.name, 'plugin.meta.json')))
    .map((entry) => entry.name)
    .sort();

  if (pluginDirs.length === 0) {
    throw new Error(`No plugins with plugin.meta.json found in ${srcRoot}`);
  }

  const metas = [];

  for (const dirName of pluginDirs) {
    const srcPluginDir = path.join(srcRoot, dirName);
    const meta = JSON.parse(fs.readFileSync(path.join(srcPluginDir, 'plugin.meta.json'), 'utf8'));
    metas.push(meta);

    const { agyManifest, claudeManifest, codexManifest } = buildManifests(meta);

    // 1. Unified repo plugin bundle under plugins/<name>/ for GitHub Marketplace install across all 3 platforms
    const repoPluginDir = path.join(pluginsOutRoot, meta.name);
    copyCommonPluginContent(srcPluginDir, repoPluginDir, { includeRules: true });
    writeJson(path.join(repoPluginDir, 'plugin.json'), agyManifest);
    writeJson(path.join(repoPluginDir, '.claude-plugin', 'plugin.json'), claudeManifest);
    writeJson(path.join(repoPluginDir, '.codex-plugin', 'plugin.json'), codexManifest);

    // 2. Standalone dist/claude target
    const distClaudePluginDir = path.join(distRoot, 'claude', 'plugins', meta.name);
    copyCommonPluginContent(srcPluginDir, distClaudePluginDir, { includeRules: false });
    writeJson(path.join(distClaudePluginDir, '.claude-plugin', 'plugin.json'), claudeManifest);

    // 3. Standalone dist/agy target
    const distAgyPluginDir = path.join(distRoot, 'agy', meta.name);
    copyCommonPluginContent(srcPluginDir, distAgyPluginDir, { includeRules: true });
    writeJson(path.join(distAgyPluginDir, 'plugin.json'), agyManifest);

    // 4. Standalone dist/codex portal archive directory & GitHub-style marketplace snapshot
    const distCodexPluginDir = path.join(distRoot, 'codex', meta.name);
    copyCommonPluginContent(srcPluginDir, distCodexPluginDir, { includeRules: false });
    writeJson(path.join(distCodexPluginDir, '.codex-plugin', 'plugin.json'), codexManifest);
    writeJson(path.join(distCodexPluginDir, 'plugin.json'), codexManifest);

    if (!skipZip) {
      const zipName = `${meta.name}-v${meta.version}.zip`;
      const zipOutPath = path.join(distRoot, 'codex', zipName);
      execFileSync('/usr/bin/zip', ['-r', '-X', '-q', zipOutPath, '.'], {
        cwd: distCodexPluginDir,
      });
    }
  }

  writeJson(
    path.join(claudeRootMetaDir, 'marketplace.json'),
    buildClaudeMarketplaceCatalog(metas, './plugins'),
  );
  writeJson(
    path.join(distRoot, 'claude', '.claude-plugin', 'marketplace.json'),
    buildClaudeMarketplaceCatalog(metas, './plugins'),
  );
  writeJson(
    path.join(codexRootMetaDir, 'plugins', 'marketplace.json'),
    buildCodexMarketplaceCatalog(metas, './plugins'),
  );

  if (!quiet) {
    console.log(
      JSON.stringify(
        {
          status: 'ok',
          plugins: metas.map((m) => `${m.name}@${m.version}`),
          outputs: ['plugins/', '.claude-plugin/', '.agents/', 'dist/claude/', 'dist/agy/', 'dist/codex/'],
        },
        null,
        2,
      ),
    );
  }

  return { metas };
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  buildAll({ rootDir: repoRoot });
}
