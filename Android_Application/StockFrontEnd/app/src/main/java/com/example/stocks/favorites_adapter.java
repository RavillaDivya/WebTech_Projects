package com.example.stocks;

import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import java.text.DecimalFormat;
import java.util.ArrayList;

public class favorites_adapter extends ArrayAdapter<favorites_class> {

    Context context;
    private static final DecimalFormat df = new DecimalFormat("0.00");
    public favorites_adapter(@NonNull Context context, ArrayList<favorites_class> fav_list) {
        super(context, 0, fav_list);
        this.context = context;
    }
    @NonNull
    @Override
    public View getView(int position, @Nullable View convertView, @NonNull ViewGroup parent) {

        favorites_class current_word = getItem(position);
        View list_item_view = convertView;
        if(list_item_view == null) {
            list_item_view = LayoutInflater.from(getContext()).inflate(
                    R.layout.favorite_listlayout, parent, false);
        }

        TextView ticker = (TextView) list_item_view.findViewById(R.id.fav_ticker);
        TextView change = (TextView)  list_item_view.findViewById(R.id.fav_change);
        TextView current_price = (TextView) list_item_view.findViewById(R.id.fav_cp);
        TextView company = (TextView) list_item_view.findViewById(R.id.fav_company);

        ticker.setText(current_word.getTicker());
        company.setText(current_word.getCompany_name());
        current_price.setText("$"+df.format(current_word.getCurrent_price()).toString());
        change.setText("$"+df.format(current_word.getChange()).toString()+"("+df.format(current_word.getChange_percentage())+"%)");

        ImageView chev = (ImageView) list_item_view.findViewById(R.id.fav_chev);
        chev.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(view.getContext(), CompanyActivity.class);
                String ticker = current_word.getTicker();
                intent.putExtra("Ticker", ticker);
                view.getContext().startActivity(intent);
            }
        });

        ImageView trend_image = (ImageView) list_item_view.findViewById(R.id.fav_trend);
        if (current_word.getChange() < 0) {
            change.setTextColor(Color.RED);
            trend_image.setImageResource(R.drawable.ic_baseline_trending_down_24);
        } else {
            change.setTextColor(Color.GREEN);
            trend_image.setImageResource(R.drawable.ic_baseline_trending_up_24);
        }

        return list_item_view;
    }

}
