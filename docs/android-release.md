# Android release

Workflow `.github/workflows/android-release.yml` builds the Capacitor Android release APK, signs it, generates `latest.json`, and publishes both assets to GitHub Releases. CI must run from a tag named `vX.Y.Z`; the `X.Y.Z` part must match `nativeVersionName` in `version.config.json`.

## Operational checklist

Use this checklist for every Android release:

- Step 1: Update `version.config.json`.
- Step 2: Commit the version change.
- Step 3: Create tag `vX.Y.Z` matching `nativeVersionName`.
- Step 4: Push the tag.
- Step 5: Check GitHub Actions for the Android Release workflow.
- Step 6: Check GitHub Release assets.
- Step 7: Download the APK and install it over the previous version on a phone.

## Definition of Done

- APK is built successfully.
- APK is signed with the release key.
- `latest.json` has the correct `versionName`, `versionCode`, `apkUrl`, and `sha256`.
- APK installs over the previous version.
- `versionCode` is greater than the previous release.

## GitHub Secrets

Create these repository secrets in GitHub:

- `ANDROID_KEYSTORE_BASE64`: base64 content of the Android release keystore.
- `ANDROID_KEYSTORE_PASSWORD`: keystore password.
- `ANDROID_KEY_ALIAS`: release key alias.
- `ANDROID_KEY_PASSWORD`: release key password.

Never commit the real keystore or `android/keystore.properties`.

Generate `ANDROID_KEYSTORE_BASE64` on macOS/Linux:

```bash
base64 -w 0 path/to/release.keystore
```

Generate it on Windows PowerShell:

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("path\to\release.keystore"))
```

The workflow writes this CI-only signing file:

```properties
storeFile=release.keystore
storePassword=...
keyAlias=...
keyPassword=...
```

## Bump version.config.json

`version.config.json` is the Android version source of truth. Before creating a release tag, update:

```json
{
  "nativeVersionName": "0.1.15",
  "nativeVersionCode": 115,
  "minNativeVersionCodeForBundle": 100
}
```

Rules:

- `nativeVersionName` must be `X.Y.Z`.
- `nativeVersionCode` must be an integer greater than the previous release.
- Do not edit Android `versionCode` or `versionName` directly in Gradle.
- CI builds with `-PskipAndroidVersionBump=true`, so it will not modify `version.config.json`.

## Create the release tag

Commit the version change first, then create and push a matching tag:

```bash
git tag v0.1.15
git push origin v0.1.15
```

For manual reruns, open the Android Release workflow and use `workflow_dispatch` with an existing tag such as `v0.1.15`.

## Check the GitHub Release

After the workflow finishes, open the release for the tag and verify these assets exist:

- `TaiChinhCaNhan-v0.1.15.apk`
- `latest.json`

Check `latest.json` includes:

- `versionName` matching `version.config.json`.
- `versionCode` matching `version.config.json`.
- `apkUrl` pointing to the APK asset on the same GitHub Release.
- `sha256` matching the uploaded APK.

If `RELEASE_NOTES.md` exists at the repo root, the workflow uses it as the GitHub Release notes. Otherwise it uses `Android release vX.Y.Z`.

## Troubleshooting

Wrong keystore:
The Gradle release build fails during signing or install verification. Confirm the keystore file, alias, store password, and key password belong together. Regenerate `ANDROID_KEYSTORE_BASE64` from the exact release keystore.

versionCode does not increase:
Android rejects upgrades when `nativeVersionCode` is not greater than the installed or previously released APK. Increase `nativeVersionCode` in `version.config.json`, commit it, and tag again with the matching version name.

Tag does not match nativeVersionName:
The metadata step fails if tag `vX.Y.Z` does not match `nativeVersionName` `X.Y.Z`. Fix either the tag or `version.config.json` so they match exactly.

Missing secret:
The workflow stops early at `Validate Android signing secrets` and prints the missing secret name. Add the secret in repository settings and rerun the workflow.
