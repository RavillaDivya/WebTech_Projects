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

public class RecommendationService {

    Context context;
    JSONObject return_response = new JSONObject();

    public RecommendationService(Context context) {
        this.context = context;
    }

    public interface VolleyResponseListener {
        void onError(String message);
        void onResponse(JSONObject details) throws JSONException;
    }

    public void get_Details(String name,final RecommendationService.VolleyResponseListener volleyResponseListener) {

        String url = "https://finnhub.io/api/v1/stock/recommendation?symbol="+name+"&token=c87eusqad3i9lkntmfhg";
        StringRequest stringRequest = new StringRequest(Request.Method.GET, url,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        try {
                            JSONArray details_response = new JSONArray(response);
                            ArrayList<String> period = new ArrayList<>();
                            ArrayList<Integer> buy = new ArrayList<>();
                            ArrayList<Integer> hold = new ArrayList<>();
                            ArrayList<Integer> sell = new ArrayList<>();
                            ArrayList<Integer> strongBuy = new ArrayList<>();
                            ArrayList<Integer> strongSell = new ArrayList<>();
                            System.out.println("Recommendation:"+details_response);

                            for(int i=0; i<details_response.length(); i++) {
                                period.add("\""+details_response.getJSONObject(i).getString("period")+"\"");
                                buy.add(Integer.parseInt(details_response.getJSONObject(i).getString("buy")));
                                hold.add(Integer.parseInt(details_response.getJSONObject(i).getString("hold")));
                                sell.add(Integer.parseInt(details_response.getJSONObject(i).getString("sell")));
                                strongBuy.add(Integer.parseInt(details_response.getJSONObject(i).getString("strongBuy")));
                                strongSell.add(Integer.parseInt(details_response.getJSONObject(i).getString("strongSell")));
                            }
                            return_response.put("period", period);
                            return_response.put("buy", buy);
                            return_response.put("hold", hold);
                            return_response.put("sell", sell);
                            return_response.put("strongBuy", strongBuy);
                            return_response.put("strongSell", strongSell);

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
