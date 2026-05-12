/** Một entry trong bundle-manifest.json */
export interface BundleManifest {
  /** Phân biệt các release: "stable" | "beta" | "hotfix" */
  channel: string;
  /** Version của web bundle, format: semver-build (ví dụ: "0.1.0-b3") */
  bundleVersion: string;
  /** URL public tải file .zip bundle */
  bundleUrl: string;
  /** SHA-256 của file .zip (hex lowercase) */
  sha256: string;
  /** Native versionName tối thiểu (định dạng SemVer) */
  minNativeVersion: string;
  /** true = app phải update mới có thể dùng được, false = gợi ý */
  mandatory: boolean;
  /** Release notes ngắn gọn hiển cho user */
  releaseNotes: string;
  /** Epoch ms lúc push manifest này */
  publishedAt: number;
}

/** Response trả về cho client */
export interface BundleCheckResponse {
  /** Có bản mới không (khác với x-bundle-version gửi lên) */
  hasUpdate: boolean;
  /** null nếu không có update tương thích */
  update: BundleManifest | null;
  /** Liên quan đến native: null = không cần, object = cần nâng APK trước */
  nativeRequired: {
    minNativeVersion: string;
    downloadUrl: string;
    mandatory: boolean;
  } | null;
}
