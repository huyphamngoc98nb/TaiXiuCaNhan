package com.taixiucanhan.app;

import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;

import androidx.activity.result.ActivityResult;
import androidx.core.content.FileProvider;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.File;

@CapacitorPlugin(name = "ApkInstaller")
public class ApkInstallerPlugin extends Plugin {
    private static final String APK_MIME_TYPE = "application/vnd.android.package-archive";
    private static final String INSTALL_PERMISSION_REJECT_MESSAGE =
            "Install permission not granted. Call requestInstallPermission() first.";

    @PluginMethod
    public void checkInstallPermission(PluginCall call) {
        call.resolve(createPermissionResult(isInstallPermissionGranted()));
    }

    @PluginMethod
    public void requestInstallPermission(PluginCall call) {
        if (isInstallPermissionGranted()) {
            call.resolve(createPermissionResult(true));
            return;
        }

        Intent intent = new Intent(
                Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,
                Uri.parse("package:" + getContext().getPackageName())
        );

        try {
            startActivityForResult(call, intent, "handleInstallPermissionResult");
        } catch (Exception exception) {
            call.reject("Failed to open install permission settings", exception);
        }
    }

    @ActivityCallback
    private void handleInstallPermissionResult(PluginCall call, ActivityResult result) {
        call.resolve(createPermissionResult(isInstallPermissionGranted()));
    }

    @PluginMethod
    public void installApk(PluginCall call) {
        String rawFilePath = call.getString("filePath");

        if (rawFilePath == null || rawFilePath.trim().isEmpty()) {
            call.reject("filePath is required");
            return;
        }

        String filePath = normalizeFilePath(rawFilePath);
        if (!filePath.toLowerCase().endsWith(".apk")) {
            call.reject("filePath must point to an APK file");
            return;
        }

        File apkFile = new File(filePath);
        if (!apkFile.exists() || !apkFile.isFile()) {
            call.reject("APK file does not exist");
            return;
        }

        if (!isInstallPermissionGranted()) {
            call.reject(INSTALL_PERMISSION_REJECT_MESSAGE);
            return;
        }

        try {
            String authority = getContext().getPackageName() + ".fileprovider";
            Uri apkUri = FileProvider.getUriForFile(getContext(), authority, apkFile);

            Intent intent = new Intent(Intent.ACTION_VIEW);
            intent.setDataAndType(apkUri, APK_MIME_TYPE);
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

            if (intent.resolveActivity(getContext().getPackageManager()) == null) {
                call.reject("No activity found to install APK");
                return;
            }

            getContext().startActivity(intent);
            call.resolve(new JSObject());
        } catch (Exception exception) {
            call.reject("Failed to open APK installer", exception);
        }
    }

    protected boolean isInstallPermissionGranted() {
        if (getSdkInt() < Build.VERSION_CODES.O) {
            return true;
        }

        PackageManager packageManager = getContext().getPackageManager();
        return packageManager.canRequestPackageInstalls();
    }

    protected int getSdkInt() {
        return Build.VERSION.SDK_INT;
    }

    private JSObject createPermissionResult(boolean granted) {
        JSObject result = new JSObject();
        result.put("granted", granted);
        return result;
    }

    private String normalizeFilePath(String filePath) {
        String trimmedPath = filePath.trim();
        if (trimmedPath.startsWith("file://")) {
            return trimmedPath.substring("file://".length());
        }
        return trimmedPath;
    }
}
