package com.setelivramentos.toque.plugins;

import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;
import android.provider.Settings;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

@CapacitorPlugin(name = "Ringtone")
public class RingtonePlugin extends Plugin {

    private static final int WRITE_SETTINGS_REQUEST = 1001;

    @PluginMethod
    public void isNativeAndroid(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("isNative", true);
        call.resolve(ret);
    }

    @PluginMethod
    public void checkPermission(PluginCall call) {
        JSObject ret = new JSObject();
        boolean hasPermission = Settings.System.canWrite(getContext());
        ret.put("granted", hasPermission);
        call.resolve(ret);
    }

    @PluginMethod
    public void requestPermission(PluginCall call) {
        if (Settings.System.canWrite(getContext())) {
            JSObject ret = new JSObject();
            ret.put("granted", true);
            call.resolve(ret);
            return;
        }

        // Open settings to allow the user to grant permission
        Intent intent = new Intent(Settings.ACTION_MANAGE_WRITE_SETTINGS);
        intent.setData(Uri.parse("package:" + getContext().getPackageName()));
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        getContext().startActivity(intent);

        // We can't know immediately if the user granted permission
        // The app needs to check again after the user returns
        JSObject ret = new JSObject();
        ret.put("granted", false);
        call.resolve(ret);
    }

    @PluginMethod
    public void setRingtone(PluginCall call) {
        String fileName = call.getString("fileName");
        String title = call.getString("title", "Ringtone");
        String artist = call.getString("artist", "");

        if (fileName == null || fileName.isEmpty()) {
            JSObject ret = new JSObject();
            ret.put("success", false);
            ret.put("message", "Nome do arquivo não fornecido");
            call.resolve(ret);
            return;
        }

        // Check permission
        if (!Settings.System.canWrite(getContext())) {
            JSObject ret = new JSObject();
            ret.put("success", false);
            ret.put("message", "Permissão necessária para modificar configurações do sistema");
            call.resolve(ret);
            return;
        }

        try {
            Context context = getContext();
            
            // Copy the asset to the ringtones directory
            Uri ringtoneUri = copyAssetToRingtones(context, fileName, title, artist);
            
            if (ringtoneUri != null) {
                // Set as the default ringtone
                RingtoneManager.setActualDefaultRingtoneUri(
                    context, 
                    RingtoneManager.TYPE_RINGTONE, 
                    ringtoneUri
                );

                JSObject ret = new JSObject();
                ret.put("success", true);
                ret.put("message", "Toque definido com sucesso!");
                call.resolve(ret);
            } else {
                JSObject ret = new JSObject();
                ret.put("success", false);
                ret.put("message", "Erro ao copiar arquivo de áudio");
                call.resolve(ret);
            }
        } catch (Exception e) {
            JSObject ret = new JSObject();
            ret.put("success", false);
            ret.put("message", "Erro: " + e.getMessage());
            call.resolve(ret);
        }
    }

    private Uri copyAssetToRingtones(Context context, String fileName, String title, String artist) {
        try {
            // Try to get the file from assets first
            InputStream inputStream = null;
            
            try {
                // Try public folder path
                inputStream = context.getAssets().open("public/" + fileName);
            } catch (IOException e) {
                try {
                    // Try root assets
                    inputStream = context.getAssets().open(fileName);
                } catch (IOException e2) {
                    // File not found
                    return null;
                }
            }

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                // Android 10+ uses MediaStore
                return copyToMediaStore(context, inputStream, fileName, title, artist);
            } else {
                // Older Android versions use file system
                return copyToFileSystem(context, inputStream, fileName, title, artist);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private Uri copyToMediaStore(Context context, InputStream inputStream, String fileName, String title, String artist) {
        try {
            ContentResolver resolver = context.getContentResolver();
            
            ContentValues values = new ContentValues();
            values.put(MediaStore.Audio.Media.DISPLAY_NAME, fileName);
            values.put(MediaStore.Audio.Media.TITLE, title);
            values.put(MediaStore.Audio.Media.ARTIST, artist);
            values.put(MediaStore.Audio.Media.MIME_TYPE, "audio/mpeg");
            values.put(MediaStore.Audio.Media.IS_RINGTONE, true);
            values.put(MediaStore.Audio.Media.IS_NOTIFICATION, false);
            values.put(MediaStore.Audio.Media.IS_ALARM, false);
            values.put(MediaStore.Audio.Media.IS_MUSIC, false);
            
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                values.put(MediaStore.Audio.Media.RELATIVE_PATH, Environment.DIRECTORY_RINGTONES);
            }

            // Delete existing file with same name if exists
            String selection = MediaStore.Audio.Media.DISPLAY_NAME + "=?";
            String[] selectionArgs = new String[]{ fileName };
            resolver.delete(MediaStore.Audio.Media.EXTERNAL_CONTENT_URI, selection, selectionArgs);

            Uri uri = resolver.insert(MediaStore.Audio.Media.EXTERNAL_CONTENT_URI, values);
            
            if (uri != null) {
                OutputStream outputStream = resolver.openOutputStream(uri);
                if (outputStream != null) {
                    byte[] buffer = new byte[4096];
                    int bytesRead;
                    while ((bytesRead = inputStream.read(buffer)) != -1) {
                        outputStream.write(buffer, 0, bytesRead);
                    }
                    outputStream.close();
                    inputStream.close();
                    return uri;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    private Uri copyToFileSystem(Context context, InputStream inputStream, String fileName, String title, String artist) {
        try {
            File ringtoneDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_RINGTONES);
            if (!ringtoneDir.exists()) {
                ringtoneDir.mkdirs();
            }

            File outputFile = new File(ringtoneDir, fileName);
            
            FileOutputStream outputStream = new FileOutputStream(outputFile);
            byte[] buffer = new byte[4096];
            int bytesRead;
            while ((bytesRead = inputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, bytesRead);
            }
            outputStream.close();
            inputStream.close();

            // Register in MediaStore
            ContentValues values = new ContentValues();
            values.put(MediaStore.Audio.Media.DATA, outputFile.getAbsolutePath());
            values.put(MediaStore.Audio.Media.TITLE, title);
            values.put(MediaStore.Audio.Media.ARTIST, artist);
            values.put(MediaStore.Audio.Media.MIME_TYPE, "audio/mpeg");
            values.put(MediaStore.Audio.Media.IS_RINGTONE, true);
            values.put(MediaStore.Audio.Media.IS_NOTIFICATION, false);
            values.put(MediaStore.Audio.Media.IS_ALARM, false);
            values.put(MediaStore.Audio.Media.IS_MUSIC, false);

            ContentResolver resolver = context.getContentResolver();
            Uri uri = resolver.insert(MediaStore.Audio.Media.EXTERNAL_CONTENT_URI, values);
            
            return uri != null ? uri : Uri.fromFile(outputFile);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
