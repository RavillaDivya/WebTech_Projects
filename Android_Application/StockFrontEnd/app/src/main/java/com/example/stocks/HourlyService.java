package com.example.stocks;

import android.content.Context;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;

import org.json.JSONException;
import org.json.JSONObject;

import java.time.Instant;
import java.util.Calendar;

public class HourlyService {

    Context context;
    JSONObject details_response;

    public HourlyService(Context context) {
        this.context = context;
    }

    public interface VolleyResponseListener {
        void onError(String message);
        void onResponse(JSONObject details) throws JSONException;
    }

    public void get_Details(String name,final HourlyService.VolleyResponseListener volleyResponseListener) {
        long to_date = Instant.now().getEpochSecond();
        long from_date = to_date-(6*3600);

        String url = "https://finnhub.io/api/v1/stock/candle?symbol="+name+"&resolution=5&from="+ from_date
                +"&to="+to_date+"&token=c87eusqad3i9lkntmfhg";
        StringRequest stringRequest = new StringRequest(Request.Method.GET, url,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        try {
                            details_response = new JSONObject(response);
                            details_response.put("s", name);
                            System.out.println("Hourly"+details_response);
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                        try {
                            volleyResponseListener.onResponse(details_response);
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                //System.out.println(error);
                volleyResponseListener.onError("Search query http response error");
            }
        });
        RequestSingleton.getInstance(context).addToRequestQueue(stringRequest);
    }

}
