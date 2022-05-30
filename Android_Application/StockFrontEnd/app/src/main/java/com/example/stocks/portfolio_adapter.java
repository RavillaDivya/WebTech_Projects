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

public class portfolio_adapter extends ArrayAdapter<portfolio_class> {
    Context context;
    private static final DecimalFormat df = new DecimalFormat("0.00");
    public portfolio_adapter(@NonNull Context context, ArrayList<portfolio_class> port_list) {
        super(context, 0, port_list);
        this.context = context;
    }

    @NonNull
    @Override
    public View getView(int position, @Nullable View convertView, @NonNull ViewGroup parent) {

        portfolio_class current_word = getItem(position);
        View list_item_view = convertView;
        if(list_item_view == null) {
            list_item_view = LayoutInflater.from(getContext()).inflate(
                    R.layout.portfolio_listitem, parent, false);
        }

        TextView ticker = (TextView) list_item_view.findViewById(R.id.port_ticker);
        TextView change = (TextView)  list_item_view.findViewById(R.id.port_change);
        TextView current_price = (TextView) list_item_view.findViewById(R.id.port_cp);
        TextView quantity = (TextView) list_item_view.findViewById(R.id.port_quantity);

        ticker.setText(current_word.getTicker());
        quantity.setText(current_word.getNumber().toString()+" shares");
        current_price.setText("$"+df.format(current_word.getCurrent_price()*current_word.getNumber()));

        ImageView chev = (ImageView) list_item_view.findViewById(R.id.port_chev);
        chev.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(view.getContext(), CompanyActivity.class);
                String ticker = current_word.getTicker();
                intent.putExtra("Ticker", ticker);
                view.getContext().startActivity(intent);
            }
        });

        ImageView trend_image = (ImageView) list_item_view.findViewById(R.id.port_trend);
        if (current_word.getChange().intValue() < 0) {
            change.setTextColor(Color.RED);
            trend_image.setImageResource(R.drawable.ic_baseline_trending_down_24);
        } else if (current_word.getChange().intValue() > 0){
            change.setTextColor(Color.GREEN);
            trend_image.setImageResource(R.drawable.ic_baseline_trending_up_24);
        }
        else {
            trend_image.setImageResource(0);
            change.setTextColor(Color.BLACK);
        }
        change.setText("$"+df.format(current_word.getChange()/100).toString()+"("+df.format(current_word.getChangePercentage())+"%)");
        return list_item_view;
    }

}
