package com.example.stocks;

import android.webkit.JavascriptInterface;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Arrays;

public class intermediate_interface {
    String someData;
    intermediate_interface( JSONObject details) {
        this.someData = details.toString();
    }
    @JavascriptInterface
    public String getData() {
        return someData;
    }
}
