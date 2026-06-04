#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const help = args.includes('--help') || args.includes('-h');
const unknownArgs = args.filter((arg) => !['--dry-run', '--help', '-h'].includes(arg));

if (help) {
  console.log('Usage: node scripts/bump-android-version.cjs [--dry-run]');
  process.exit(0);
}

if (unknownArgs.length > 0) {
  console.error(`[android-version] unknown argument(s): ${unknownArgs.join(', ')}`);
  process.exit(1);
}

const repoRoot = path.resolve(__dirname, '..');
const gradleFile = findGradleFile(repoRoot);
const source = selectVersionSource(repoRoot, gradleFile);

const currentVersionName = String(source.data[source.nameKey]);
const currentVersionCode = parseVersionCode(source.data[source.codeKey], source.codeKey);
const nextVersionCode = currentVersionCode + 1;
const versionNameBump = bumpPatchVersion(currentVersionName);
const nextVersionName = versionNameBump.nextVersionName;

console.log(`[android-version] source: ${path.relative(repoRoot, source.filePath)}`);
console.log(`[android-version] versionCode: ${currentVersionCode} -> ${nextVersionCode}`);

if (versionNameBump.changed) {
  console.log(`[android-version] versionName: ${currentVersionName} -> ${nextVersionName}`);
} else {
  console.warn(
    `[android-version] warning: versionName "${currentVersionName}" is not MAJOR.MINOR.PATCH; keeping it unchanged.`
  );
  console.log(`[android-version] versionName: ${currentVersionName} -> ${currentVersionName}`);
}

const sourceResult = updateJsonSource(source, nextVersionName, nextVersionCode, versionNameBump.changed);
const gradleResult = updateGradleVersionFile(gradleFile, nextVersionName, nextVersionCode);

if (dryRun) {
  console.log('[android-version] dry run; no files changed.');
  process.exit(0);
}

if (sourceResult.changed) {
  fs.writeFileSync(source.filePath, sourceResult.text, 'utf8');
  console.log(`[android-version] updated ${path.relative(repoRoot, source.filePath)}`);
}

if (gradleResult.changed) {
  fs.writeFileSync(gradleFile, gradleResult.text, 'utf8');
  console.log(`[android-version] updated ${path.relative(repoRoot, gradleFile)}`);
} else {
  console.log(
    `[android-version] ${path.relative(repoRoot, gradleFile)} already reads ${path.basename(source.filePath)}`
  );
}

function selectVersionSource(rootDir, gradlePath) {
  const versionConfigPath = path.join(rootDir, 'version.config.json');

  if (fs.existsSync(versionConfigPath)) {
    const parsed = readJsonFile(versionConfigPath);
    const nameKey = firstKey(parsed.data, ['nativeVersionName', 'versionName', 'version']);
    const codeKey = firstKey(parsed.data, ['nativeVersionCode', 'versionCode', 'build', 'androidVersionCode']);

    if (!nameKey || !codeKey) {
      throw new Error(
        'version.config.json must contain a version name key and a version code key. ' +
          'Supported name keys: nativeVersionName, versionName, version. ' +
          'Supported code keys: nativeVersionCode, versionCode, build, androidVersionCode.'
      );
    }

    return {
      filePath: versionConfigPath,
      text: parsed.text,
      data: parsed.data,
      nameKey,
      codeKey,
      rewriteWholeFile: false,
    };
  }

  const packageJsonPath = path.join(rootDir, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    throw new Error('No version.config.json or package.json found at the repository root.');
  }

  const parsed = readJsonFile(packageJsonPath);
  const nameKey = firstKey(parsed.data, ['versionName', 'version']);
  let codeKey = firstKey(parsed.data, ['androidVersionCode', 'versionCode', 'build']);

  if (!nameKey) {
    throw new Error('package.json fallback must contain "version" or "versionName".');
  }

  if (!codeKey) {
    const gradleVersionCode = readHardcodedGradleVersionCode(gradlePath);
    parsed.data.androidVersionCode = gradleVersionCode;
    codeKey = 'androidVersionCode';
  }

  return {
    filePath: packageJsonPath,
    text: parsed.text,
    data: parsed.data,
    nameKey,
    codeKey,
    rewriteWholeFile: true,
  };
}

function readJsonFile(filePath) {
  const text = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');

  try {
    return { text, data: JSON.parse(text) };
  } catch (error) {
    throw new Error(`Could not parse ${filePath}: ${error.message}`);
  }
}

function firstKey(object, keys) {
  return keys.find((key) => Object.prototype.hasOwnProperty.call(object, key));
}

function parseVersionCode(value, key) {
  if (typeof value === 'number' && Number.isInteger(value)) {
    return value;
  }

  if (typeof value === 'string' && /^\d+$/.test(value)) {
    return Number(value);
  }

  throw new Error(`${key} must be an integer version code; received ${JSON.stringify(value)}.`);
}

function bumpPatchVersion(versionName) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(versionName);

  if (!match) {
    return { changed: false, nextVersionName: versionName };
  }

  const major = Number(match[1]);
  const minor = Number(match[2]);
  const patch = Number(match[3]) + 1;

  return {
    changed: true,
    nextVersionName: `${major}.${minor}.${patch}`,
  };
}

function updateJsonSource(source, nextVersionName, nextVersionCode, updateVersionName) {
  if (source.rewriteWholeFile) {
    const nextData = { ...source.data };
    if (updateVersionName) {
      nextData[source.nameKey] = nextVersionName;
    }
    nextData[source.codeKey] = nextVersionCode;

    return {
      changed: true,
      text: `${JSON.stringify(nextData, null, 2)}\n`,
    };
  }

  let nextText = source.text;

  if (updateVersionName) {
    nextText = replaceJsonStringValue(nextText, source.nameKey, nextVersionName);
  }

  nextText = replaceJsonIntegerValue(nextText, source.codeKey, nextVersionCode);

  return {
    changed: nextText !== source.text,
    text: nextText,
  };
}

function replaceJsonStringValue(text, key, value) {
  const pattern = new RegExp(`("${escapeRegExp(key)}"\\s*:\\s*)"(?:\\\\.|[^"\\\\])*"`);

  if (!pattern.test(text)) {
    throw new Error(`Could not update string key "${key}" in JSON source.`);
  }

  return text.replace(pattern, (_match, prefix) => `${prefix}${JSON.stringify(value)}`);
}

function replaceJsonIntegerValue(text, key, value) {
  const pattern = new RegExp(`("${escapeRegExp(key)}"\\s*:\\s*)(?:"\\d+"|\\d+)`);

  if (!pattern.test(text)) {
    throw new Error(`Could not update integer key "${key}" in JSON source.`);
  }

  return text.replace(pattern, (_match, prefix) => `${prefix}${value}`);
}

function findGradleFile(rootDir) {
  const candidates = [
    path.join(rootDir, 'android', 'app', 'build.gradle'),
    path.join(rootDir, 'android', 'app', 'build.gradle.kts'),
  ];
  const gradlePath = candidates.find((candidate) => fs.existsSync(candidate));

  if (!gradlePath) {
    throw new Error('Could not find android/app/build.gradle or android/app/build.gradle.kts.');
  }

  return gradlePath;
}

function updateGradleVersionFile(filePath, nextVersionName, nextVersionCode) {
  const text = fs.readFileSync(filePath, 'utf8');

  if (gradleReadsExternalSource(text)) {
    return { changed: false, text };
  }

  let nextText = replaceFirst(
    text,
    [
      /(^\s*versionCode\s+)\d+/m,
      /(^\s*versionCode\s*=\s*)\d+/m,
    ],
    (_match, prefix) => `${prefix}${nextVersionCode}`
  );

  nextText = replaceFirst(
    nextText,
    [
      /(^\s*versionName\s+)(["'])(?:\\.|(?!\2).)*\2/m,
      /(^\s*versionName\s*=\s*)(["'])(?:\\.|(?!\2).)*\2/m,
    ],
    (_match, prefix, quote) => `${prefix}${quote}${nextVersionName}${quote}`
  );

  return {
    changed: nextText !== text,
    text: nextText,
  };
}

function gradleReadsExternalSource(text) {
  return (
    /versionCode\s+(?:versionConfig|androidVersion)\./.test(text) ||
    /versionCode\s*=\s*(?:versionConfig|androidVersion)\./.test(text) ||
    /versionName\s+(?:versionConfig|androidVersion)\./.test(text) ||
    /versionName\s*=\s*(?:versionConfig|androidVersion)\./.test(text)
  );
}

function readHardcodedGradleVersionCode(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const match = /(?:^|\n)\s*versionCode\s*(?:=|\s)\s*(\d+)/.exec(text);

  if (!match) {
    throw new Error(
      'package.json fallback needs androidVersionCode/versionCode/build, ' +
        'or a hardcoded versionCode in the Android Gradle file.'
    );
  }

  return Number(match[1]);
}

function replaceFirst(text, patterns, replacement) {
  for (const pattern of patterns) {
    if (pattern.test(text)) {
      return text.replace(pattern, replacement);
    }
  }

  return text;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
