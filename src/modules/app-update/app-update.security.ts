const INVALID_UPDATE_SOURCE_MESSAGE = 'Nguồn cập nhật không hợp lệ.';

const ANDROID_MANIFEST_HOSTS: ReadonlySet<string> = new Set([
  'huyphamngoc98nb.github.io',
]);

const ANDROID_APK_HOSTS: ReadonlySet<string> = new Set([
  'github.com',
  'objects.githubusercontent.com',
  'github-releases.githubusercontent.com',
]);

function parseHttpsUrl(rawUrl: string): URL {
  let url: URL;

  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error(INVALID_UPDATE_SOURCE_MESSAGE);
  }

  if (url.protocol !== 'https:') {
    throw new Error(INVALID_UPDATE_SOURCE_MESSAGE);
  }

  return url;
}

export function assertHttpsUrl(rawUrl: string): void {
  parseHttpsUrl(rawUrl);
}

export function assertAllowedHost(
  rawUrl: string,
  allowedHosts: ReadonlySet<string>,
): void {
  const url = parseHttpsUrl(rawUrl);

  if (!allowedHosts.has(url.hostname)) {
    throw new Error(INVALID_UPDATE_SOURCE_MESSAGE);
  }
}

export function assertAllowedManifestUrl(rawUrl: string): void {
  assertAllowedHost(rawUrl, ANDROID_MANIFEST_HOSTS);
}

export function assertAllowedApkUrl(rawUrl: string): void {
  assertAllowedHost(rawUrl, ANDROID_APK_HOSTS);
}
