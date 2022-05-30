package com.example.stocks;

import android.content.Context;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;

import org.json.JSONArray;
import org.json.JSONException;

import java.time.LocalDate;
import java.time.ZoneId;

public class NewsService {
    Context context;
    JSONArray details_response;

    public NewsService(Context context) {
        this.context = context;
    }

    public interface VolleyResponseListener {
        void onError(String message);
        void onResponse(JSONArray details) throws JSONException;
    }

    public void get_Details(String name,final NewsService.VolleyResponseListener volleyResponseListener) {

        String to_date = "";
        ZoneId zonedId = ZoneId.of( "America/Montreal" );
        LocalDate today = LocalDate.now( zonedId );
//        System.out.println( "today : " + today );
        String url = "https://finnhub.io/api/v1/company-news?symbol="+name+"&from=2022-03-15&to="+to_date+"&token=c87eusqad3i9lkntmfhg";
        StringRequest stringRequest = new StringRequest(Request.Method.GET, url,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        try {
                            details_response = new JSONArray(response);
                            System.out.println("News"+details_response);
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
