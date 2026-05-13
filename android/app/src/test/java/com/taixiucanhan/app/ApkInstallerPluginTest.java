package com.taixiucanhan.app;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import android.os.Build;

import com.getcapacitor.JSObject;
import com.getcapacitor.PluginCall;

import java.io.File;
import java.io.IOException;

import org.junit.Test;

public class ApkInstallerPluginTest {
    @Test
    public void checkInstallPermissionGrantsBeforeAndroidO() {
        ApkInstallerPlugin plugin = new TestApkInstallerPlugin(Build.VERSION_CODES.O - 1, false);
        TestPluginCall call = new TestPluginCall(null);

        plugin.checkInstallPermission(call);

        assertTrue(call.resolved);
        assertFalse(call.rejected);
        assertTrue(call.resolveData.getBool("granted"));
    }

    @Test
    public void checkInstallPermissionGrantsWhenPackageInstallsAllowed() {
        ApkInstallerPlugin plugin = new TestApkInstallerPlugin(Build.VERSION_CODES.O, true);
        TestPluginCall call = new TestPluginCall(null);

        plugin.checkInstallPermission(call);

        assertTrue(call.resolved);
        assertFalse(call.rejected);
        assertTrue(call.resolveData.getBool("granted"));
    }

    @Test
    public void checkInstallPermissionDeniesWhenPackageInstallsNotAllowed() {
        ApkInstallerPlugin plugin = new TestApkInstallerPlugin(Build.VERSION_CODES.O, false);
        TestPluginCall call = new TestPluginCall(null);

        plugin.checkInstallPermission(call);

        assertTrue(call.resolved);
        assertFalse(call.rejected);
        assertFalse(call.resolveData.getBool("granted"));
    }

    @Test
    public void installApkRejectsMissingFilePath() {
        ApkInstallerPlugin plugin = new ApkInstallerPlugin();
        TestPluginCall call = new TestPluginCall(null);

        plugin.installApk(call);

        assertTrue(call.rejected);
        assertFalse(call.resolved);
        assertEquals("filePath is required", call.rejectMessage);
    }

    @Test
    public void installApkRejectsNonExistingFile() {
        ApkInstallerPlugin plugin = new ApkInstallerPlugin();
        TestPluginCall call = new TestPluginCall("/tmp/not-found.apk");

        plugin.installApk(call);

        assertTrue(call.rejected);
        assertFalse(call.resolved);
        assertEquals("APK file does not exist", call.rejectMessage);
    }

    @Test
    public void installApkRejectsWhenInstallPermissionIsNotGranted() throws IOException {
        File apkFile = File.createTempFile("update", ".apk");
        ApkInstallerPlugin plugin = new TestApkInstallerPlugin(Build.VERSION_CODES.O, false);
        TestPluginCall call = new TestPluginCall(apkFile.getAbsolutePath());

        try {
            plugin.installApk(call);
        } finally {
            apkFile.delete();
        }

        assertTrue(call.rejected);
        assertFalse(call.resolved);
        assertEquals(
                "Install permission not granted. Call requestInstallPermission() first.",
                call.rejectMessage
        );
    }

    private static class TestApkInstallerPlugin extends ApkInstallerPlugin {
        private final int sdkInt;
        private final boolean canRequestPackageInstalls;

        TestApkInstallerPlugin(int sdkInt, boolean canRequestPackageInstalls) {
            this.sdkInt = sdkInt;
            this.canRequestPackageInstalls = canRequestPackageInstalls;
        }

        @Override
        protected int getSdkInt() {
            return sdkInt;
        }

        @Override
        protected boolean isInstallPermissionGranted() {
            if (getSdkInt() < Build.VERSION_CODES.O) {
                return true;
            }
            return canRequestPackageInstalls;
        }
    }

    private static class TestPluginCall extends PluginCall {
        private boolean resolved = false;
        private boolean rejected = false;
        private String rejectMessage = "";
        private JSObject resolveData = new JSObject();
        private final String filePath;

        TestPluginCall(String filePath) {
            super(null, "ApkInstaller", "test-callback", "installApk", new JSObject());
            this.filePath = filePath;
        }

        @Override
        public String getString(String name) {
            if ("filePath".equals(name)) {
                return filePath;
            }
            return null;
        }

        @Override
        public void resolve(JSObject data) {
            resolved = true;
            resolveData = data;
        }

        @Override
        public void resolve() {
            resolved = true;
        }

        @Override
        public void reject(String msg) {
            rejected = true;
            rejectMessage = msg;
        }

        @Override
        public void reject(String msg, Exception ex) {
            rejected = true;
            rejectMessage = msg;
        }
    }
}
