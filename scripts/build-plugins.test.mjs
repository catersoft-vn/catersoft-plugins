import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import {
  buildAll,
  buildManifests,
  copyCleanTree,
  injectMandatoryRuleNotice,
  isJunkName,
  stripFrontmatter,
} from './build-plugins.mjs';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('isJunkName catches Drive Icon\\r, macOS .DS_Store, and local files', () => {
  assert.equal(isJunkName('Icon\r'), true);
  assert.equal(isJunkName('Icon?'), true);
  assert.equal(isJunkName('.DS_Store'), true);
  assert.equal(isJunkName('Thumbs.db'), true);
  assert.equal(isJunkName('__MACOSX'), true);
  assert.equal(isJunkName('debug.local.md'), true);
  assert.equal(isJunkName('SKILL.md'), false);
});

test('stripFrontmatter removes YAML trigger header cleanly', () => {
  const input = '---\ntrigger: always_on\ndescription: demo\n---\n\n# Heading\nBody';
  assert.equal(stripFrontmatter(input), '# Heading\nBody');
  assert.equal(stripFrontmatter('# Plain Heading\nBody'), '# Plain Heading\nBody');
});

test('injectMandatoryRuleNotice inserts callout for non-map skills only once', () => {
  const raw = '---\nname: cs-ui-nguyen-lieu-dvt\ndescription: test\n---\n\n# Skill Heading\n\nContent';
  const once = injectMandatoryRuleNotice(raw, 'cs-ui-nguyen-lieu-dvt');
  assert.ok(once.includes('../cs-ui-ban-do-thuc-don-du-tru/QUY-TAC-BAT-BUOC.md'));
  const twice = injectMandatoryRuleNotice(once, 'cs-ui-nguyen-lieu-dvt');
  assert.equal(twice, once);

  const mapRaw = '---\nname: cs-ui-ban-do-thuc-don-du-tru\ndescription: test\n---\n\n# Map';
  assert.equal(injectMandatoryRuleNotice(mapRaw, 'cs-ui-ban-do-thuc-don-du-tru'), mapRaw);
});

test('buildManifests caps AGY suggestedPrompts at 3 and omits keywords', () => {
  const meta = JSON.parse(
    fs.readFileSync(path.join(REPO_ROOT, 'src/catersoft-nhap-lieu/plugin.meta.json'), 'utf8'),
  );
  const { agyManifest, claudeManifest, codexManifest } = buildManifests(meta);
  assert.equal(agyManifest.suggestedPrompts.length, 3);
  assert.equal('keywords' in agyManifest, false);
  assert.equal(claudeManifest.name, 'catersoft-nhap-lieu');
  assert.equal(codexManifest.interface.defaultPrompt.length, 4);
  assert.equal(codexManifest.interface.logo, './assets/logo.svg');
});

test('copyCleanTree dereferences symlinks and filters Icon\\r / .DS_Store', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cs-plugin-tree-'));
  try {
    const src = path.join(tmp, 'src');
    const dst = path.join(tmp, 'dst');
    fs.mkdirSync(path.join(src, 'skills/cs-ui-nguyen-lieu-dvt'), { recursive: true });
    fs.writeFileSync(path.join(src, 'Icon\r'), '');
    fs.writeFileSync(path.join(src, '.DS_Store'), 'junk');
    fs.writeFileSync(path.join(src, 'real.md'), '---\ntrigger: always_on\n---\n\n# Rules');
    fs.symlinkSync(path.join(src, 'real.md'), path.join(src, 'QUY-TAC-BAT-BUOC.md'));
    fs.writeFileSync(
      path.join(src, 'skills/cs-ui-nguyen-lieu-dvt/SKILL.md'),
      '---\nname: cs-ui-nguyen-lieu-dvt\ndescription: d\n---\n\n# NLDVT\n\nBody',
    );

    copyCleanTree(src, dst);
    assert.equal(fs.existsSync(path.join(dst, 'Icon\r')), false);
    assert.equal(fs.existsSync(path.join(dst, '.DS_Store')), false);
    const derefStat = fs.lstatSync(path.join(dst, 'QUY-TAC-BAT-BUOC.md'));
    assert.equal(derefStat.isSymbolicLink(), false);
    assert.equal(fs.readFileSync(path.join(dst, 'QUY-TAC-BAT-BUOC.md'), 'utf8'), '# Rules');
    const skillText = fs.readFileSync(path.join(dst, 'skills/cs-ui-nguyen-lieu-dvt/SKILL.md'), 'utf8');
    assert.ok(skillText.includes('QUY-TAC-BAT-BUOC.md'));
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test('built outputs inject QUY-TAC-BAT-BUOC.md notice in all 5 leaf skills and produce clean zip', () => {
  buildAll({ rootDir: REPO_ROOT, quiet: true });
  const leafSkills = [
    'cs-ui-nguyen-lieu-dvt',
    'cs-ui-mon-an-dinh-luong',
    'cs-ui-thiet-lap-thuc-don-du-tru',
    'cs-ui-thuc-don-tuan-du-tru-ngay',
    'cs-ui-phan-an-thuc-te',
  ];
  for (const skill of leafSkills) {
    const content = fs.readFileSync(
      path.join(REPO_ROOT, 'plugins/catersoft-nhap-lieu/skills', skill, 'SKILL.md'),
      'utf8',
    );
    assert.ok(content.includes('QUY-TAC-BAT-BUOC.md'), `Missing rule notice in ${skill}`);
  }
  const rulesText = fs.readFileSync(path.join(REPO_ROOT, 'plugins/catersoft-nhap-lieu/rules/AGENTS.md'), 'utf8');
  assert.equal(rulesText.startsWith('---'), false);

  const zipList = execFileSync('/usr/bin/unzip', ['-Z1', path.join(REPO_ROOT, 'dist/codex/catersoft-nhap-lieu-v2.3.3.zip')], {
    encoding: 'utf8',
  });
  assert.equal(zipList.includes('.DS_Store'), false);
  assert.equal(zipList.includes('Icon'), false);
});
