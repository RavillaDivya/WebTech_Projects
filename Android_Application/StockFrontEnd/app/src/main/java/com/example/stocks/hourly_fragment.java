package com.example.stocks;

import android.annotation.SuppressLint;
import android.content.Context;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import org.json.JSONObject;

public class hourly_fragment extends Fragment {

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.hourly_chart, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        //String name = "TSLA";
        String ticker = SharedPreferencesSingleton.getInstance(getActivity().getApplicationContext()).get_name();
        String[] split = ticker.split("\\s+");
        String name = split[0];
        //receive ticker and context in bundle
        //ompanyActivity companyActivity = new CompanyActivity();
        //String name = companyActivity.get_ticker();
        Context context = getActivity();

        HourlyService hourlyService = new HourlyService(context);
        hourlyService.get_Details(name, new HourlyService.VolleyResponseListener() {
            @Override
            public void onError(String message) {
                Toast.makeText(context, message, Toast.LENGTH_SHORT).show();
            }

            @SuppressLint("JavascriptInterface")
            @Override
            public void onResponse(JSONObject details) {
                WebView webView = (WebView) view.findViewById(R.id.hourly_chart);
                webView = (WebView) view.findViewById(R.id.hourly_chart);
                webView.getSettings().setJavaScriptEnabled(true);
                WebSettings settings = webView.getSettings();
                settings.setDomStorageEnabled(true);
                webView.setWebViewClient(new WebViewClient());
                webView.addJavascriptInterface(new intermediate_interface(details), "Sick_4");
                webView.loadUrl("file:///android_asset/hourlychart.html");
            }
        });

        Log.d("hourly", "Created");

    }

}
