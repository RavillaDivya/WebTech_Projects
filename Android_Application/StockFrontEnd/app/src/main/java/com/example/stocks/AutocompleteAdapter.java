package com.example.stocks;

import android.app.Activity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import java.util.ArrayList;

public class AutocompleteAdapter extends ArrayAdapter<String> {

    public AutocompleteAdapter(Activity context, ArrayList<String> names) {
        super(context, 0, names);
    }
    @NonNull
    @Override
    public View getView(int position, @Nullable View convertView, @NonNull ViewGroup parent) {

        String current_word = getItem(position);
        View list_item_view = convertView;
        if(list_item_view == null) {
            list_item_view = LayoutInflater.from(getContext()).inflate(
                    R.layout.autocomplete_listitem, parent, false);
        }
        TextView text = (TextView) list_item_view.findViewById(R.id.textView);
        text.setText(current_word);
        return list_item_view;
    }

}
