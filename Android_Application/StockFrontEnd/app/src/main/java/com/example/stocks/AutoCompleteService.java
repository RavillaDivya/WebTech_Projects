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

public class AutoCompleteService {

    Context context;
    ArrayList<String> new_list = new ArrayList<String>();

    public AutoCompleteService(Context context) {
        this.context = context;
    }

    public interface VolleyResponseListener {
        void onError(String message);
        void onResponse(ArrayList<String> new_list);
    }

    public void get_List(String newText,final VolleyResponseListener volleyResponseListener) {

        String url = "https://finnhub.io/api/v1/search?q=" + newText + "&token=c87eusqad3i9lkntmfhg";
        StringRequest stringRequest = new StringRequest(Request.Method.GET, url,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        try {
                            JSONObject suggestion_response = new JSONObject(response);
//                            System.out.println("Suggestions"+suggestion_response);
                            int n = Integer.parseInt(suggestion_response.getString("count"));
                            for (int i = 0; i < n; i++) {
                                JSONArray suggestions = suggestion_response.getJSONArray("result");
                                JSONObject company = suggestions.getJSONObject(i);
                                String pipe_name = company.getString("displaySymbol") + " | " + company.getString("description");
                                new_list.add(pipe_name);
                            }
//                            System.out.println(new_list);
//                            .getString("country")
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                        volleyResponseListener.onResponse(new_list);
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
