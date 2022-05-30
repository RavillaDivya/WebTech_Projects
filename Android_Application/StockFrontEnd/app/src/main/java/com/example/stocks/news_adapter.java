package com.example.stocks;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.google.android.material.imageview.ShapeableImageView;
import com.squareup.picasso.Picasso;

import org.w3c.dom.Text;

import java.util.ArrayList;

public class news_adapter extends ArrayAdapter<news_class> {

    Context context;

    public news_adapter(@NonNull Context context, ArrayList<news_class> word_list) {
        super(context, 0, word_list);
        this.context = context;
    }
    @NonNull
    @Override
    public View getView(int position, @Nullable View convertView, @NonNull ViewGroup parent) {

        news_class current_word = getItem(position);
        View list_item_view = convertView;
        if(list_item_view == null) {
            list_item_view = LayoutInflater.from(getContext()).inflate(
                    R.layout.news_listitem, parent, false);
        }

        TextView source = (TextView) list_item_view.findViewById(R.id.source);
        TextView time_elapsed = (TextView)  list_item_view.findViewById(R.id.time_elapsed);
        TextView news_title = (TextView) list_item_view.findViewById(R.id.news_title);
        ShapeableImageView imageView = (ShapeableImageView) list_item_view.findViewById(R.id.news_image);
        if (current_word.image_link != ""||current_word.image_link != " " || current_word.image_link != null) {
            //System.out.println(current_word.image_link);
            try {
                Picasso.with(context).load(current_word.image_link).into(imageView);
            } catch (Exception e) {
                Picasso.with(context).load(R.drawable.ic_backup).into(imageView);
            }
        }
        source.setText(current_word.source);
        time_elapsed.setText(current_word.get_time_elapsed());
        news_title.setText(current_word.title);

        return list_item_view;
    }
}
