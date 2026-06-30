package com.taixiucanhan.app;

import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;

import androidx.core.content.FileProvider;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.Locale;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@CapacitorPlugin(name = "AppUpdatePlugin")
public class AppUpdatePlugin extends Plugin {
    private static final String DEFAULT_APK_FILE_NAME = "TaiChinhCaNhan-update.apk";
    private static final String DOWNLOAD_DIRECTORY_NAME = "app-update";
    private static final String DOWNLOAD_PROGRESS_EVENT = "appUpdateDownloadProgress";
    private static final String SIGNING_CERT_BUILD_CONFIG_FIELD =
        "APP_UPDATE_SIGNING_CERT_SHA256";
    private static final int CONNECT_TIMEOUT_MS = 15_000;
    private static final int READ_TIMEOUT_MS = 60_000;
    private static final int BUFFER_SIZE = 32 * 1024;
    private static final long UNKNOWN_SIZE_PROGRESS_INTERVAL_BYTES = 256 * 1024;
    private static final Set<String> ALLOWED_APK_HOSTS = Collections.unmodifiableSet(
        new HashSet<>(
            Arrays.asList(
                "github.com",
                "objects.githubusercontent.com",
                "github-releases.githubusercontent.com"
            )
        )
    );

    private static final String ERROR_INVALID_INPUT = "APP_UPDATE_INVALID_INPUT";
    private static final String ERROR_DOWNLOAD_FAILED = "APP_UPDATE_DOWNLOAD_FAILED";
    private static final String ERROR_SHA256_MISMATCH = "APP_UPDATE_SHA256_MISMATCH";
    private static final String ERROR_FILE_PROVIDER_FAILED = "APP_UPDATE_FILE_PROVIDER_FAILED";
    private static final String ERROR_INSTALL_PERMISSION_REQUIRED = "APP_UPDATE_INSTALL_PERMISSION_REQUIRED";
    private static final String ERROR_INSTALL_INTENT_FAILED = "APP_UPDATE_INSTALL_INTENT_FAILED";
    private static final String ERROR_UNKNOWN = "APP_UPDATE_UNKNOWN_ERROR";

    private static final String MESSAGE_INVALID_INPUT = "Thiếu thông tin cập nhật.";
    private static final String MESSAGE_DOWNLOAD_FAILED =
        "Không thể tải bản cập nhật. Vui lòng kiểm tra kết nối mạng và thử lại.";
    private static final String MESSAGE_SHA256_MISMATCH =
        "File cập nhật không hợp lệ. Vui lòng thử lại sau.";
    private static final String MESSAGE_FILE_PROVIDER_FAILED =
        "Không thể chuẩn bị file cập nhật.";
    private static final String MESSAGE_INSTALL_PERMISSION_REQUIRED =
        "Bạn cần cấp quyền cài đặt ứng dụng từ nguồn này để tiếp tục.";
    private static final String MESSAGE_INSTALL_INTENT_FAILED =
        "Không thể mở màn hình cài đặt Android.";
    private static final String MESSAGE_UNKNOWN =
        "Đã xảy ra lỗi khi cập nhật ứng dụng.";

    private final ExecutorService downloadExecutor = Executors.newSingleThreadExecutor();

    @PluginMethod
    public void getCurrentVersion(PluginCall call) {
        try {
            PackageInfo packageInfo = getContext()
                .getPackageManager()
                .getPackageInfo(getContext().getPackageName(), 0);
            String versionName = packageInfo.versionName != null ? packageInfo.versionName : "";
            long versionCode = Build.VERSION.SDK_INT >= Build.VERSION_CODES.P
                ? packageInfo.getLongVersionCode()
                : packageInfo.versionCode;

            JSObject response = new JSObject();
            response.put("versionName", versionName);
            response.put("versionCode", versionCode);
            call.resolve(response);
        } catch (Exception error) {
            call.reject(MESSAGE_UNKNOWN, ERROR_UNKNOWN, error);
        }
    }

    @PluginMethod
    public void canInstallUnknownApps(PluginCall call) {
        try {
            JSObject response = new JSObject();
            response.put("allowed", canInstallUnknownApps());
            call.resolve(response);
        } catch (Exception error) {
            call.reject(MESSAGE_UNKNOWN, ERROR_UNKNOWN, error);
        }
    }

    @PluginMethod
    public void openInstallUnknownAppsSettings(PluginCall call) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
            call.resolve();
            return;
        }

        try {
            openInstallUnknownAppsSettings();
            call.resolve();
        } catch (Exception error) {
            call.reject(MESSAGE_INSTALL_INTENT_FAILED, ERROR_INSTALL_INTENT_FAILED, error);
        }
    }

    @PluginMethod
    public void downloadAndInstallApk(PluginCall call) {
        String apkUrl = trimmedOrNull(call.getString("apkUrl"));
        String expectedSha256 = trimmedOrNull(call.getString("expectedSha256"));
        String fileName = trimmedOrNull(call.getString("fileName"));

        if (apkUrl == null || expectedSha256 == null) {
            call.reject(MESSAGE_INVALID_INPUT, ERROR_INVALID_INPUT);
            return;
        }

        if (fileName == null) {
            fileName = DEFAULT_APK_FILE_NAME;
        }

        if (
            !isSafeFileName(fileName) ||
            !isHttpsUrl(apkUrl) ||
            !isAllowedApkHost(apkUrl)
        ) {
            call.reject(MESSAGE_INVALID_INPUT, ERROR_INVALID_INPUT);
            return;
        }

        String resolvedFileName = fileName;
        try {
            downloadExecutor.execute(
                () -> performDownloadAndInstall(call, apkUrl, expectedSha256, resolvedFileName)
            );
        } catch (Exception error) {
            call.reject(MESSAGE_UNKNOWN, ERROR_UNKNOWN, error);
        }
    }

    private void performDownloadAndInstall(
        PluginCall call,
        String apkUrl,
        String expectedSha256,
        String fileName
    ) {
        File apkFile;
        try {
            apkFile = prepareDownloadFile(fileName);
            downloadApk(apkUrl, apkFile);
        } catch (Exception error) {
            deleteQuietly(resolveDownloadFile(fileName));
            call.reject(MESSAGE_DOWNLOAD_FAILED, ERROR_DOWNLOAD_FAILED, error);
            return;
        }

        try {
            // SHA-256 confirms the downloaded bytes match the update manifest.
            String actualSha256 = calculateSha256(apkFile);
            if (!actualSha256.equalsIgnoreCase(expectedSha256)) {
                deleteQuietly(apkFile);
                call.reject(MESSAGE_SHA256_MISMATCH, ERROR_SHA256_MISMATCH);
                return;
            }
        } catch (IOException | NoSuchAlgorithmException error) {
            deleteQuietly(apkFile);
            call.reject(MESSAGE_UNKNOWN, ERROR_UNKNOWN, error);
            return;
        }

        try {
            // Package name, version code, and optional signer pin verify APK identity
            // before the file is exposed to the Android installer.
            if (!isDownloadedApkIdentityValid(apkFile)) {
                deleteQuietly(apkFile);
                call.reject(MESSAGE_SHA256_MISMATCH, ERROR_SHA256_MISMATCH);
                return;
            }
        } catch (Exception ignored) {
            deleteQuietly(apkFile);
            call.reject(MESSAGE_SHA256_MISMATCH, ERROR_SHA256_MISMATCH);
            return;
        }

        if (!canInstallUnknownApps()) {
            try {
                openInstallUnknownAppsSettings();
                call.reject(
                    MESSAGE_INSTALL_PERMISSION_REQUIRED,
                    ERROR_INSTALL_PERMISSION_REQUIRED
                );
            } catch (Exception error) {
                call.reject(MESSAGE_INSTALL_INTENT_FAILED, ERROR_INSTALL_INTENT_FAILED, error);
            }
            return;
        }

        Uri apkUri;
        try {
            String authority = getContext().getPackageName() + ".fileprovider";
            apkUri = FileProvider.getUriForFile(getContext(), authority, apkFile);
        } catch (Exception error) {
            call.reject(MESSAGE_FILE_PROVIDER_FAILED, ERROR_FILE_PROVIDER_FAILED, error);
            return;
        }

        try {
            Intent intent = new Intent(Intent.ACTION_VIEW);
            intent.setDataAndType(apkUri, "application/vnd.android.package-archive");
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

            if (intent.resolveActivity(getContext().getPackageManager()) == null) {
                call.reject(MESSAGE_INSTALL_INTENT_FAILED, ERROR_INSTALL_INTENT_FAILED);
                return;
            }

            getContext().startActivity(intent);

            JSObject response = new JSObject();
            response.put("status", "installer_opened");
            call.resolve(response);
        } catch (ActivityNotFoundException | SecurityException error) {
            call.reject(MESSAGE_INSTALL_INTENT_FAILED, ERROR_INSTALL_INTENT_FAILED, error);
        } catch (Exception error) {
            call.reject(MESSAGE_UNKNOWN, ERROR_UNKNOWN, error);
        }
    }

    private File prepareDownloadFile(String fileName) throws IOException {
        File directory = new File(getContext().getCacheDir(), DOWNLOAD_DIRECTORY_NAME);
        if (!directory.exists() && !directory.mkdirs()) {
            throw new IOException("Unable to create app update cache directory.");
        }

        File apkFile = new File(directory, fileName);
        String directoryPath = directory.getCanonicalPath();
        String filePath = apkFile.getCanonicalPath();
        if (!filePath.startsWith(directoryPath + File.separator)) {
            throw new IOException("Invalid app update file path.");
        }

        if (apkFile.exists() && !apkFile.delete()) {
            throw new IOException("Unable to replace previous app update file.");
        }

        return apkFile;
    }

    private File resolveDownloadFile(String fileName) {
        return new File(
            new File(getContext().getCacheDir(), DOWNLOAD_DIRECTORY_NAME),
            fileName
        );
    }

    private void downloadApk(String apkUrl, File apkFile) throws IOException {
        HttpURLConnection connection = null;
        try {
            connection = (HttpURLConnection) new URL(apkUrl).openConnection();
            connection.setConnectTimeout(CONNECT_TIMEOUT_MS);
            connection.setReadTimeout(READ_TIMEOUT_MS);
            connection.setInstanceFollowRedirects(true);
            connection.setRequestMethod("GET");
            connection.connect();

            int statusCode = connection.getResponseCode();
            if (statusCode < 200 || statusCode >= 300) {
                throw new IOException("APK download returned HTTP " + statusCode + ".");
            }

            long totalBytes = parseContentLength(connection.getHeaderField("Content-Length"));
            long bytesDownloaded = 0;
            long lastNotifiedBytes = 0;
            int lastNotifiedPercent = -1;

            try (
                InputStream input = new BufferedInputStream(connection.getInputStream());
                OutputStream output = new BufferedOutputStream(new FileOutputStream(apkFile, false))
            ) {
                byte[] buffer = new byte[BUFFER_SIZE];
                int read;
                while ((read = input.read(buffer)) != -1) {
                    output.write(buffer, 0, read);
                    bytesDownloaded += read;

                    int percent = calculateProgressPercent(bytesDownloaded, totalBytes);
                    boolean shouldNotify = totalBytes > 0
                        ? percent != lastNotifiedPercent
                        : bytesDownloaded - lastNotifiedBytes >= UNKNOWN_SIZE_PROGRESS_INTERVAL_BYTES;
                    if (shouldNotify) {
                        emitDownloadProgress(bytesDownloaded, totalBytes, percent);
                        lastNotifiedBytes = bytesDownloaded;
                        lastNotifiedPercent = percent;
                    }
                }
                output.flush();
            }

            int finalPercent = calculateProgressPercent(bytesDownloaded, totalBytes);
            if (bytesDownloaded != lastNotifiedBytes || finalPercent != lastNotifiedPercent) {
                emitDownloadProgress(bytesDownloaded, totalBytes, finalPercent);
            }
        } finally {
            if (connection != null) {
                connection.disconnect();
            }
        }
    }

    private void emitDownloadProgress(long bytesDownloaded, long totalBytes, int percent) {
        JSObject progress = new JSObject();
        progress.put("bytesDownloaded", bytesDownloaded);
        progress.put("totalBytes", totalBytes);
        progress.put("percent", percent);
        notifyListeners(DOWNLOAD_PROGRESS_EVENT, progress);
    }

    private String calculateSha256(File file) throws IOException, NoSuchAlgorithmException {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        try (InputStream input = new BufferedInputStream(new FileInputStream(file))) {
            byte[] buffer = new byte[BUFFER_SIZE];
            int read;
            while ((read = input.read(buffer)) != -1) {
                digest.update(buffer, 0, read);
            }
        }

        StringBuilder hex = new StringBuilder();
        for (byte value : digest.digest()) {
            hex.append(String.format(Locale.US, "%02x", value & 0xff));
        }
        return hex.toString();
    }

    private boolean isDownloadedApkIdentityValid(File apkFile)
        throws PackageManager.NameNotFoundException, NoSuchAlgorithmException {
        PackageManager packageManager = getContext().getPackageManager();
        int archiveFlags = Build.VERSION.SDK_INT >= Build.VERSION_CODES.P
            ? PackageManager.GET_SIGNING_CERTIFICATES
            : PackageManager.GET_SIGNATURES;
        PackageInfo downloadedPackage = packageManager.getPackageArchiveInfo(
            apkFile.getAbsolutePath(),
            archiveFlags
        );

        if (
            downloadedPackage == null ||
            !getContext().getPackageName().equals(downloadedPackage.packageName)
        ) {
            return false;
        }

        PackageInfo currentPackage = packageManager.getPackageInfo(
            getContext().getPackageName(),
            0
        );
        if (getVersionCode(downloadedPackage) <= getVersionCode(currentPackage)) {
            return false;
        }

        String expectedFingerprint = getExpectedSigningCertificateSha256();
        if (expectedFingerprint == null) {
            // Certificate pinning is intentionally skipped until a real release fingerprint
            // is supplied through BuildConfig.APP_UPDATE_SIGNING_CERT_SHA256.
            return true;
        }

        Signature[] signatures = getApkSignatures(downloadedPackage);
        if (signatures == null || signatures.length != 1) {
            return false;
        }

        String actualFingerprint = calculateSigningCertificateSha256(signatures[0]);
        return normalizeSha256Fingerprint(expectedFingerprint).equals(actualFingerprint);
    }

    @SuppressWarnings("deprecation")
    private long getVersionCode(PackageInfo packageInfo) {
        return Build.VERSION.SDK_INT >= Build.VERSION_CODES.P
            ? packageInfo.getLongVersionCode()
            : packageInfo.versionCode;
    }

    @SuppressWarnings("deprecation")
    private Signature[] getApkSignatures(PackageInfo packageInfo) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            return packageInfo.signingInfo != null
                ? packageInfo.signingInfo.getApkContentsSigners()
                : null;
        }

        return packageInfo.signatures;
    }

    private String calculateSigningCertificateSha256(Signature signature)
        throws NoSuchAlgorithmException {
        byte[] fingerprint = MessageDigest
            .getInstance("SHA-256")
            .digest(signature.toByteArray());
        StringBuilder hex = new StringBuilder(fingerprint.length * 2);
        for (byte value : fingerprint) {
            hex.append(String.format(Locale.US, "%02x", value & 0xff));
        }
        return hex.toString();
    }

    private String getExpectedSigningCertificateSha256() {
        try {
            Class<?> buildConfig = Class.forName(
                getContext().getPackageName() + ".BuildConfig"
            );
            Object value = buildConfig
                .getField(SIGNING_CERT_BUILD_CONFIG_FIELD)
                .get(null);
            return value instanceof String ? trimmedOrNull((String) value) : null;
        } catch (ReflectiveOperationException | SecurityException ignored) {
            return null;
        }
    }

    private String normalizeSha256Fingerprint(String fingerprint) {
        return fingerprint
            .replace(":", "")
            .replaceAll("\\s+", "")
            .toLowerCase(Locale.US);
    }

    private boolean canInstallUnknownApps() {
        return Build.VERSION.SDK_INT < Build.VERSION_CODES.O ||
            getContext().getPackageManager().canRequestPackageInstalls();
    }

    private void openInstallUnknownAppsSettings() {
        Intent intent = new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES);
        intent.setData(Uri.parse("package:" + getContext().getPackageName()));
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        getContext().startActivity(intent);
    }

    private long parseContentLength(String rawValue) {
        if (rawValue == null) {
            return -1;
        }

        try {
            long value = Long.parseLong(rawValue);
            return value >= 0 ? value : -1;
        } catch (NumberFormatException ignored) {
            return -1;
        }
    }

    private int calculateProgressPercent(long bytesDownloaded, long totalBytes) {
        if (totalBytes <= 0) {
            return -1;
        }

        return (int) Math.min(100, Math.floor((bytesDownloaded * 100.0) / totalBytes));
    }

    private String trimmedOrNull(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private boolean isSafeFileName(String fileName) {
        return !fileName.equals(".") &&
            !fileName.equals("..") &&
            !fileName.contains("/") &&
            !fileName.contains("\\");
    }

    private boolean isHttpsUrl(String rawUrl) {
        try {
            String protocol = new URL(rawUrl).getProtocol();
            return "https".equalsIgnoreCase(protocol);
        } catch (Exception ignored) {
            return false;
        }
    }

    private boolean isAllowedApkHost(String rawUrl) {
        try {
            String host = new URL(rawUrl).getHost();
            return ALLOWED_APK_HOSTS.contains(host.toLowerCase(Locale.US));
        } catch (Exception ignored) {
            return false;
        }
    }

    private void deleteQuietly(File file) {
        if (file != null && file.exists()) {
            file.delete();
        }
    }

    @Override
    protected void handleOnDestroy() {
        downloadExecutor.shutdownNow();
        super.handleOnDestroy();
    }
}
