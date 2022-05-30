package com.example.stocks;

import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.text.DecimalFormat;
import java.util.ArrayList;

public class SharedPreferencesSingleton {

    private static SharedPreferencesSingleton sharePref = new SharedPreferencesSingleton();
    private static SharedPreferences sharedPreferences;
    private static SharedPreferences.Editor editor;
    private static final DecimalFormat df = new DecimalFormat("0.00");

    private SharedPreferencesSingleton() {


    } //prevent creating multiple instances by making the constructor private

    //The context passed into the getInstance should be application level context.

    public void name(String s) {
        editor.remove("name");
        editor.commit();
        editor.putString("name", s);
        editor.commit();
    }



    public void initial_cash_balance () {
        editor.putString("Cash Balance", "25000");
        editor.commit();
    }

    public void initial_net_worth () {
        editor.putString("NetWorth", "25000");
        editor.commit();
    }

    public static SharedPreferencesSingleton getInstance(Context context) {
        if (sharedPreferences == null) {
            sharedPreferences = context.getSharedPreferences(context.getPackageName(), Activity.MODE_PRIVATE);
            editor = sharedPreferences.edit();

        }
        return sharePref;
    }

    public String get_cash_balance () {
        return sharedPreferences.getString("Cash Balance", "");
    }

    public String get_net_worth () {
        //update_net_worth();
        return sharedPreferences.getString("NetWorth", "");
    }

    public String get_name () {
        return sharedPreferences.getString("name", "");
    }

    public String get_favorite() {
        return sharedPreferences.getString("Favorite", "");
    }

    public String get_portfolio() {
        return sharedPreferences.getString("Portfolio", "");
    }

    public void remove_favorite() {
        editor.remove("Favorite");
        editor.commit();
    }

    public void remove_cashbalance() {
        editor.remove("Cash Balance");
        editor.commit();
    }

    public void remove_networth() {
        editor.remove("NetWorth");
        editor.commit();
    }

    public void remove_portfolio() {
        editor.remove("Portfolio");
        editor.commit();
    }

    public void add_favorite(favorites_class f) {
        String fav = get_favorite();
        remove_favorite();
        String placeObjStr;
        Gson gson = new Gson();
        Type fav_type = new TypeToken<ArrayList<favorites_class>>() {}.getType();
        ArrayList<favorites_class> new_list = new ArrayList<>();

       if(fav != "") {
           new_list = gson.fromJson(fav, fav_type);
           new_list.add(f);
           placeObjStr = gson.toJson(new_list);
       }
       else {
           new_list.add(f);
           placeObjStr = gson.toJson(new_list);
       }
        editor.putString("Favorite", placeObjStr);
        editor.commit();
    }

    public void remove_from_favorite(String ticker) {

        String port = get_favorite();
        remove_favorite();
        editor.commit();
        String placeObjStr;

        Gson gson = new Gson();
        Type fav_type = new TypeToken<ArrayList<favorites_class>>() {}.getType();
        ArrayList<favorites_class> new_list = new ArrayList<>();

        new_list = gson.fromJson(port, fav_type);
        favorites_class iter;

        for(int i=0; i<new_list.size(); i++) {
            iter = new_list.get(i);
            if(ticker.equals(iter.getTicker()) || ticker == iter.getTicker()) {
                new_list.remove(i);
            }
        }
        placeObjStr = gson.toJson(new_list);
        editor.putString("Favorites", placeObjStr);
        editor.commit();
        System.out.println("Removed:"+get_portfolio());

    }

//    public void edit_favorite(favorites_class f) {
//        String fav = get_favorite();
//        remove_favorite();
//        String placeObjStr;
//        Gson gson = new Gson();
//        Type fav_type = new TypeToken<ArrayList<favorites_class>>() {}.getType();
//        ArrayList<favorites_class> new_list = new ArrayList<>();
//
//        new_list = gson.fromJson(fav, fav_type);
//        favorites_class iter;
//
//        for(int i=0; i<new_list.size(); i++) {
//            iter = new_list.get(i);
//            if(f.getTicker().equals(iter.getTicker()) || f.getTicker() == iter.getTicker()) {
//                new_list.remove(i);
//                new_list.add(f);
//            }
//        }
//
//        placeObjStr = gson.toJson(new_list);
//        editor.putString("Favorite", placeObjStr);
//        editor.commit();
//    }

    public boolean in_favorties(String search_ticker) {

        String fav = get_favorite();
        Gson gson = new Gson();
        Type fav_type = new TypeToken<ArrayList<favorites_class>>() {}.getType();
        ArrayList<favorites_class> new_list = new ArrayList<>();
        new_list = gson.fromJson(fav, fav_type);

        favorites_class iter;

        if (fav != "")
        {
            for(int i=0; i<new_list.size(); i++) {
                iter = new_list.get(i);
                if(iter.getTicker().equals(search_ticker) || iter.getTicker() == search_ticker) {
                    return true;
                }
            }
        }
        return false;
    }


    public void add_cash_balance(Float f) {
        String old = sharedPreferences.getString("Cash Balance", "");
        Float old_value;
        Float new_value;
        String placeObjStr;
        editor.remove("Cash Balance");
        editor.commit();

        Gson gson = new Gson();
        old_value = gson.fromJson(old, Float.class);

        if (old_value == null)
            old_value = 25000F;

        new_value = old_value+f;

        placeObjStr = gson.toJson(new_value);
        editor.putString("Cash Balance", placeObjStr);
        editor.commit();
    }

    public void sub_cash_balance(Float f) {
        String old = sharedPreferences.getString("Cash Balance", "");
        Float old_value;
        Float new_value;
        String placeObjStr;
        editor.remove("Cash Balance");
        editor.commit();

        Gson gson = new Gson();
        old_value = gson.fromJson(old, Float.class);

        if (old_value == null)
            old_value = 25000F;

        new_value = old_value-f;

        placeObjStr = gson.toJson(new_value);

        editor.putString("Cash Balance", placeObjStr);
        editor.commit();
    }


    public void update_net_worth() {
        //update net worth
        Gson gson = new Gson();
        String cash_balance_str = sharedPreferences.getString("Cash Balance", "");
        String port_str = get_portfolio();
        String placeObjStr;
        Float cash_balance;
        if(cash_balance_str.isEmpty() || cash_balance_str == null) {
            cash_balance = 25000F;
        }
        else {
            cash_balance = gson.fromJson(cash_balance_str, Float.class);
        }

        Type port_type = new TypeToken<ArrayList<portfolio_class>>() {}.getType();
        ArrayList<portfolio_class> new_list = new ArrayList<>();
        new_list = gson.fromJson(port_str, port_type);
        portfolio_class iter;

        if (new_list != null) {
            for(int i=0; i<new_list.size(); i++) {
                iter = new_list.get(i);
                cash_balance += (iter.getNumber()*iter.getCurrent_price());
            }
        }

        placeObjStr = df.format(cash_balance);

        editor.remove("NetWorth");
        editor.commit();
        editor.putString("NetWorth", placeObjStr);
        editor.commit();
    }

    public void add_portfolio(portfolio_class p) {

        String port = get_portfolio();
        remove_portfolio();
        String placeObjStr;

        Gson gson = new Gson();
        Type fav_type = new TypeToken<ArrayList<portfolio_class>>() {}.getType();
        ArrayList<portfolio_class> new_list = new ArrayList<>();

        if(port != "") {
            new_list = gson.fromJson(port, fav_type);
            new_list.add(p);
            placeObjStr = gson.toJson(new_list);
        }
        else {
            new_list.add(p);
            placeObjStr = gson.toJson(new_list);
        }
        editor.putString("Portfolio", placeObjStr);
        editor.commit();
    }

    public void clearAll() {
        editor.clear();
        editor.commit();
    }

    public void edit_portfolio(portfolio_class p) {

        String port = get_portfolio();
        remove_portfolio();
        String placeObjStr;

        System.out.println("Old portfolio"+ port);
        System.out.println("New Class"+ p);

        Gson gson = new Gson();
        Type fav_type = new TypeToken<ArrayList<portfolio_class>>() {}.getType();
        ArrayList<portfolio_class> new_list = new ArrayList<>();

        new_list = gson.fromJson(port, fav_type);
        portfolio_class iter;

        for(int i=0; i<new_list.size(); i++) {
            iter = new_list.get(i);
            if(p.getTicker().equals(iter.getTicker()) || p.getTicker() == iter.getTicker()) {
                new_list.remove(i);
                new_list.add(p);
            }
        }
        placeObjStr = gson.toJson(new_list);
        editor.putString("Portfolio", placeObjStr);
        editor.commit();
        System.out.println("Empty:"+get_portfolio());
    }

    public void remove_from_portfolio(String ticker) {

        String port = get_portfolio();
        remove_portfolio();
        String placeObjStr;

//        System.out.println("Old portfolio"+ port);
//        System.out.println("New Class"+ p);

        Gson gson = new Gson();
        Type fav_type = new TypeToken<ArrayList<portfolio_class>>() {}.getType();
        ArrayList<portfolio_class> new_list = new ArrayList<>();

        new_list = gson.fromJson(port, fav_type);
        portfolio_class iter;

        for(int i=0; i<new_list.size(); i++) {
            iter = new_list.get(i);
            if(ticker.equals(iter.getTicker()) || ticker == iter.getTicker()) {
                new_list.remove(i);
            }
        }
        placeObjStr = gson.toJson(new_list);
        editor.putString("Portfolio", placeObjStr);
        editor.commit();
        System.out.println("Empty:"+get_portfolio());
    }


    //    public void update_networth() {
//
//        Float sum = 0F;
//        sum += Float.parseFloat(sharedPreferences.getString("Cash Balance", ""));
//        String port = get_portfolio();
//        String placeObjStr;
//
//        Gson gson = new Gson();
//        Type fav_type = new TypeToken<ArrayList<portfolio_class>>() {}.getType();
//        ArrayList<portfolio_class> new_list = new ArrayList<>();
//
//        new_list = gson.fromJson(port, fav_type);
//        portfolio_class iter;
//
//        for(int i=0; i<new_list.size(); i++) {
//            iter = new_list.get(i);
//            sum += iter.getMarket_value();
//        }
//
//        placeObjStr = gson.toJson(sum);
//
//        editor.putString("NetWorth", placeObjStr);
//        editor.commit();
//
//    }

}
