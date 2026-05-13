package com.taixiucanhan.app;

import android.content.Intent;
import android.net.Uri;

import androidx.core.content.FileProvider;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.File;

@CapacitorPlugin(name = "ApkInstaller")
public class ApkInstallerPlugin extends Plugin {
    private static final String APK_MIME_TYPE = "application/vnd.android.package-archive";

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

    private String normalizeFilePath(String filePath) {
        String trimmedPath = filePath.trim();
        if (trimmedPath.startsWith("file://")) {
            return trimmedPath.substring("file://".length());
        }
        return trimmedPath;
    }
}
