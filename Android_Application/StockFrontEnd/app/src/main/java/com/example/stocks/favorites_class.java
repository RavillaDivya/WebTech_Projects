package com.example.stocks;

public class favorites_class {

    String ticker;
    String company_name;
    Float current_price;
    Float change;
    Float change_percentage;


    public favorites_class(String ticker, String company_name, Float current_price, Float change, Float change_percentage) {
        this.ticker = ticker;
        this.company_name = company_name;
        this.current_price = current_price;
        this.change = change;
        this.change_percentage = change_percentage;
    }

    public String getTicker() {
        return ticker;
    }

    public String getCompany_name() {
        return company_name;
    }

    public Float getCurrent_price() {
        return current_price;
    }

    public Float getChange() {
        return change;
    }

    public Float getChange_percentage() {
        return change_percentage;
    }
}
