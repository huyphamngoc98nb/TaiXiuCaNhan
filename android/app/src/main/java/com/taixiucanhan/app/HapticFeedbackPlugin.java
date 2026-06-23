package com.taixiucanhan.app;

import android.content.Context;
import android.os.Build;
import android.os.VibrationEffect;
import android.os.Vibrator;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "HapticFeedback")
public class HapticFeedbackPlugin extends Plugin {
    @PluginMethod
    public void vibrate(PluginCall call) {
        int duration = call.getInt("duration", 15);

        if (duration <= 0) {
            call.reject("Duration must be greater than 0.");
            return;
        }

        Vibrator vibrator = (Vibrator) getContext().getSystemService(Context.VIBRATOR_SERVICE);
        if (vibrator == null || !vibrator.hasVibrator()) {
            JSObject response = new JSObject();
            response.put("vibrated", false);
            call.resolve(response);
            return;
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            vibrator.vibrate(VibrationEffect.createOneShot(duration, VibrationEffect.DEFAULT_AMPLITUDE));
        } else {
            vibrator.vibrate(duration);
        }

        JSObject response = new JSObject();
        response.put("vibrated", true);
        call.resolve(response);
    }
}
