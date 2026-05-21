package com.taixiucanhan.app;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;

import androidx.activity.result.ActivityResult;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

@CapacitorPlugin(name = "DocumentSaver")
public class DocumentSaverPlugin extends Plugin {
    @PluginMethod
    public void saveTextFile(PluginCall call) {
        String fileName = call.getString("fileName");
        String content = call.getString("content");
        String mimeType = call.getString("mimeType", "application/octet-stream");

        if (fileName == null || fileName.trim().isEmpty()) {
            call.reject("File name is required.");
            return;
        }

        if (content == null) {
            call.reject("File content is required.");
            return;
        }

        Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType(mimeType);
        intent.putExtra(Intent.EXTRA_TITLE, fileName);

        startActivityForResult(call, intent, "saveTextFileResult");
    }

    @ActivityCallback
    private void saveTextFileResult(PluginCall call, ActivityResult result) {
        if (call == null) {
            return;
        }

        if (result.getResultCode() != Activity.RESULT_OK) {
            JSObject response = new JSObject();
            response.put("saved", false);
            call.resolve(response);
            return;
        }

        Intent data = result.getData();
        Uri uri = data != null ? data.getData() : null;
        String content = call.getString("content");

        if (uri == null || content == null) {
            call.reject("No destination file was selected.");
            return;
        }

        try (OutputStream outputStream = getContext().getContentResolver().openOutputStream(uri, "wt")) {
            if (outputStream == null) {
                call.reject("Unable to open selected file.");
                return;
            }

            outputStream.write(content.getBytes(StandardCharsets.UTF_8));
            outputStream.flush();

            JSObject response = new JSObject();
            response.put("saved", true);
            response.put("uri", uri.toString());
            call.resolve(response);
        } catch (Exception error) {
            call.reject("Unable to save file.", error);
        }
    }
}
