package com.example.stocks;

import java.util.Date;

public class news_class {
    String source;
    String publish_date;
    String title;
    String description;
    String time_elapsed;
    String image_link;
    String url;

    news_class(String source, String publish_date, String title, String description, String image_link, String url                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     ) {
        this.description = description;
        this.publish_date = publish_date;
        this.source = source;
        this.title = title;
        this.time_elapsed = get_time_elapsed();
        this.image_link = image_link;
        this.url = url;
    }

    public String get_time_elapsed() {
        String s = "6 Hours";
        long i = Long.valueOf(publish_date);
        long unixTime = System.currentTimeMillis() / 1000L;
        long sec = (unixTime-i)%60;
        long min = ((unixTime-i)/60)%60;
        long hrs = ((unixTime-i)/60)/60;

        if(hrs>0)
            s = Long.toString(hrs)+" hours ago";
        else if(min>0)
            s = Long.toString(min)+" minutes ago";
        else
            s = Long.toString(sec)+" seconds ago";

        return s;
    }


    public String getImage_link() {
        return image_link;
    }
}
