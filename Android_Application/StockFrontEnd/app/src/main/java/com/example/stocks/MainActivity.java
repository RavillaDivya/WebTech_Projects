package com.example.stocks;

import androidx.appcompat.app.AppCompatActivity;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.widget.SearchView;
import androidx.appcompat.widget.Toolbar;
import androidx.core.view.MenuItemCompat;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Random;
import java.util.Timer;
import java.util.TimerTask;

public class MainActivity extends AppCompatActivity {
    private static final DecimalFormat df = new DecimalFormat("0.00");
    //ArrayList<favorites_class> f_list;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Toolbar toolbar = (Toolbar) findViewById(R.id.main_toolbar);
        setSupportActionBar(toolbar);

//        SharedPreferencesSingleton.getInstance(getApplicationContext()).clearAll();
        Log.d("Key", SharedPreferencesSingleton.getInstance(getApplicationContext()).get_favorite());
        Log.d("PortfolioKey", SharedPreferencesSingleton.getInstance(getApplicationContext()).get_portfolio());

        Gson gson = new Gson();
        String new_fav = SharedPreferencesSingleton.getInstance(getApplicationContext()).get_favorite();
        ArrayList<favorites_class> f_list;
        Type fav_type = new TypeToken<ArrayList<favorites_class>>() {}.getType();
        f_list = gson.fromJson(new_fav, fav_type);
        if(f_list == null) {
            f_list = new ArrayList<favorites_class>();
        }
        favorites_adapter adapter = new favorites_adapter(MainActivity.this, f_list);
        ListView listView = (ListView) findViewById(R.id.favorites_list);
        listView.setAdapter(adapter);

        gson = new Gson();
        String new_port = SharedPreferencesSingleton.getInstance(getApplicationContext()).get_portfolio();
        ArrayList<portfolio_class> p_list;
        Type port_type = new TypeToken<ArrayList<portfolio_class>>() {}.getType();
        p_list = gson.fromJson(new_port, port_type);
        if(p_list == null) {
            p_list = new ArrayList<portfolio_class>();
        }
        portfolio_adapter p_adapter = new portfolio_adapter(MainActivity.this, p_list);
        ListView p_listView = (ListView) findViewById(R.id.portfolio_list);
        p_listView.setAdapter(p_adapter);

        String cash_balance = SharedPreferencesSingleton.getInstance(getApplicationContext()).get_cash_balance();
        if(cash_balance == null)
            SharedPreferencesSingleton.getInstance(getApplicationContext()).initial_cash_balance();

        //SharedPreferencesSingleton.getInstance(getApplicationContext()).update_net_worth();
        //update_networth_view();

        //final TextView change_shit = (TextView) findViewById(R.id.timer);

    }

    public void update_networth_view() {

        TextView net_worth = (TextView) findViewById(R.id.net_worth);
        TextView cash_balance = (TextView) findViewById(R.id.cash_balance);

        //net_worth.setText("$ "+SharedPreferencesSingleton.getInstance(getApplicationContext()).get_net_worth());
        //cash_balance.setText("$ "+SharedPreferencesSingleton.getInstance(getApplicationContext()).get_cash_balance());
    }

    @Override
    public void onResume()
    {
        super.onResume();
        Gson gson = new Gson();
        String new_fav = SharedPreferencesSingleton.getInstance(getApplicationContext()).get_favorite();
        ArrayList<favorites_class> f_list;
        Type fav_type = new TypeToken<ArrayList<favorites_class>>() {}.getType();
        f_list = gson.fromJson(new_fav, fav_type);

        if(f_list == null)
        {
            f_list = new ArrayList<favorites_class>();
        }

        favorites_adapter adapter = new favorites_adapter(MainActivity.this, f_list);
        ListView listView = (ListView) findViewById(R.id.favorites_list);
        listView.setAdapter(adapter);

        Log.v("main_fav_list", new_fav);


        String new_port = SharedPreferencesSingleton.getInstance(getApplicationContext()).get_portfolio();
        ArrayList<portfolio_class> p_list;
        Type port_type = new TypeToken<ArrayList<portfolio_class>>() {}.getType();
        p_list = gson.fromJson(new_port, port_type);

        if(p_list == null) {
            p_list = new ArrayList<portfolio_class>();
        }

        Log.v("main_port_list", new_port);

        portfolio_adapter p_adapter = new portfolio_adapter(MainActivity.this, p_list);
        ListView p_listView = (ListView) findViewById(R.id.portfolio_list);
        p_listView.setAdapter(p_adapter);


        String cash_balance = SharedPreferencesSingleton.getInstance(getApplicationContext()).get_cash_balance();
        TextView cash_b = (TextView) findViewById(R.id.cash_balance);
        TextView net_w = (TextView) findViewById(R.id.net_worth);
        if(cash_balance != null && !cash_balance.isEmpty() && cash_balance.length() != 0)
        {
            cash_b.setText("$ "+ df.format(Float.parseFloat(cash_balance)));
            //update_networth_view();
        }
        else {
            SharedPreferencesSingleton.getInstance(getApplicationContext()).initial_cash_balance();
            SharedPreferencesSingleton.getInstance(getApplicationContext()).initial_net_worth();
            cash_b.setText("$ 25000");
            net_w.setText("$ 25000");
        }

        //SharedPreferencesSingleton.getInstance(getApplicationContext()).update_net_worth();
    }


    @SuppressLint("RestrictedApi")
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        MenuInflater inflater = getMenuInflater();
        inflater.inflate(R.menu.options_menu, menu);
        MenuItem item = menu.findItem(R.id.search);
        ArrayList<String> name_list = new ArrayList<>();
        SearchView searchView;
        SearchView.SearchAutoComplete   mSearchAutoComplete;
        searchView = (SearchView) MenuItemCompat.getActionView(item);
        mSearchAutoComplete = (SearchView.SearchAutoComplete) searchView.findViewById(androidx.appcompat.R.id.search_src_text);
        mSearchAutoComplete.setDropDownAnchor(R.id.autocomplete_list);
        mSearchAutoComplete.setThreshold(0);
        ArrayAdapter<String> adapter = new ArrayAdapter<String>(this, android.R.layout.simple_list_item_1, name_list);
        mSearchAutoComplete.setAdapter(adapter);

        TextView finnhub = (TextView) findViewById(R.id.M6);

        finnhub.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent();
                intent.setAction(Intent.ACTION_VIEW);
                intent.addCategory(Intent.CATEGORY_BROWSABLE);
                intent.setData(Uri.parse("https://finnhub.io/"));
                startActivity(intent);
            }
        });

        searchView.setOnSearchClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                searchView.setQueryHint("Search..");
                searchView.setIconifiedByDefault(false);
                LinearLayout search_plate = (LinearLayout) searchView.findViewById(androidx.appcompat.R.id.search_plate);
                search_plate.setBackground(null);
                ImageView icon = (ImageView) searchView.findViewById(androidx.appcompat.R.id.search_mag_icon);
                icon.setVisibility(View.GONE);
            }
        });

        mSearchAutoComplete.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
                Intent intent = new Intent(view.getContext(), CompanyActivity.class);
                String ticker = (String) adapterView.getItemAtPosition(i);
                intent.putExtra("Ticker", ticker);
                SharedPreferencesSingleton.getInstance(getApplicationContext()).name(ticker);
                startActivity(intent);
            }
        });


        searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
            @Override
            public boolean onQueryTextSubmit(String query) {
                Intent intent = new Intent(MainActivity.this, CompanyActivity.class);
                intent.putExtra("Ticker", query);
                startActivity(intent);
                return false;
            }


            @Override
            public boolean onQueryTextChange(String newText) {
                if(newText.length() == 0)
                    adapter.clear();
                if(newText.length() != 0) {
                    System.out.println(newText.length());
                    AutoCompleteService autoCompleteService = new AutoCompleteService(MainActivity.this);
                    autoCompleteService.get_List(newText, new AutoCompleteService.VolleyResponseListener() {
                        @Override
                        public void onError(String message) {
                            Toast.makeText(MainActivity.this, message, Toast.LENGTH_SHORT).show();
                        }

                        @Override
                        public void onResponse(ArrayList<String> new_list) {
                            System.out.println("NewLst"+new_list);
//                            name_list.addAll(new_list);
                            adapter.addAll(new_list);
                            System.out.println(name_list);
                            System.out.println(adapter.getItemId(0));
                            mSearchAutoComplete.setDropDownAnchor(R.id.autocomplete_list);
                            mSearchAutoComplete.setAdapter(adapter);
                            mSearchAutoComplete.showDropDown();
                        }
                    });
                }
//                adapter.add("AAPL | Apple Inc");
//                adapter.add("TSLA | Tesla Inc");
                adapter.notifyDataSetChanged();
                return false;
            }
        });
        return true;
    }

}