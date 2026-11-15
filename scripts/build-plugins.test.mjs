import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import {
  MANDATORY_RULE_CALLOUT,
  buildAll,
  buildMandatoryRuleCallout,
  buildManifests,
  buildMcpConfigs,
  copyCleanTree,
  injectMandatoryRuleNotice,
  isJunkName,
  stripFrontmatter,
} from './build-plugins.mjs';
import { parseRepoSlug, runPublish } from './publish-github.mjs';
import { contrastRatio, validateOpenAiSubmissionRules } from './verify-plugins.mjs';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const EXPECTED_PLUGINS = [
  { name: 'catersoft', version: '1.0.0', mapSkill: 'cs-ui-ban-do-thuc-don-du-tru', leafCount: 5 },
];

test('isJunkName catches Drive Icon\\r, macOS .DS_Store, and local files', () => {
  assert.equal(isJunkName('.DS_Store'), true);
  assert.equal(isJunkName('Icon\r'), true);
  assert.equal(isJunkName('Icon?'), true);
  assert.equal(isJunkName('__MACOSX'), true);
  assert.equal(isJunkName('verify-blocklist.local.json'), true);
  assert.equal(isJunkName('SKILL.md'), false);
});

test('stripFrontmatter removes YAML trigger header cleanly', () => {
  const input = '---\ntrigger: always_on\n---\n\n# Heading\nBody';
  assert.equal(stripFrontmatter(input), '# Heading\nBody');
  assert.equal(stripFrontmatter('# Plain Heading\nBody'), '# Plain Heading\nBody');
});

test('injectMandatoryRuleNotice inserts dynamic callout for non-map skills only once', () => {
  const leaf = '# Leaf Skill\n\nContent';
  const injected = injectMandatoryRuleNotice(leaf, 'cs-ui-ncc-bang-gia-khu-vuc', 'cs-ui-ban-do-mua-hang-kho');
  const expectedCallout = buildMandatoryRuleCallout('cs-ui-ban-do-mua-hang-kho');
  assert.ok(injected.includes(expectedCallout));
  assert.equal(
    injectMandatoryRuleNotice(injected, 'cs-ui-ncc-bang-gia-khu-vuc', 'cs-ui-ban-do-mua-hang-kho'),
    injected,
  );
  assert.equal(
    injectMandatoryRuleNotice('# Map Skill', 'cs-ui-ban-do-mua-hang-kho', 'cs-ui-ban-do-mua-hang-kho'),
    '# Map Skill',
  );
  assert.ok(MANDATORY_RULE_CALLOUT.includes('cs-ui-ban-do-thuc-don-du-tru/QUY-TAC-BAT-BUOC.md'));
});

test('buildManifests enforces AGY <= 3 prompts, Codex <= 30-char portal limits, OpenAI extension block, and MCP server config pointers', () => {
  const meta = JSON.parse(
    fs.readFileSync(path.join(REPO_ROOT, 'src', 'catersoft', 'plugin.meta.json'), 'utf8'),
  );
  const { agyManifest, claudeManifest, codexManifest } = buildManifests(meta);
  const mcpConfigs = buildMcpConfigs(meta);

  assert.equal(agyManifest.suggestedPrompts.length, 3);
  assert.equal('keywords' in agyManifest, false);
  assert.equal(claudeManifest.name, 'catersoft');
  assert.equal(claudeManifest.privacyPolicyUrl, 'https://www.catersoft.vn');
  assert.deepEqual(claudeManifest.mcpServers, {
    catersoft: { type: 'http', url: 'https://catersoft.app/mcp' },
  });
  assert.equal(codexManifest.skills, './skills/');
  assert.equal(codexManifest.mcpServers, './.codex-plugin/mcp.json');
  assert.equal(mcpConfigs?.agyMcpConfig.mcpServers.catersoft.serverUrl, 'https://catersoft.app/mcp');
  assert.equal(mcpConfigs?.standardMcpConfig.mcpServers.catersoft.type, 'http');
  assert.equal(mcpConfigs?.standardMcpConfig.mcpServers.catersoft.url, 'https://catersoft.app/mcp');
  assert.ok(codexManifest.interface.displayName.length <= 30);
  assert.ok(codexManifest.interface.shortDescription.length <= 30);
  assert.equal(codexManifest.interface.defaultPrompt.length, 3);
  assert.ok(codexManifest.interface.brandColorDark.startsWith('#'));
  assert.ok(contrastRatio(codexManifest.interface.brandColor, '#FFFFFF') >= 2.0);
  assert.ok(contrastRatio(codexManifest.interface.brandColorDark, '#212121') >= 2.0);
  assert.equal(
    codexManifest.extensions['com.openai'].onboardingSkill,
    './skills/cs-ui-ban-do-thuc-don-du-tru/SKILL.md',
  );
  assert.ok(codexManifest.extensions['com.openai'].publication.translations['vi-VN'].subtitle.length <= 30);
});

test('copyCleanTree dereferences symlinks and filters Icon\\r / .DS_Store', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cs-clean-tree-'));
  try {
    const src = path.join(tmpDir, 'src');
    const dst = path.join(tmpDir, 'dst');
    fs.mkdirSync(path.join(src, 'skills', 'leaf'), { recursive: true });
    fs.writeFileSync(path.join(tmpDir, 'real.md'), '# Target Rule\nText', 'utf8');
    fs.symlinkSync(path.join(tmpDir, 'real.md'), path.join(src, 'skills', 'leaf', 'QUY-TAC-BAT-BUOC.md'));
    fs.writeFileSync(path.join(src, 'skills', 'leaf', '.DS_Store'), 'junk', 'utf8');
    fs.writeFileSync(path.join(src, 'skills', 'leaf', 'Icon\r'), 'junk', 'utf8');
    fs.writeFileSync(path.join(src, 'skills', 'leaf', 'SKILL.md'), '# Test\nHello', 'utf8');

    copyCleanTree(src, dst, { mapSkill: 'cs-ui-ban-do-kho' });

    const copiedTarget = path.join(dst, 'skills', 'leaf', 'QUY-TAC-BAT-BUOC.md');
    assert.equal(fs.lstatSync(copiedTarget).isSymbolicLink(), false);
    assert.equal(fs.existsSync(path.join(dst, 'skills', 'leaf', '.DS_Store')), false);
    assert.equal(fs.existsSync(path.join(dst, 'skills', 'leaf', 'Icon\r')), false);
    const copiedSkill = fs.readFileSync(path.join(dst, 'skills', 'leaf', 'SKILL.md'), 'utf8');
    assert.ok(copiedSkill.includes('../cs-ui-ban-do-kho/QUY-TAC-BAT-BUOC.md'));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('built outputs build strictly 1 plugin (catersoft@1.0.0) cleanly, emit remote MCP OAuth configs, pass OpenAI rules, and omit root plugin.json in Codex zip', () => {
  const result = buildAll({ rootDir: REPO_ROOT, quiet: true });
  assert.equal(result.metas.length, 1);
  assert.equal(result.metas[0].name, 'catersoft');

  const claudeMp = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, '.claude-plugin', 'marketplace.json'), 'utf8'));
  const codexMp = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, '.agents', 'plugins', 'marketplace.json'), 'utf8'));
  assert.equal(claudeMp.plugins.length, 1);
  assert.equal(codexMp.plugins.length, 1);

  for (const spec of EXPECTED_PLUGINS) {
    const repoPluginDir = path.join(REPO_ROOT, 'plugins', spec.name);
    const distClaudeDir = path.join(REPO_ROOT, 'dist', 'claude', 'plugins', spec.name);
    const distAgyDir = path.join(REPO_ROOT, 'dist', 'agy', spec.name);
    const codexDir = path.join(REPO_ROOT, 'dist', 'codex', spec.name);
    const codexManifest = JSON.parse(fs.readFileSync(path.join(codexDir, '.codex-plugin', 'plugin.json'), 'utf8'));
    const zipPath = path.join(REPO_ROOT, 'dist', 'codex', `${spec.name}-v${spec.version}.zip`);
    const entries = execFileSync('/usr/bin/unzip', ['-Z1', zipPath], { encoding: 'utf8' })
      .split('\n')
      .filter(Boolean);

    assert.equal(entries.includes('plugin.json'), false, `${spec.name} Codex zip must not include root plugin.json`);
    assert.equal(entries.includes('.codex-plugin/plugin.json'), true);
    assert.equal(entries.includes('.mcp.json'), true);
    assert.equal(fs.existsSync(path.join(repoPluginDir, '.mcp.json')), false, 'plugins/catersoft must not contain root .mcp.json');
    assert.equal(fs.existsSync(path.join(distAgyDir, '.mcp.json')), false, 'dist/agy/catersoft must not contain root .mcp.json');

    const repoAgyMcp = JSON.parse(fs.readFileSync(path.join(repoPluginDir, 'mcp_config.json'), 'utf8'));
    const repoClaudeManifest = JSON.parse(
      fs.readFileSync(path.join(repoPluginDir, '.claude-plugin', 'plugin.json'), 'utf8'),
    );
    const repoCodexMcp = JSON.parse(fs.readFileSync(path.join(repoPluginDir, '.codex-plugin', 'mcp.json'), 'utf8'));
    const distClaudeManifest = JSON.parse(
      fs.readFileSync(path.join(distClaudeDir, '.claude-plugin', 'plugin.json'), 'utf8'),
    );
    const distAgyMcp = JSON.parse(fs.readFileSync(path.join(distAgyDir, 'mcp_config.json'), 'utf8'));
    const distCodexMcp = JSON.parse(fs.readFileSync(path.join(codexDir, '.mcp.json'), 'utf8'));

    assert.equal(fs.existsSync(path.join(repoPluginDir, '.claude-plugin', 'mcp.json')), false);
    assert.equal(repoAgyMcp.mcpServers.catersoft.serverUrl, 'https://catersoft.app/mcp');
    assert.equal(distAgyMcp.mcpServers.catersoft.serverUrl, 'https://catersoft.app/mcp');
    assert.equal(repoClaudeManifest.mcpServers.catersoft.url, 'https://catersoft.app/mcp');
    assert.equal(repoClaudeManifest.privacyPolicyUrl, 'https://www.catersoft.vn');
    assert.equal(repoCodexMcp.mcpServers.catersoft.url, 'https://catersoft.app/mcp');
    assert.equal(distClaudeManifest.mcpServers.catersoft.url, 'https://catersoft.app/mcp');
    assert.equal(distCodexMcp.mcpServers.catersoft.url, 'https://catersoft.app/mcp');

    validateOpenAiSubmissionRules(codexDir, codexManifest, entries);

    let injectedLeafCount = 0;
    for (const dirEntry of fs.readdirSync(path.join(codexDir, 'skills'), { withFileTypes: true })) {
      if (!dirEntry.isDirectory() || dirEntry.name === spec.mapSkill) continue;
      const md = fs.readFileSync(path.join(codexDir, 'skills', dirEntry.name, 'SKILL.md'), 'utf8');
      assert.ok(md.includes(`../${spec.mapSkill}/QUY-TAC-BAT-BUOC.md`));
      injectedLeafCount += 1;
    }
    assert.equal(injectedLeafCount, spec.leafCount);
  }
});

test('validateOpenAiSubmissionRules rejects oversized displayName, low contrast, and colliding root plugin.json', () => {
  const codexDir = path.join(REPO_ROOT, 'dist', 'codex', 'catersoft');
  const validManifest = JSON.parse(fs.readFileSync(path.join(codexDir, '.codex-plugin', 'plugin.json'), 'utf8'));

  const badManifest = structuredClone(validManifest);
  badManifest.interface.displayName = 'X'.repeat(31);
  badManifest.interface.brandColorDark = '#222222';

  assert.throws(
    () => validateOpenAiSubmissionRules(codexDir, badManifest, ['plugin.json', '.codex-plugin/plugin.json']),
    /exceeds 30|<2:1 contrast|must NOT appear in Codex zip/,
  );
});

test('parseRepoSlug and runPublish --dry-run emit single release tag catersoft--v1.0.0 and 1 Codex zip', () => {
  assert.equal(parseRepoSlug('https://github.com/catersoft-vn/catersoft-plugins.git'), 'catersoft-vn/catersoft-plugins');
  const plan = runPublish({
    rootDir: REPO_ROOT,
    dryRun: true,
    skipBuildVerify: true,
    quiet: true,
    probeFn: (repoSlug) => ({
      org: 'catersoft-vn',
      repoSlug,
      orgExists: true,
      orgType: 'Organization',
      repoExists: true,
    }),
  });
  assert.equal(plan.status, 'dry-run');
  assert.deepEqual(plan.tagsToPush, ['catersoft--v1.0.0']);
  assert.deepEqual(plan.releaseAssets, ['dist/codex/catersoft-v1.0.0.zip']);
});
