export const DEFAULT_ANDROID_LATEST_JSON_URL =
  'https://huyphamngoc98nb.github.io/TaiChinhCaNhan/latest.json';

function optionalEnvValue(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function optionalPositiveInteger(value: string | undefined): number | undefined {
  const trimmed = optionalEnvValue(value);
  if (!trimmed || !/^\d+$/.test(trimmed)) return undefined;

  const parsed = Number(trimmed);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : undefined;
}

export function getAndroidLatestJsonUrl(): string {
  return (
    optionalEnvValue(import.meta.env.VITE_ANDROID_LATEST_JSON_URL) ??
    // Backward compatibility for builds configured before the Phase 1 contract.
    optionalEnvValue(import.meta.env.VITE_ANDROID_UPDATE_MANIFEST_URL) ??
    DEFAULT_ANDROID_LATEST_JSON_URL
  );
}

export function getFallbackAndroidVersion(): {
  versionName?: string;
  versionCode?: number;
} {
  return {
    versionName: optionalEnvValue(import.meta.env.VITE_ANDROID_CURRENT_VERSION_NAME),
    versionCode: optionalPositiveInteger(import.meta.env.VITE_ANDROID_CURRENT_VERSION_CODE),
  };
}
