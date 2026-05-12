import fs from 'fs';
import path from 'path';
import semver from 'semver';
import { BundleManifest, BundleCheckResponse } from '../types/bundle';

/** Đường dẫn tới manifest file (tương đối so với dist/ sau khi build) */
const MANIFEST_PATH = path.resolve(__dirname, '../../data/bundle-manifest.json');

/**
 * Đọc và parse manifest, throw nếu không tìm thấy file.
 * Không cache — đọc mỗi request để hỗ trợ hot-reload manifest không restart server.
 */
function readManifest(): BundleManifest[] {
  if (!fs.existsSync(MANIFEST_PATH)) {
    throw new Error(`bundle-manifest.json not found at ${MANIFEST_PATH}`);
  }
  const raw = fs.readFileSync(MANIFEST_PATH, 'utf-8');
  return JSON.parse(raw) as BundleManifest[];
}

/**
 * Kiểm tra xem nativeVersion có >= minNativeVersion không.
 * Trả false nếu bất kỳ version string nào không hợp lệ SemVer.
 */
function isNativeCompatible(nativeVersion: string, minNativeVersion: string): boolean {
  const native = semver.coerce(nativeVersion);
  const min    = semver.coerce(minNativeVersion);
  if (!native || !min) return false;
  return semver.gte(native, min);
}

/**
 * So sánh bundleVersion: trả true nếu latest khác current.
 * Format "0.1.0-b3": so sánh phần string đơn giản;
 * nếu cần strict SemVer có thể upgrade sau.
 */
function hasNewBundle(currentBundleVersion: string, latestBundleVersion: string): boolean {
  return currentBundleVersion.trim() !== latestBundleVersion.trim();
}

/**
 * Core logic:
 * 1. Lấy tất cả entry channel="stable" từ manifest, sort publishedAt DESC
 * 2. Tìm entry mới nhất
 * 3. Kiểm tra native compatibility:
 *    - Tương thích + có bundle mới → trả hasUpdate=true
 *    - Không tương thích → trả nativeRequired (cần nâng APK trước)
 *    - Đã là mới nhất → trả hasUpdate=false
 */
export function checkBundleUpdate(
  nativeVersion: string,
  currentBundleVersion: string,
  channel = 'stable',
): BundleCheckResponse {
  const all = readManifest();

  // Lọc đúng channel, sort publishedAt DESC
  const channelEntries = all
    .filter(e => e.channel === channel)
    .sort((a, b) => b.publishedAt - a.publishedAt);

  if (channelEntries.length === 0) {
    return { hasUpdate: false, update: null, nativeRequired: null };
  }

  const latest = channelEntries[0];

  // Kiểm tra native compatibility
  if (!isNativeCompatible(nativeVersion, latest.minNativeVersion)) {
    return {
      hasUpdate: false,
      update: null,
      nativeRequired: {
        minNativeVersion: latest.minNativeVersion,
        // APK download URL được đặt theo convention: /apk/<minNativeVersion>.apk
        downloadUrl: `${process.env.CDN_BASE_URL ?? ''}/apk/${latest.minNativeVersion}.apk`,
        mandatory: latest.mandatory,
      },
    };
  }

  // So sánh bundle version
  if (!hasNewBundle(currentBundleVersion, latest.bundleVersion)) {
    return { hasUpdate: false, update: null, nativeRequired: null };
  }

  return {
    hasUpdate: true,
    update: latest,
    nativeRequired: null,
  };
}
