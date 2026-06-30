const fs = require('node:fs');
const path = require('node:path');

const REPO_ROOT = path.resolve(__dirname, '..');
const SOURCE_ROOT = path.join(REPO_ROOT, 'src');
const ALLOWED_PREFIX = 'src/modules/app-update/';
const SOURCE_EXTENSIONS = new Set(['.cjs', '.js', '.jsx', '.mjs', '.ts', '.tsx']);
const NETWORK_PATTERNS = [
  { name: 'fetch', pattern: /\bfetch\s*\(/ },
  { name: 'XMLHttpRequest', pattern: /\bXMLHttpRequest\b/ },
  { name: 'navigator.sendBeacon', pattern: /\bnavigator\s*\.\s*sendBeacon\b/ },
  { name: 'WebSocket', pattern: /\bWebSocket\s*\(/ },
];

function toPosixPath(filePath) {
  return filePath.split(path.sep).join('/');
}

function listSourceFiles(directory) {
  const files = [];
  const entries = fs
    .readdirSync(directory, { withFileTypes: true })
    .sort((left, right) =>
      left.name < right.name ? -1 : left.name > right.name ? 1 : 0,
    );

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...listSourceFiles(entryPath));
    } else if (entry.isFile() && SOURCE_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(entryPath);
    }
  }

  return files;
}

const violations = [];

for (const filePath of listSourceFiles(SOURCE_ROOT)) {
  const relativePath = toPosixPath(path.relative(REPO_ROOT, filePath));
  if (relativePath.startsWith(ALLOWED_PREFIX)) {
    continue;
  }

  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  lines.forEach((line, index) => {
    const matchedApis = NETWORK_PATTERNS
      .filter(({ pattern }) => pattern.test(line))
      .map(({ name }) => name);

    if (matchedApis.length > 0) {
      violations.push({
        file: relativePath,
        line: index + 1,
        source: line.trim(),
        apis: matchedApis,
      });
    }
  });
}

if (violations.length > 0) {
  console.error('Network boundary violations detected:');
  for (const violation of violations) {
    console.error(
      `${violation.file}:${violation.line}: [${violation.apis.join(', ')}] ${violation.source}`,
    );
  }
  console.error(`Network APIs are only allowed under ${ALLOWED_PREFIX}`);
  process.exitCode = 1;
} else {
  console.log(
    `Network boundary check passed: network APIs are limited to ${ALLOWED_PREFIX}`,
  );
}
