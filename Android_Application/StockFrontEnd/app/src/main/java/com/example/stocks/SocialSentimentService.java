package com.example.stocks;

import android.content.Context;
import android.content.Intent;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.lang.reflect.Array;
import java.util.ArrayList;

public class SocialSentimentService {

    Context context;
    int[] details = new int[6];

    public SocialSentimentService(Context context) {
        this.context = context;
    }

    public interface VolleyResponseListener {
        void onError(String message);
        void onResponse(int[] details);
    }

    public void get_Details(String name,final SocialSentimentService.VolleyResponseListener volleyResponseListener) {

        String url = "https://finnhub.io/api/v1/stock/social-sentiment?symbol="+name+"&from=2022-01- 01&token=c87eusqad3i9lkntmfhg";
        StringRequest stringRequest = new StringRequest(Request.Method.GET, url,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        try {
                            JSONObject details_response = new JSONObject(response);
                            System.out.println("Sentiment_Details"+details_response);

                            JSONArray reddit_data = details_response.getJSONArray("reddit");
                            JSONArray twitter_data = details_response.getJSONArray("twitter");

                            String temp;
                            for (int i=0; i<reddit_data.length(); i++) {
                                if(reddit_data.getJSONObject(i).has("mention") && reddit_data.getJSONObject(i).getString("mention") != null)
                                    details[0] += Integer.parseInt(reddit_data.getJSONObject(i).getString("mention"));
                                if(reddit_data.getJSONObject(i).has("positiveMention") && reddit_data.getJSONObject(i).getString("positiveMention") != null)
                                    details[1] += Integer.parseInt(reddit_data.getJSONObject(i).getString("positiveMention"));
                                if(reddit_data.getJSONObject(i).has("negativeMention") && reddit_data.getJSONObject(i).getString("negativeMention") != null)
                                    details[2] += Integer.parseInt(reddit_data.getJSONObject(i).getString("negativeMention"));
                            }

                            for (int i=0; i<twitter_data.length(); i++) {
                                if(twitter_data.getJSONObject(i).has("mention") && twitter_data.getJSONObject(i).getString("mention") != "null")
                                    details[3] += Integer.parseInt(twitter_data.getJSONObject(i).getString("mention"));
                                if(twitter_data.getJSONObject(i).has("positiveMention") && twitter_data.getJSONObject(i).getString("positiveMention") != "null")
                                    details[4] += Integer.parseInt(twitter_data.getJSONObject(i).getString("positiveMention"));
                                if(twitter_data.getJSONObject(i).has("negativeMention") && twitter_data.getJSONObject(i).getString("negativeMention") != "null")
                                    details[5] += Integer.parseInt(twitter_data.getJSONObject(i).getString("negativeMention"));
                            }


                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                        volleyResponseListener.onResponse(details);
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
