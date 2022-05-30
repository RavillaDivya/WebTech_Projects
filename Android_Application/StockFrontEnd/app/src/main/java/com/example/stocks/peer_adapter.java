package com.example.stocks;

import android.content.Context;
import android.content.Intent;
import android.graphics.Paint;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import org.w3c.dom.Text;

import java.util.ArrayList;

public class peer_adapter extends RecyclerView.Adapter<peer_adapter.MyHolder> {

    ArrayList<String> data;
    Context context;

    public peer_adapter(ArrayList<String> data, Context context) {
        super();
        this.data = data;
        this.context = context;
    }

    @NonNull
    @Override
    public MyHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.peer_name_list, parent, false);
        return new MyHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull MyHolder holder, int position) {
        holder.txtview.setText(data.get(position)+",");
        holder.txtview.setPaintFlags(holder.txtview.getPaintFlags() | Paint.UNDERLINE_TEXT_FLAG);
        holder.txtview.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(view.getContext(), context.getClass());
                String ticker = data.get(position);
                intent.putExtra("Ticker", ticker);
                view.getContext().startActivity(intent);
            }
        });
    }

    @Override
    public int getItemCount() {
        return data.size();
    }

    public class MyHolder extends RecyclerView.ViewHolder {
        TextView txtview;
        public MyHolder(@NonNull View itemView) {
            super(itemView);
            txtview= itemView.findViewById(R.id.peer_name);
        }
    }
}
