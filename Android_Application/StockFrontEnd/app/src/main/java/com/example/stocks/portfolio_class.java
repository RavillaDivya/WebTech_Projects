package com.example.stocks;

public class portfolio_class {
    String ticker;
    Integer number;
    Float avg_cost;
    Float current_price;

    public String getTicker() { return ticker; }

    public Float getAvg_cost() {
        return avg_cost;
    }

    public Integer getNumber() {
        return number;
    }

    public Float getCurrent_price() { return current_price;}

    public Float getChange() {
        return (current_price-avg_cost)/(number).floatValue();
    }

    public Float getChangePercentage() {
        return (current_price-avg_cost)/avg_cost;
    }


    public void setTicker(String ticker) {
        this.ticker = ticker;
    }

    public void setAvg_cost(Float avg_cost) {
        this.avg_cost = avg_cost;
    }

    public void setNumber(Integer number) { this.number = number; }

    public void setCurrent_price(Float current_price) { this.current_price = current_price;};
}
