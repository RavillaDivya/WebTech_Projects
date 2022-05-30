package com.example.stocks;

import android.content.Context;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class PeersService {

    Context context;
    JSONArray details_response;

    public PeersService(Context context) {
        this.context = context;
    }

    public interface VolleyResponseListener {
        void onError(String message);
        void onResponse(JSONArray details) throws JSONException;
    }

    public void get_Details(String name,final PeersService.VolleyResponseListener volleyResponseListener) {

        String url = "https://finnhub.io/api/v1/stock/peers?symbol="+name+"&token=c87eusqad3i9lkntmfhg";
        StringRequest stringRequest = new StringRequest(Request.Method.GET, url,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        try {
                            details_response = new JSONArray(response);
                            System.out.println("Peer_details"+details_response);
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
