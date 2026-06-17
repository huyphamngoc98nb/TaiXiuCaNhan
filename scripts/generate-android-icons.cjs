const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const repoRoot = path.resolve(__dirname, '..');
const assetRoot = path.join(repoRoot, 'assets', 'icon');
const publicRoot = path.join(repoRoot, 'public');
const resRoot = path.join(repoRoot, 'android', 'app', 'src', 'main', 'res');
const sourcePng = path.join(assetRoot, 'icon.png');
const sourceSvg = path.join(assetRoot, 'icon.svg');
const backgroundColor = '#12B8A6';

const densities = [
  ['mipmap-mdpi', 48],
  ['mipmap-hdpi', 72],
  ['mipmap-xhdpi', 96],
  ['mipmap-xxhdpi', 144],
  ['mipmap-xxxhdpi', 192],
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function crc32(buffer) {
  let crc = -1;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ -1) >>> 0;
}

function pngChunk(type, data) {
  const typeBuffer = Buffer.from(type);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);

  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);

  return Buffer.concat([length, typeBuffer, data, crc]);
}

function writePng(filePath, width, height, pixels) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const raw = Buffer.alloc(height * (width * 4 + 1));
  for (let y = 0; y < height; y += 1) {
    const rowStart = y * (width * 4 + 1);
    raw[rowStart] = 0;
    Buffer.from(pixels.subarray(y * width * 4, (y + 1) * width * 4)).copy(raw, rowStart + 1);
  }

  fs.writeFileSync(
    filePath,
    Buffer.concat([
      signature,
      pngChunk('IHDR', ihdr),
      pngChunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
      pngChunk('IEND', Buffer.alloc(0)),
    ]),
  );
}

function paethPredictor(left, up, upLeft) {
  const p = left + up - upLeft;
  const pa = Math.abs(p - left);
  const pb = Math.abs(p - up);
  const pc = Math.abs(p - upLeft);
  if (pa <= pb && pa <= pc) return left;
  if (pb <= pc) return up;
  return upLeft;
}

function readPng(filePath) {
  const buffer = fs.readFileSync(filePath);
  const signature = buffer.subarray(0, 8);
  if (!signature.equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
    throw new Error(`${filePath} is not a PNG file.`);
  }

  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  let interlace = 0;
  const idat = [];

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString('ascii', offset + 4, offset + 8);
    const data = buffer.subarray(offset + 8, offset + 8 + length);
    offset += 12 + length;

    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
      interlace = data[12];
    }

    if (type === 'IDAT') idat.push(data);
    if (type === 'IEND') break;
  }

  if (bitDepth !== 8 || (colorType !== 6 && colorType !== 2) || interlace !== 0) {
    throw new Error('Only non-interlaced 8-bit RGB/RGBA PNG icons are supported.');
  }

  const channels = colorType === 6 ? 4 : 3;
  const bytesPerPixel = channels;
  const stride = width * channels;
  const inflated = zlib.inflateSync(Buffer.concat(idat));
  const raw = Buffer.alloc(width * height * channels);

  let sourceOffset = 0;
  for (let y = 0; y < height; y += 1) {
    const filter = inflated[sourceOffset];
    sourceOffset += 1;
    const rowStart = y * stride;

    for (let x = 0; x < stride; x += 1) {
      const value = inflated[sourceOffset + x];
      const left = x >= bytesPerPixel ? raw[rowStart + x - bytesPerPixel] : 0;
      const up = y > 0 ? raw[rowStart + x - stride] : 0;
      const upLeft = y > 0 && x >= bytesPerPixel ? raw[rowStart + x - stride - bytesPerPixel] : 0;

      if (filter === 0) raw[rowStart + x] = value;
      else if (filter === 1) raw[rowStart + x] = (value + left) & 0xff;
      else if (filter === 2) raw[rowStart + x] = (value + up) & 0xff;
      else if (filter === 3) raw[rowStart + x] = (value + Math.floor((left + up) / 2)) & 0xff;
      else if (filter === 4) raw[rowStart + x] = (value + paethPredictor(left, up, upLeft)) & 0xff;
      else throw new Error(`Unsupported PNG filter: ${filter}`);
    }

    sourceOffset += stride;
  }

  const pixels = new Uint8ClampedArray(width * height * 4);
  for (let i = 0, j = 0; i < raw.length; i += channels, j += 4) {
    pixels[j] = raw[i];
    pixels[j + 1] = raw[i + 1];
    pixels[j + 2] = raw[i + 2];
    pixels[j + 3] = colorType === 6 ? raw[i + 3] : 255;
  }

  return { width, height, pixels };
}

function sampleBilinear(source, x, y, channel) {
  const x0 = Math.max(0, Math.min(source.width - 1, Math.floor(x)));
  const y0 = Math.max(0, Math.min(source.height - 1, Math.floor(y)));
  const x1 = Math.max(0, Math.min(source.width - 1, x0 + 1));
  const y1 = Math.max(0, Math.min(source.height - 1, y0 + 1));
  const tx = x - x0;
  const ty = y - y0;

  const i00 = (y0 * source.width + x0) * 4 + channel;
  const i10 = (y0 * source.width + x1) * 4 + channel;
  const i01 = (y1 * source.width + x0) * 4 + channel;
  const i11 = (y1 * source.width + x1) * 4 + channel;

  const top = source.pixels[i00] * (1 - tx) + source.pixels[i10] * tx;
  const bottom = source.pixels[i01] * (1 - tx) + source.pixels[i11] * tx;
  return Math.round(top * (1 - ty) + bottom * ty);
}

function resizePng(source, targetSize) {
  const pixels = new Uint8ClampedArray(targetSize * targetSize * 4);

  for (let y = 0; y < targetSize; y += 1) {
    for (let x = 0; x < targetSize; x += 1) {
      const sourceX = ((x + 0.5) * source.width) / targetSize - 0.5;
      const sourceY = ((y + 0.5) * source.height) / targetSize - 0.5;
      const index = (y * targetSize + x) * 4;
      pixels[index] = sampleBilinear(source, sourceX, sourceY, 0);
      pixels[index + 1] = sampleBilinear(source, sourceX, sourceY, 1);
      pixels[index + 2] = sampleBilinear(source, sourceX, sourceY, 2);
      pixels[index + 3] = sampleBilinear(source, sourceX, sourceY, 3);
    }
  }

  return pixels;
}

function maskRound(pixels, size) {
  const center = size / 2;
  const radius = size / 2;
  const radiusSquared = radius * radius;
  const out = new Uint8ClampedArray(pixels);

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const dx = x + 0.5 - center;
      const dy = y + 0.5 - center;
      if (dx * dx + dy * dy > radiusSquared) {
        out[(y * size + x) * 4 + 3] = 0;
      }
    }
  }

  return out;
}

function parseColor(hex) {
  const value = hex.replace('#', '');
  return [
    parseInt(value.slice(0, 2), 16),
    parseInt(value.slice(2, 4), 16),
    parseInt(value.slice(4, 6), 16),
    255,
  ];
}

function writeBackgroundPng(filePath, size) {
  const [r, g, b, a] = parseColor(backgroundColor);
  const pixels = new Uint8ClampedArray(size * size * 4);

  for (let index = 0; index < pixels.length; index += 4) {
    pixels[index] = r;
    pixels[index + 1] = g;
    pixels[index + 2] = b;
    pixels[index + 3] = a;
  }

  writePng(filePath, size, size, pixels);
}

function writeBitmapDrawable(filePath) {
  fs.writeFileSync(
    filePath,
    [
      '<?xml version="1.0" encoding="utf-8"?>',
      '<bitmap xmlns:android="http://schemas.android.com/apk/res/android"',
      '    android:src="@mipmap/ic_launcher_foreground"',
      '    android:gravity="center" />',
      '',
    ].join('\n'),
  );
}

function writeAdaptiveIcon(filePath) {
  fs.writeFileSync(
    filePath,
    [
      '<?xml version="1.0" encoding="utf-8"?>',
      '<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">',
      '    <background android:drawable="@color/ic_launcher_background" />',
      '    <foreground android:drawable="@drawable/ic_launcher_foreground" />',
      '</adaptive-icon>',
      '',
    ].join('\n'),
  );
}

function writeAndroidXml() {
  ensureDir(path.join(resRoot, 'drawable'));
  ensureDir(path.join(resRoot, 'drawable-v24'));
  ensureDir(path.join(resRoot, 'values'));
  ensureDir(path.join(resRoot, 'mipmap-anydpi-v26'));

  writeBitmapDrawable(path.join(resRoot, 'drawable', 'ic_launcher_foreground.xml'));
  writeBitmapDrawable(path.join(resRoot, 'drawable-v24', 'ic_launcher_foreground.xml'));
  writeAdaptiveIcon(path.join(resRoot, 'mipmap-anydpi-v26', 'ic_launcher.xml'));
  writeAdaptiveIcon(path.join(resRoot, 'mipmap-anydpi-v26', 'ic_launcher_round.xml'));

  fs.writeFileSync(
    path.join(resRoot, 'values', 'ic_launcher_background.xml'),
    [
      '<?xml version="1.0" encoding="utf-8"?>',
      '<resources>',
      `    <color name="ic_launcher_background">${backgroundColor}</color>`,
      '</resources>',
      '',
    ].join('\n'),
  );
}

function writeSourceAssets(source) {
  fs.copyFileSync(sourceSvg, path.join(assetRoot, 'icon-foreground.svg'));
  fs.copyFileSync(sourceSvg, path.join(publicRoot, 'icon.svg'));
  fs.copyFileSync(sourcePng, path.join(publicRoot, 'icon.png'));

  fs.writeFileSync(
    path.join(assetRoot, 'icon-background.svg'),
    [
      '<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">',
      `  <rect width="1024" height="1024" fill="${backgroundColor}" />`,
      '</svg>',
      '',
    ].join('\n'),
  );

  writePng(path.join(assetRoot, 'icon-foreground.png'), 1024, 1024, resizePng(source, 1024));
  writeBackgroundPng(path.join(assetRoot, 'icon-background.png'), 1024);
}

function writeAndroidPngs(source) {
  for (const [dirName, size] of densities) {
    const dir = path.join(resRoot, dirName);
    ensureDir(dir);

    const resized = resizePng(source, size);
    writePng(path.join(dir, 'ic_launcher.png'), size, size, resized);
    writePng(path.join(dir, 'ic_launcher_round.png'), size, size, maskRound(resized, size));
    writePng(path.join(dir, 'ic_launcher_foreground.png'), size, size, resized);
  }
}

function main() {
  if (!fs.existsSync(sourcePng) || !fs.existsSync(sourceSvg)) {
    throw new Error('Expected assets/icon/icon.png and assets/icon/icon.svg before generating icons.');
  }

  ensureDir(assetRoot);
  ensureDir(publicRoot);

  const source = readPng(sourcePng);
  if (source.width !== source.height) {
    throw new Error('App icon source PNG must be square.');
  }

  writeSourceAssets(source);
  writeAndroidXml();
  writeAndroidPngs(source);

  console.log('Generated launcher icons from assets/icon/icon.png and assets/icon/icon.svg.');
}

main();
