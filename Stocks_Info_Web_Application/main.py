# [START gae_flex_quickstart]
from doctest import REPORT_NDIFF
import json
import requests
from flask import Flask, render_template, url_for, jsonify, request
from datetime import *
from dateutil.relativedelta import *
import time


app = Flask(__name__, static_folder='static', static_url_path="/static")


@app.route('/')
def hello():
    return app.send_static_file("front.html")
    # render_template('front.html')

@app.route("/getcompany/<name>", methods=['GET'])
def find_stock(name):

    api_key = 'c87eusqad3i9lkntmfhg'
    name = name.upper()
    api_call = 'https://finnhub.io/api/v1/stock/profile2?symbol={}&token={}'.format(name,api_key)
    response = requests.get(api_call)
    data = response.json()
    if len(data.keys()) == 0:
        return jsonify({'Error': 'InvalidTicker'})
    return jsonify({'logo': data['logo'], 
                    'name': data['name'],
                    'ticker': data['ticker'],
                    'exchange': data['exchange'],
                    'ipo': data['ipo'],
                    'finnhubIndustry': data['finnhubIndustry']
                    })
    
@app.route("/getstocksummary/<name>", methods=['GET'])
def stock_summary(name):

    api_key = 'c87eusqad3i9lkntmfhg'
    name = name.upper()
    api_call = 'https://finnhub.io/api/v1/quote?symbol={}&token={}'.format(name,api_key)
    api_call_recommendation = 'https://finnhub.io/api/v1/stock/recommendation?symbol={}&token={}'.format(name,api_key)
    response = requests.get(api_call)
    response_rec = requests.get(api_call_recommendation)
    data = response.json()
    data_rec = response_rec.json()
    data['strongSell'] = data_rec[0]['strongSell']
    data['sell'] = data_rec[0]['sell']
    data['hold'] = data_rec[0]['hold']
    data['buy'] = data_rec[0]['buy']
    data['strongBuy'] = data_rec[0]['strongBuy']
    return data 

@app.route("/displaycharts/<name>", methods=['GET'])
def display_charts(name):

    api_key = 'c87eusqad3i9lkntmfhg'
    name = name.upper()
    curr_time = datetime.now()
    prev_time = datetime.now()+relativedelta(months=-6, days=-1)
    unix_time1 = int(time.mktime(curr_time.timetuple()))
    unix_time2 = int(time.mktime(prev_time.timetuple()))

    date1 = date.today()
    date2 = date.today()+relativedelta(days=-30)

    api_call = 'https://finnhub.io/api/v1/stock/candle?symbol={}&resolution=D&from={}&to={}&token={}'.format(name,unix_time2, unix_time1, api_key)
    response = requests.get(api_call)
    data = response.json()
    return jsonify({'t': data['t'], 
                    'c': data['c'],
                    'v': data['v']
                    })


@app.route("/displaynews/<name>", methods=['GET'])
def display_news(name):

    api_key = 'c87eusqad3i9lkntmfhg'
    name = name.upper()

    date1 = date.today()
    date2 = date.today()+relativedelta(days=-30)

    api_call = 'https://finnhub.io/api/v1/company-news?symbol={}&from={}&to={}&token={}'.format(name, date2, date1, api_key)
    response = requests.get(api_call)
    data = response.json()
    r_data = {}
    count = 1
    
    for index in range(len(data)):
        if count < 6:
            if data[index]['image'] != "" and data[index]['headline'] != "" and data[index]['datetime'] != "" and data[index]['url'] != "":
                r_data['image_{}'.format(count)] = data[index]['image']
                r_data['title_{}'.format(count)] = data[index]['headline']
                r_data['date_{}'.format(count)] = data[index]['datetime']
                r_data['url_{}'.format(count)] = data[index]['url']
                count += 1
        else:
            break
    return jsonify(r_data)

if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app.
    app.run(host='127.0.0.1', port=8080, debug=True)
# [END gae_flex_quickstart]
