package com.example.stocks;

import android.content.Context;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class EarningsService {

    Context context;
    JSONArray details_response;
    JSONObject return_response = new JSONObject();

    public EarningsService(Context context) {
        this.context = context;
    }

    public interface VolleyResponseListener {
        void onError(String message);
        void onResponse(JSONObject details) throws JSONException;
    }

    public Float validate(String f) {
        if(f == "null")
            return 0.0f;
        else {
            return Float.parseFloat(f);
        }
    }

    public void get_Details(String name,final EarningsService.VolleyResponseListener volleyResponseListener) {

        //String url = "https://finnhub.io/api/v1/stock/earnings?symbol="+name+"&token=c87eusqad3i9lkntmfhg";
        String url = "https://myproject-34251.wl.r.appspot.com/api/earnings?symbol="+name;
        StringRequest stringRequest = new StringRequest(Request.Method.GET, url,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        try {
                            details_response = new JSONArray(response);
                            System.out.println("earnings:"+details_response);

                            ArrayList<String> period = new ArrayList<>();
                            ArrayList<Float> actual = new ArrayList<>();
                            ArrayList<Float> estimate = new ArrayList<>();
                            ArrayList<Float> surprise = new ArrayList<>();

                            //System.out.println(details_response.getJSONObject(0).getString("actual"));
                            for(int i=0; i<details_response.length(); i++) {
                                actual.add(validate(details_response.getJSONObject(i).getString("actual")));
                                estimate.add(validate(details_response.getJSONObject(i).getString("estimate")));
                                surprise.add(validate(details_response.getJSONObject(i).getString("surprise")));
                                period.add("\""+details_response.getJSONObject(i).getString("period")+"\"");
                            }

                            return_response.put("period", period);
                            return_response.put("actual", actual);
                            return_response.put("surprise", surprise);
                            return_response.put("estimate", estimate);

                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                        try {
                            volleyResponseListener.onResponse(return_response);
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
