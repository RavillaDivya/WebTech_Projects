package com.example.stocks;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.viewpager2.adapter.FragmentStateAdapter;
import androidx.viewpager2.widget.ViewPager2;

import android.annotation.SuppressLint;
import android.app.Dialog;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.PorterDuff;
import android.graphics.drawable.ColorDrawable;
import android.net.Uri;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.View;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.material.imageview.ShapeableImageView;
import com.google.android.material.tabs.TabLayout;
import com.google.android.material.tabs.TabLayoutMediator;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.squareup.picasso.Picasso;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.w3c.dom.Text;

import java.lang.reflect.Type;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.text.SimpleDateFormat;


public class CompanyActivity extends AppCompatActivity {
    private static final DecimalFormat df = new DecimalFormat("0.00");
    private WebView webView;
    private boolean marked;

    private String format_date(String date) {
        String[] tokens = date.split("-");
        return tokens[1] + "-" + tokens[2] + "-" + tokens[0];
    }
    Dialog dialog;
    private String name;
    private String company_name;
    private Float current_price;

    private Float change;
    private Float change_percentage;

    SimpleDateFormat jdf = new SimpleDateFormat("MMMM dd,YYYY");
    public static final String FACEBOOK_PACKAGE_NAME = "com.facebook.katana";
    public static final String TWITTER_PACKAGE_NAME = "com.twitter.android";



    private void getCompanyInfo() {

        CompanyDetailsService companyDetailsService = new CompanyDetailsService(getApplicationContext());
        companyDetailsService.get_Details(name, new CompanyDetailsService.VolleyResponseListener() {
            @Override
            public void onError(String message) {
                Toast.makeText(CompanyActivity.this, message, Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onResponse(JSONObject details) throws JSONException {
                ImageView imageView = (ImageView) findViewById(R.id.company_logo);
                Picasso.with(CompanyActivity.this).load(details.getString("logo")).into(imageView);
                TextView ticker_text = (TextView) findViewById(R.id.ticker_text);
                ticker_text.setText(details.getString("ticker"));
                TextView name_text = (TextView) findViewById(R.id.name_text);
                name_text.setText(details.getString("name"));
                TextView start_date = (TextView) findViewById(R.id.start_date);
                start_date.setText(format_date(details.getString("ipo")));
                TextView industry = (TextView) findViewById(R.id.industry_name);
                industry.setText(details.getString("finnhubIndustry"));
                TextView webpage = (TextView) findViewById(R.id.webpage_link);
                webpage.setText(details.getString("weburl"));
                company_name = details.getString("name");
                System.out.println(company_name);
                webpage.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        Intent intent = new Intent();
                        intent.setAction(Intent.ACTION_VIEW);
                        intent.addCategory(Intent.CATEGORY_BROWSABLE);
                        try {
                            intent.setData(Uri.parse(details.getString("weburl")));
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                        startActivity(intent);
                    }
                });
                webpage.setPaintFlags(webpage.getPaintFlags() | Paint.UNDERLINE_TEXT_FLAG);
            }
        });

        LatestStockPriceService latestStockPriceService = new LatestStockPriceService(getApplicationContext());
        latestStockPriceService.get_Details(name, new LatestStockPriceService.VolleyResponseListener() {
            @Override
            public void onError(String message) {
                Toast.makeText(CompanyActivity.this, message, Toast.LENGTH_SHORT).show();
            }

            @SuppressLint("SetTextI18n")
            @Override
            public void onResponse(JSONObject details) throws JSONException {
                //With Dollar sign
                TextView current_price_text = (TextView) findViewById(R.id.current_price_text);
                current_price_text.setText("$" + details.getString("c"));
                current_price = Float.parseFloat(details.getString("c"));
                //$80.20(8.02%)
                TextView change_price_text = (TextView) findViewById(R.id.change_price_text);
                float d = Float.parseFloat(details.getString("d"));
                float dp = Float.parseFloat(details.getString("dp"));

                change = d;
                change_percentage = dp;

                ImageView trend_image = (ImageView) findViewById(R.id.trend_image);
                if (dp < 0) {
                    change_price_text.setTextColor(Color.RED);
                    trend_image.setImageResource(R.drawable.ic_baseline_trending_down_24);
                } else {
                    change_price_text.setTextColor(Color.GREEN);
                    trend_image.setImageResource(R.drawable.ic_baseline_trending_up_24);
                }
                change_price_text.setText("$" + df.format(d) + " (" + df.format(dp) + "%)");

                TextView open_price = (TextView) findViewById(R.id.open_price);
                TextView low_price = (TextView) findViewById(R.id.low_price);
                TextView high_price = (TextView) findViewById(R.id.high_price);
                TextView prev_close = (TextView) findViewById(R.id.prev_close);
                float o = Float.parseFloat(details.getString("o"));
                open_price.setText("$" + df.format(o));
                float l = Float.parseFloat(details.getString("l"));
                low_price.setText("$" + df.format(l));
                float h = Float.parseFloat(details.getString("h"));
                high_price.setText("$" + df.format(h));
                float pc = Float.parseFloat(details.getString("pc"));
                prev_close.setText("$" + df.format(pc));
            }
        });

        PeersService peersService = new PeersService(getApplicationContext());
        peersService.get_Details(name, new PeersService.VolleyResponseListener() {
            @Override
            public void onError(String message) {
                Toast.makeText(CompanyActivity.this, message, Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onResponse(JSONArray details) throws JSONException {

                ArrayList<String> exList = new ArrayList<>();
                for (int i = 0; i < details.length(); i++) {
                    exList.add(details.optString(i));
                }
                LinearLayoutManager layoutManager = new LinearLayoutManager(CompanyActivity.this, LinearLayoutManager.HORIZONTAL, false);
                peer_adapter itemsAdapter = new peer_adapter(exList, CompanyActivity.this);

                RecyclerView lstView = (RecyclerView) findViewById(R.id.peer_list);
                lstView.setLayoutManager(layoutManager);
                lstView.setAdapter(itemsAdapter);

            }
        });

        SocialSentimentService socialSentimentService = new SocialSentimentService(getApplicationContext());
        socialSentimentService.get_Details(name, new SocialSentimentService.VolleyResponseListener() {
            @Override
            public void onError(String message) {
                Toast.makeText(CompanyActivity.this, message, Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onResponse(int[] details) {
                TextView reddit_total = (TextView) findViewById(R.id.reddit_total);
                reddit_total.setText(Integer.toString(details[0]));
                TextView reddit_positive = (TextView) findViewById(R.id.reddit_positive);
                reddit_positive.setText(Integer.toString(details[1]));
                TextView reddit_negative = (TextView) findViewById(R.id.reddit_negative);
                reddit_negative.setText(Integer.toString(details[2]));
                TextView twitter_total = (TextView) findViewById(R.id.twitter_total);
                twitter_total.setText(Integer.toString(details[3]));
                TextView twitter_positive = (TextView) findViewById(R.id.twitter_positive);
                twitter_positive.setText(Integer.toString(details[4]));
                TextView twitter_negative = (TextView) findViewById(R.id.twitter_negative);
                twitter_negative.setText(Integer.toString(details[5]));
            }
        });

        RecommendationService recommendationService = new RecommendationService(getApplicationContext());
        recommendationService.get_Details(name, new RecommendationService.VolleyResponseListener() {
            @Override
            public void onError(String message) {
                Toast.makeText(CompanyActivity.this, message, Toast.LENGTH_SHORT).show();
            }

            @SuppressLint("JavascriptInterface")
            @Override
            public void onResponse(JSONObject details) {
                webView = (WebView) findViewById(R.id.recommendation_chart);
                webView.getSettings().setJavaScriptEnabled(true);
                WebSettings settings = webView.getSettings();
                settings.setDomStorageEnabled(true);
                webView.setWebViewClient(new WebViewClient());
                webView.addJavascriptInterface(new intermediate_interface(details), "Sick");
                webView.loadUrl("file:///android_asset/recommendation.html");
            }
        });

        EarningsService earningsService = new EarningsService(getApplicationContext());
        earningsService.get_Details(name, new EarningsService.VolleyResponseListener() {
            @Override
            public void onError(String message) {
                Toast.makeText(CompanyActivity.this, message, Toast.LENGTH_SHORT).show();
            }

            @SuppressLint("JavascriptInterface")
            @Override
            public void onResponse(JSONObject details) {
                webView = (WebView) findViewById(R.id.earnings_chart);
                webView.getSettings().setJavaScriptEnabled(true);
                WebSettings settings = webView.getSettings();
                settings.setDomStorageEnabled(true);
                webView.setWebViewClient(new WebViewClient());
                webView.addJavascriptInterface(new intermediate_interface(details), "Sick_2");
                webView.loadUrl("file:///android_asset/earnings.html");
            }
        });


        NewsService newsService = new NewsService(getApplicationContext());
        newsService.get_Details(name, new NewsService.VolleyResponseListener() {
            @Override
            public void onError(String message) {
                Toast.makeText(CompanyActivity.this, message, Toast.LENGTH_SHORT).show();
            }

            @SuppressLint("JavascriptInterface")
            @Override
            public void onResponse(JSONArray details) throws JSONException {
                ArrayList<news_class> news_list = new ArrayList<>();
                news_class first_news;
                int count = 0;

                for (int i = 0; i < details.length(); i++) {
                    JSONObject obj = details.getJSONObject(i);
                    String source = obj.getString("source");
                    String publish_date = obj.getString("datetime");
                    String title = obj.getString("headline");
                    String description = obj.getString("summary");
                    String image_link = obj.getString("image");
                    String url = obj.getString("url");
                    if (image_link != "" && !image_link.isEmpty()) {
                        if (count == 0) {
                            first_news = new news_class(source, publish_date, title, description, image_link, url);
                            count++;
                            ShapeableImageView imageView = (ShapeableImageView) findViewById(R.id.first_news_image);
                            try {
                                Picasso.with(CompanyActivity.this).load(image_link).into(imageView);
                            } catch (Exception e) {
                                Picasso.with(CompanyActivity.this).load(R.drawable.ic_backup).into(imageView);
                            }
                            TextView f_source = (TextView) findViewById(R.id.first_news_source);
                            TextView f_time_elapsed = (TextView) findViewById(R.id.first_news_time_elapsed);
                            TextView f_news_title = (TextView) findViewById(R.id.first_news_news_title);
                            f_source.setText(source);
                            f_time_elapsed.setText(first_news.get_time_elapsed());
                            f_news_title.setText(title);
                        } else {
                            news_class news_obj = new news_class(source, publish_date, title, description, image_link, url);
                            news_list.add(news_obj);
                        }
                    }
                }


                news_adapter itemsAdapter = new news_adapter(CompanyActivity.this, news_list);
                ListView listView = (ListView) findViewById(R.id.news_view);
                listView.setAdapter(itemsAdapter);
                listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
                    @Override
                    public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                        news_class w = news_list.get(position);
                        dialog = new Dialog(CompanyActivity.this);
                        dialog.setContentView(R.layout.news_dialogue);
                        dialog.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
                        TextView dialog_cname = (TextView) dialog.findViewById(R.id.dialogue_cname);
                        TextView dialog_date = (TextView) dialog.findViewById(R.id.dialogue_date);
                        TextView dialog_title = (TextView) dialog.findViewById(R.id.dialogue_title);
                        TextView dialog_content = (TextView) dialog.findViewById(R.id.dialogue_content);
                        ImageView chrome = (ImageView) dialog.findViewById(R.id.dialogue_chrome);
                        ImageView twitter = (ImageView) dialog.findViewById(R.id.dialogue_twitter);
                        ImageView facebook = (ImageView) dialog.findViewById(R.id.dialogue_facebook);

                        chrome.setOnClickListener(new View.OnClickListener() {
                            @Override
                            public void onClick(View view) {
                                open_chrome(w.url);
                            }
                        });

                        twitter.setOnClickListener(new View.OnClickListener() {
                            @Override
                            public void onClick(View view) {
                                open_twitter(w.url, w.title, w.description, w.image_link);
                            }
                        });

                        facebook.setOnClickListener(new View.OnClickListener() {
                            @Override
                            public void onClick(View view) {
                                open_facebook(w.url, w.title, w.description, w.image_link);
                            }
                        });

                        dialog_cname.setText(w.source);
//                      long i = Long.valueOf(w.publish_date);
//                      dialog_date.setText(jdf.format(i));
                        dialog_date.setText("May 4, 2022");
                        dialog_title.setText(w.title);
                        dialog_content.setText(w.description);
                        dialog.show();
                    }
                }
                );

            }
        });
    }

    public String get_ticker() {
        return name;
    }

    public Context get_context() {
        return CompanyActivity.this;
    }

    public void open_chrome(String url) {
        Intent intent = new Intent();
        intent.setAction(Intent.ACTION_VIEW);
        intent.addCategory(Intent.CATEGORY_BROWSABLE);
        intent.setData(Uri.parse(url));
        startActivity(intent);
    }

    public void open_twitter(String url, String title, String description, String image_url) {

        String message = "Check out this Link: " + url;
        String tweetUrl = "http://twitter.com/intent/tweet?text=" + Uri.parse(message) + "&url=" + url;
        Uri uri = Uri.parse(tweetUrl);
        startActivity(new Intent(Intent.ACTION_VIEW, uri));

    }

    public void open_facebook(String url, String title, String description, String image_url) {

        String sharerUrl = "https://www.facebook.com/sharer/sharer.php?u=" + url;
        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(sharerUrl));
        startActivity(intent);

    }

    private portfolio_class get_company_portfolio() {
        Gson gson = new Gson();
        String port = SharedPreferencesSingleton.getInstance(getApplicationContext()).get_portfolio();
        Type fav_type = new TypeToken<ArrayList<portfolio_class>>() {}.getType();
        ArrayList<portfolio_class> new_list = new ArrayList<>();
        portfolio_class temp;
        new_list = gson.fromJson(port, fav_type);

        if(new_list == null)
            return null;

        for (int i = 0; i < new_list.size(); i++) {
            temp = new_list.get(i);
            if (name.equals(temp.getTicker()) || name == temp.getTicker()) {
                return temp;
            }
        }
        return null;
    }


    private portfolio_class add_edited_portfolio_object(portfolio_class iter, Integer quantity, Float current_price) {

        portfolio_class new_class = new portfolio_class();
        new_class.setTicker(name);
        new_class.setNumber(iter.getNumber() + quantity);
        new_class.setCurrent_price(current_price);
        Float f = iter.getAvg_cost() * (float) iter.getNumber() + current_price * (float) quantity;
        new_class.setAvg_cost(f / (float) (iter.getNumber() + quantity));
        return new_class;
    }

    private portfolio_class add_new_portfolio_sell(portfolio_class iter, Integer quantity, Float current_price) {

        System.out.println("needed change!");
        portfolio_class new_class = new portfolio_class();
        new_class.setTicker(name);
        new_class.setNumber(iter.getNumber() - quantity);
        new_class.setCurrent_price(current_price);
        Float f = current_price * (float) quantity - iter.getAvg_cost() * (float) iter.getNumber();
        new_class.setAvg_cost(f / (float) (iter.getNumber() + quantity));
        System.out.println(new_class.getNumber());
        return new_class;
    }

    private void update_portfolio_to_zero() {

        TextView shares_owned = (TextView) findViewById(R.id.shares_owned);
        TextView avg_cost = (TextView) findViewById(R.id.avg_cost);
        TextView total_cost = (TextView) findViewById(R.id.total_cost);
        TextView change = (TextView) findViewById(R.id.change_price);
        TextView market_value = (TextView) findViewById(R.id.market_value);

        shares_owned.setText("0");
        avg_cost.setText("$0");
        total_cost.setText("$0");
        change.setText("$0");
        market_value.setText("$0");

    }

    private void update_portfolio(portfolio_class iter, boolean already_present) {

        TextView shares_owned = (TextView) findViewById(R.id.shares_owned);
        TextView avg_cost = (TextView) findViewById(R.id.avg_cost);
        TextView total_cost = (TextView) findViewById(R.id.total_cost);
        TextView change = (TextView) findViewById(R.id.change_price);
        TextView market_value = (TextView) findViewById(R.id.market_value);

        Float t_c, m_v, c;

        t_c = iter.getAvg_cost() * iter.getNumber();
        m_v = iter.getCurrent_price() * iter.getNumber();
        c = (m_v - t_c)/100;

        System.out.println(df.format(t_c));
        shares_owned.setText(iter.getNumber().toString());
        avg_cost.setText("$"+df.format(Math.abs(iter.getAvg_cost())));
        total_cost.setText("$"+df.format(Math.abs(t_c)));
        market_value.setText("$"+df.format(m_v));
        change.setText("$"+df.format(c));

        if(c<0)
            change.setTextColor(Color.RED);
        else if(c>0)
            change.setTextColor(Color.GREEN);
        else
            change.setTextColor(Color.BLACK);

    }

    TabLayout tab_layout;
    ViewPager2 view_pager;

    private String[] view_pager_name = new String[]{"hourly_fragment","history_fragment"};

    public class ScreenSlidePagerAdapter extends FragmentStateAdapter {

        public ScreenSlidePagerAdapter(@NonNull FragmentActivity fragmentActivity) {
            super(fragmentActivity);
            Log.d("View Pager Adapter", "Found!");
        }

        @NonNull
        @Override
        public Fragment createFragment(int position) {
            Log.d("View Pager create frag", "Found");
            if (position == 0) {
                return new hourly_fragment();
            }

            else if (position == 1)
                return new history_fragment();
            return new hourly_fragment();
        }

        @Override
        public int getItemCount() {
            return 2;
        }
    }

    @SuppressLint("RestrictedApi")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_company);






        Bundle extras = getIntent().getExtras();
        System.out.println(extras);


        Toolbar toolbar = (Toolbar) findViewById(R.id.company_toolbar);
        setSupportActionBar(toolbar);

        TextView action_ticker = (TextView) findViewById(R.id.action_ticker);

        if (extras != null) {
            String display_ticker = extras.getString("Ticker");
            String[] split = display_ticker.split("\\s+");
            action_ticker.setText(split[0]);
            name = split[0];
        }

        Bundle bundle = new Bundle();
        bundle.putString("Ticker", name);
        hourly_fragment fragobj = new hourly_fragment();
        fragobj.setArguments(bundle);

        Boolean marked = SharedPreferencesSingleton.getInstance(getApplicationContext()).in_favorties(name);

        tab_layout = findViewById(R.id.tab_layout);
        view_pager = findViewById(R.id.view_pager);
        view_pager.setAdapter(new ScreenSlidePagerAdapter(this));

        new TabLayoutMediator(tab_layout, view_pager,
                (tab, position) -> {
                    if(position == 0)
                        tab.setIcon(R.drawable.ic_hourly);
                    else
                        tab.setIcon(R.drawable.ic_history);
                }
        ).attach();


        CheckBox fav_mark = (CheckBox) findViewById(R.id.mark_fav);
        if(marked)
            fav_mark.setChecked(true);

        fav_mark.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton compoundButton, boolean b) {
                if (fav_mark.isChecked())
                {
                    favorites_class p = new favorites_class(name, company_name, current_price, change, change_percentage);
                    SharedPreferencesSingleton.getInstance(getApplicationContext()).add_favorite(p);
                    Toast.makeText(CompanyActivity.this, name+" is added to favorites", Toast.LENGTH_SHORT).show();
                }
                else
                {
                    SharedPreferencesSingleton.getInstance(getApplicationContext()).remove_from_favorite(name);
                    Toast.makeText(CompanyActivity.this, name+" is removed from favorites", Toast.LENGTH_SHORT).show();
                }
            }
        });


        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayShowTitleEnabled(false);
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
            //getSupportActionBar().setDisplayShowHomeEnabled(true);
        }

        ConstraintLayout placeHolder = (ConstraintLayout) findViewById(R.id.D19);
        getLayoutInflater().inflate(R.layout.first_newsitem, placeHolder);
        getCompanyInfo();

        portfolio_class current_portfolio = get_company_portfolio();

        if (current_portfolio != null) {
            update_portfolio(current_portfolio, true); }

            Button trade_button = (Button) findViewById(R.id.trade_button);
            trade_button.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    dialog = new Dialog(CompanyActivity.this);
                    dialog.setContentView(R.layout.trade_dialog);
                    dialog.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
                    Button buy = (Button) dialog.findViewById(R.id.dialog_buy_button);
                    Button sell = (Button) dialog.findViewById(R.id.dialogue_sell_button);
                    EditText number = (EditText) dialog.findViewById(R.id.dialog_number);
                    TextView trade_title = (TextView) dialog.findViewById(R.id.trade_title);
                    TextView trade_moreinfo = (TextView) dialog.findViewById(R.id.trade_moreinfo);
                    TextView dialog_total = (TextView) dialog.findViewById(R.id.dialog_total);

                    trade_title.setText("Trade "+company_name+" shares");
                    trade_moreinfo.setText("$"+df.format(Float.parseFloat(SharedPreferencesSingleton.getInstance(getApplicationContext()).get_cash_balance()))+" to buy "+name);

                    number.addTextChangedListener(new TextWatcher() {
                        @Override
                        public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                        }

                        @Override
                        public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
//                            if(!number.getText().toString().isEmpty()) {
//                                int q = Integer.parseInt(number.getText().toString());
//                                dialog_total.setText(q+".0*$"+current_price+"/share = "+df.format(q*current_price))
//                            }
                        }

                        @Override
                        public void afterTextChanged(Editable editable) {
                            if(!number.getText().toString().isEmpty()) {
                                int q = Integer.parseInt(number.getText().toString());
                                dialog_total.setText(q+".0*$"+current_price+"/share = "+df.format(q*current_price));
                            }
                            else {
                                dialog_total.setText("0.0*$0.00/share = 0.00");
                            }
                        }
                    });


                    buy.setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View view) {
                            String s = number.getText().toString();

                            if (s.isEmpty())
                                Toast.makeText(CompanyActivity.this, "Please enter a valid amount", Toast.LENGTH_SHORT).show();
                            else {
                                Integer quantity = Integer.parseInt(s);
                                if (quantity > 30) {
                                    Toast.makeText(CompanyActivity.this, "Not enough money to buy", Toast.LENGTH_SHORT).show();
                                } 
                                else if (quantity<1) {
                                    Toast.makeText(CompanyActivity.this, "Cannot buy non-positive shares", Toast.LENGTH_SHORT).show();
                                }
                                else {
                                    Gson gson = new Gson();
                                    String port = SharedPreferencesSingleton.getInstance(getApplicationContext()).get_portfolio();
                                    Type fav_type = new TypeToken<ArrayList<portfolio_class>>() {}.getType();
                                    ArrayList<portfolio_class> new_list = new ArrayList<>();
                                    new_list = gson.fromJson(port, fav_type);
                                    portfolio_class iter;
                                    int found = 0;

                                    if (new_list == null)
                                    {
                                        portfolio_class new_class = new portfolio_class();
                                        new_class.setTicker(name);
                                        new_class.setNumber(quantity);
                                        new_class.setCurrent_price(current_price);
                                        new_class.setAvg_cost(current_price);
                                        SharedPreferencesSingleton.getInstance(getApplicationContext()).add_portfolio(new_class);
                                        SharedPreferencesSingleton.getInstance(getApplicationContext()).sub_cash_balance(quantity*current_price);

                                        update_portfolio(new_class, false);
                                    }
                                    else {
                                        for (int i = 0; i < new_list.size(); i++) {
                                            iter = new_list.get(i);
                                            if (name.equals(iter.getTicker()) || name == iter.getTicker()) {
                                                found++;
                                                portfolio_class new_class = add_edited_portfolio_object(iter, quantity, current_price);
                                                SharedPreferencesSingleton.getInstance(getApplicationContext()).edit_portfolio(new_class);
                                                SharedPreferencesSingleton.getInstance(getApplicationContext()).sub_cash_balance(quantity*current_price);
                                                update_portfolio(new_class, true);
                                                break;
                                            }
                                        }
                                        if (found == 0) {
                                            portfolio_class new_class = new portfolio_class();
                                            new_class.setTicker(name);
                                            new_class.setNumber(quantity);
                                            new_class.setCurrent_price(current_price);
                                            new_class.setAvg_cost(current_price);
                                            SharedPreferencesSingleton.getInstance(getApplicationContext()).add_portfolio(new_class);
                                            update_portfolio(new_class, false);
                                        }
                                    }
                                    dialog.setContentView(R.layout.congratulations_dialogue);
                                    TextView congrats_text = (TextView) dialog.findViewById(R.id.congrats_information);
                                    congrats_text.setText("You have successfully bought "+s+" shares of "+name);
                                    Button b = (Button) dialog.findViewById(R.id.congrats_button);
                                    b.setOnClickListener(new View.OnClickListener() {
                                        @Override
                                        public void onClick(View view) {
                                            dialog.dismiss();
                                        }
                                    });
                                }
                            }
                        }
                    });

                    sell.setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View view) {
                            String s = number.getText().toString();
                            if (s.isEmpty())
                                Toast.makeText(CompanyActivity.this, "Please enter a valid amount", Toast.LENGTH_SHORT).show();
                            else {
                                Integer quantity = Integer.parseInt(s);
                                if (current_portfolio == null) {
                                    Toast.makeText(CompanyActivity.this, "Not enough shares to sell", Toast.LENGTH_SHORT).show();
                                }
                                else {
                                    if (current_portfolio.getNumber() < quantity) {
                                        Toast.makeText(CompanyActivity.this, "Not enough shares to sell", Toast.LENGTH_SHORT).show();
                                    }
//                                    else if (quantity <1){
//                                        Toast.makeText(CompanyActivity.this, "", Toast.LENGTH_SHORT).show();
//                                    }
                                    else if (current_portfolio.getNumber() == quantity) {
                                        //Toast.makeText(CompanyActivity.this, "Not enough shares to sell", Toast.LENGTH_SHORT).show();
                                        SharedPreferencesSingleton.getInstance(getApplicationContext()).add_cash_balance(quantity*current_price);
                                        SharedPreferencesSingleton.getInstance(getApplicationContext()).remove_from_portfolio(current_portfolio.getTicker());
                                        update_portfolio_to_zero();
                                        dialog.setContentView(R.layout.congratulations_dialogue);
                                        TextView congrats_text = (TextView) dialog.findViewById(R.id.congrats_information);
                                        congrats_text.setText("You have successfully sold "+s+" shares of "+name);
                                        Button b = (Button) dialog.findViewById(R.id.congrats_button);
                                        b.setOnClickListener(new View.OnClickListener() {
                                            @Override
                                            public void onClick(View view) {
                                                dialog.dismiss();
                                            }
                                        });

                                    } else {
                                        portfolio_class new_class = add_new_portfolio_sell(current_portfolio, quantity, current_price);
                                        SharedPreferencesSingleton.getInstance(getApplicationContext()).edit_portfolio(new_class);
                                        update_portfolio(new_class, true );
                                        SharedPreferencesSingleton.getInstance(getApplicationContext()).add_cash_balance(quantity*current_price);
                                        dialog.setContentView(R.layout.congratulations_dialogue);
                                        TextView congrats_text = (TextView) dialog.findViewById(R.id.congrats_information);
                                        congrats_text.setText("You have successfully sold "+s+" shares of "+name);
                                        Button b = (Button) dialog.findViewById(R.id.congrats_button);
                                        b.setOnClickListener(new View.OnClickListener() {
                                            @Override
                                            public void onClick(View view) {
                                                dialog.dismiss();
                                            }
                                        });
                                    }
                                }

                            }
                        }
                    });
                    dialog.show();
                }
            });
    }



}


//    @Override
//    public boolean onOptionsItemSelected(MenuItem item) {
//        int id = item.getItemId();
//
//        if (id == android.R.id.home) {
//            Intent intent=new Intent(CompanyActivity.this, MainActivity.class);
//            startActivity(intent);
//            finish();
//            return true;
//        }
//        return true;
//    }

//    @Override
//    public void onBackPressed() {
//        if(webView.canGoBack()) {
//            webView.goBack();
//        }
//        else {
//            super.onBackPressed();
//        }
//    }