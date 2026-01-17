package com.setelivramentos.toque;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.setelivramentos.toque.plugins.RingtonePlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(RingtonePlugin.class);
        super.onCreate(savedInstanceState);
    }
}
