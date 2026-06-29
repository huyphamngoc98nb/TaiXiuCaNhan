# In-app updates

## Overview

Android in-app updates use this flow:

```text
latest.json
→ compare latest.versionCode with the installed versionCode
→ show AppUpdateDialog
→ stream the APK into app cache through AppUpdatePlugin
→ verify SHA-256
→ create a FileProvider content URI
→ open the Android installer
```

The browser never downloads the APK. On non-Android platforms the check returns `unsupported_platform`, and Settings explains that APK updates are Android-only.

During an Android download, the native plugin emits `appUpdateDownloadProgress`. The dialog shows percentage progress when the server provides a content length; otherwise it shows an indeterminate bar and the downloaded byte count. Native listeners are removed after success, failure, or component unmount.

## `latest.json` contract

```json
{
  "platform": "android",
  "versionName": "0.1.21",
  "versionCode": 121,
  "minSupportedVersionCode": 100,
  "mandatory": false,
  "apkUrl": "https://github.com/example/TaiChinhCaNhan/releases/download/v0.1.21/TaiChinhCaNhan-v0.1.21.apk",
  "sha256": "64-character SHA-256 digest",
  "releaseDate": "2026-06-29",
  "releaseNotes": ["Fix backup flow"]
}
```

Required fields are `platform`, `versionName`, `versionCode`, `apkUrl`, and `sha256`. `platform` must be `android`; `versionCode` must be a positive integer. Missing `mandatory` and `releaseNotes` values normalize to `false` and `[]`.

When `minSupportedVersionCode` is greater than the installed version code, the frontend treats the update as mandatory.

## Environment and configuration

The metadata endpoint defaults to:

```text
https://huyphamngoc98nb.github.io/TaiChinhCaNhan/latest.json
```

Override it at build time when needed:

```dotenv
VITE_ANDROID_LATEST_JSON_URL=<url-to-latest.json>
```

See `.env.example` for optional current-version compatibility fallbacks. Normal Android builds read the installed version through `AppUpdatePlugin.getCurrentVersion()`.

## Release process

1. Update `version.config.json` with a higher native version code and matching version name.
2. Build and sign the release APK.
3. Generate release metadata:

   ```bash
   npm run generate:android-release-metadata
   ```

4. Verify the generated `latest.json` points to the uploaded APK asset and contains the APK's exact SHA-256 digest.
5. Publish `latest.json` to the configured static metadata URL.

See [android-release.md](./android-release.md) for signing, tagging, and GitHub release details.

## Error and retry behavior

Native error codes are mapped to localized messages. Download, verification, permission, FileProvider, and installer failures leave the dialog open with a `Thử lại` button. Permission failures open Android's “Install unknown apps” settings; after granting permission, return to the app and retry manually. Retries never loop automatically.

## Manual QA checklist

- App starts normally when update check fails.
- No dialog appears when `latest.versionCode <= current.versionCode`.
- Dialog appears when `latest.versionCode > current.versionCode`.
- Release notes are displayed when present.
- Optional update allows “Để sau”.
- Mandatory update hides “Để sau”.
- Clicking “Cập nhật” starts the native APK download.
- Progress updates during download.
- Unknown content length shows indeterminate progress and downloaded bytes.
- Repeated taps do not start duplicate downloads.
- Native progress listeners are removed after success, error, and unmount.
- SHA-256 mismatch shows an error, deletes the cached APK, and does not open the installer.
- Valid SHA-256 opens the Android installer through a `content://` FileProvider URI.
- Missing “Install unknown apps” permission opens Android settings and shows the permission message.
- After permission is granted, the user can retry the update.
- Failed downloads show “Thử lại” without automatically looping.
- Canceling the installer does not crash the app.
- After installing the new APK, the same update no longer appears.
- Settings → “Kiểm tra cập nhật” opens the same dialog when an update exists.
- Settings shows “Bạn đang dùng phiên bản mới nhất” when no update exists.
- Settings explains that APK updates are Android-only on unsupported platforms.
