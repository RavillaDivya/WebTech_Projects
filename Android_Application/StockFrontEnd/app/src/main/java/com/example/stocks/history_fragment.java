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
import org.w3c.dom.Text;

public class history_fragment extends Fragment {

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.history_chart, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        CompanyActivity companyActivity = new CompanyActivity();
        //String name = name = "TSLA";
        String ticker = SharedPreferencesSingleton.getInstance(getActivity().getApplicationContext()).get_name();
        String[] split = ticker.split("\\s+");
        String name = split[0];
        Context context = getActivity();
        HistoryService historyService = new HistoryService(context);
        historyService.get_Details(name, new HistoryService.VolleyResponseListener() {
            @Override
            public void onError(String message) {
                Toast.makeText(context, message, Toast.LENGTH_SHORT).show();
            }

            @SuppressLint("JavascriptInterface")
            @Override
            public void onResponse(JSONObject details) {
                WebView webView = (WebView) view.findViewById(R.id.history_chart);
                webView.getSettings().setJavaScriptEnabled(true);
                WebSettings settings = webView.getSettings();
                settings.setDomStorageEnabled(true);
                webView.setWebViewClient(new WebViewClient());
                webView.addJavascriptInterface(new intermediate_interface(details), "Sick_3");
                webView.loadUrl("file:///android_asset/historychart.html");
            }
        });

        Log.d("history", "Created");


    }
}
