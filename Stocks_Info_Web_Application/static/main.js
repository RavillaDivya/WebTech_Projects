const f = document.querySelector('#form');
const q = document.querySelector('#user-input');
const log = document.getElementById('log');
const reset = document.querySelector('#cancel-button')
var company_obj, stock_obj, display_obj, news_obj, late_obj, sen_obj, peer_obj, rec_obj, earn_obj;
const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function add_row(table, header, value){
    let row = document.createElement('tr');
    let col_1 = document.createElement('td');
    col_1.innerHTML = header;
    let col_2 = document.createElement('td');
    col_2.innerHTML = value;
    if(header == "Change" || header == "Change Percent"){
        if(value > 0)
            col_2.innerHTML += "<img id=\"downarrow\" src=\"static/GreenArrowUp.png\"/>";
        else
            col_2.innerHTML += "<img id=\"downarrow\" src=\"static/RedArrowDown.png\"/>";
    }
    row.append(col_1)
    row.append(col_2)
    table.append(row)
}

function add_nav_element(nav_bar, id, value){
    var n = document.createElement("li");
    n.setAttribute("id", id);
    n.innerHTML = value;
    nav_bar.append(n);
}

function tag_navbars(){
    document.getElementById('n_company').onclick = activate_company;
    document.getElementById('n_stock').onclick = activate_summary;
    document.getElementById('n_charts').onclick = activate_charts;
    document.getElementById('n_news').onclick = activate_news;
}

function initial_display(){
    // building nav-bar
    var nav_bar = document.getElementById("nav-bar");
    var nav_bar_list = document.createElement("ul");
    nav_bar_list.setAttribute("id", "nav-bar-list")
    add_nav_element(nav_bar_list, "n_company", "Company");
    add_nav_element(nav_bar_list, "n_stock", "Stock Summary");
    add_nav_element(nav_bar_list, "n_charts", "Charts");
    add_nav_element(nav_bar_list, "n_news", "Latest News");
    nav_bar.append(nav_bar_list);
    build_company();
    tag_navbars();
    // build_stock();
    // build_news();
    // build_charts();
}

function activate_company(){
    document.getElementById('company').style.display = "block";
    document.getElementById('summary').style.display = "none";
    document.getElementById('news').style.display = "none";
    document.getElementById('charts').style.display = "none";
}

function activate_summary(){
    document.getElementById('summary').style.display = "block";
    document.getElementById('company').style.display = "none";
    document.getElementById('news').style.display = "none";
    document.getElementById('charts').style.display = "none";
}

function activate_charts(){
    document.getElementById('charts').style.display = "block";
    document.getElementById('company').style.display = "none";
    document.getElementById('news').style.display = "none";
    document.getElementById('summary').style.display = "none";
}

function activate_news(){
    document.getElementById('news').style.display = "block";
    document.getElementById('summary').style.display = "none";
    document.getElementById('company').style.display = "none";
    document.getElementById('charts').style.display = "none";
}


function build_company(){
    var company_div = document.getElementById("company");
    var company_logo = document.createElement("img");
    company_logo.setAttribute("src", company_obj.logo);
    company_div.append(company_logo);
    var company_table = document.createElement("table");
    add_row(company_table, "Company Name", company_obj.name);
    add_row(company_table, "Stock Ticker Symbol", company_obj.ticker);
    add_row(company_table, "Stock Exchange Code", company_obj.exchange);
    add_row(company_table, "Company Start Date", company_obj.ipo);
    add_row(company_table, "Category", company_obj.finnhubIndustry);
    company_div.append(company_table);
    document.getElementById('company').style.display = "block";
    // document.getElementById('summary').style.display = "none";
    // document.getElementById('news').style.display = "none";
    // document.getElementById('charts').style.display = "none";
}


function add_div(main_div, id, value)
{
    let new_div = document.createElement("div");
    new_div.innerHTML = value;
    new_div.setAttribute("id", id);
    main_div.append(new_div);
}

function build_stock(){
    document.getElementById('summary').style.display = "none";
    var stock_div = document.getElementById("summary");
    var stock_table = document.createElement("table");
    add_row(stock_table, "Stock Ticker Symbol", company_obj.ticker);
    const d = new Date(stock_obj.t * 1000);
    const t_day = ''+d.getDay()+' '+month[d.getMonth()]+', '+d.getFullYear();
    add_row(stock_table, "Trading Day", t_day);
    add_row(stock_table, "Previous Closing Price", stock_obj.pc);
    add_row(stock_table, "Opening Price", stock_obj.o);
    add_row(stock_table, "High Price", stock_obj.h);
    add_row(stock_table, "Low Price", stock_obj.l);
    add_row(stock_table, "Change", stock_obj.d);
    add_row(stock_table, "Change Percent", stock_obj.dp);
    stock_div.append(stock_table);
    //FlexBox
    var stats_bar = document.createElement("div");
    stats_bar.setAttribute("id", "stats");
    add_div(stats_bar, "strongsell", "Strong Sell");
    add_div(stats_bar, "one", stock_obj.strongSell);
    add_div(stats_bar, "two", stock_obj.sell);
    add_div(stats_bar, "three", stock_obj.hold);
    add_div(stats_bar, "four", stock_obj.buy);
    add_div(stats_bar, "five", stock_obj.strongBuy);
    add_div(stats_bar, "strongbuy", "Strong Buy");
    stock_div.append(stats_bar);
    add_div(stock_div, "rtrends", "Recommendation Trends"); 
}

function check_date(number){
    if(number < 9)
        return '0'+number;
    else
        return number;
}

function build_charts(){

    document.getElementById('charts').style.display = "none";
    const stock_prices = [];
    const stock_volume = [];
    array_1 = display_obj.t;
    array_2 = display_obj.c;
    array_3 = display_obj.v;
    var today = new Date();
    var today_date = ''+today.getFullYear()+'-'+check_date(today.getMonth()+1)+'-'+check_date(today.getDate());

    for (var i=0; i<array_1.length; i++)
    {
        stock_prices[i] = [array_1[i]*1000, array_2[i]];
        stock_volume[i] = [array_1[i]*1000, array_3[i]];
    }
    
    Highcharts.stockChart("charts", {

        title: {
            text: "Stock Price "+company_obj.ticker+" "+today_date
        },

        subtitle: {
            useHTML: true,
            text: '<a target= "_blank" href="https://finnhub.io/">Source: Finnhub</a>'
        },

        rangeSelector: {
            allButtonsEnabled: true,
            inputEnabled: false,
            buttons: [
                {
                    type: 'day',
                    count: 7,
                    text: '7d',
                    // title: 'View 7 days'
                },
                {
                    type: 'day',
                    count: 15,
                    text: '15d',
                    // title: 'View 15 days'
                },
                {
                type: 'month',
                count: 1,
                text: '1m',
                // title: 'View 1 month'
            }, {
                type: 'month',
                count: 3,
                text: '3m',
                // title: 'View 3 months'
            }, {
                type: 'month',
                count: 6,
                text: '6m',
                // title: 'View 6 months'
            }],
            selected: 0
        },

        yAxis: [{
            title: {
                text: 'Volume',
            },
            opposite: true
        },{
            title: {
                text: 'Stock Price'
            },
            opposite: false
        }],

        series: [{
            name: 'Stock Price',
            data: stock_prices,
            type: 'area',
            yAxis: 0,
            threshold: null,
            tooltip: {
                valueDecimals: 2
            },
            fillColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops: [
                    [0, Highcharts.getOptions().colors[0]],
                    [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                ]
            }
        },
        {  
            name: 'Volume',
            type: 'column',
            pointWidth: 3,
            yAxis: 1,
            data: stock_volume
        }]
    });
    // document.getElementById('charts').style.display = "none";
}

function create_news_block(news_div, image, title, date, url){

    let new_block = document.createElement("div");
    new_block.setAttribute("class", "news_block");
    var news_logo = document.createElement("img");
    news_logo.setAttribute("src", image);
    news_logo.setAttribute("class", "one");
    new_block.append(news_logo);

    let news_table = document.createElement("table");
    news_table.setAttribute("class", "two");
    let r1 = document.createElement("tr");
    let c1 = document.createElement("td");
    c1.innerHTML = title;
    let r2 = document.createElement("tr");
    let c2 = document.createElement("td");
    const d = new Date(date * 1000);
    const t_day = ''+d.getDay()+' '+month[d.getMonth()]+', '+d.getFullYear();
    c2.innerHTML = t_day;
    let r3 = document.createElement("tr");
    let c3 = document.createElement("td");
    let a3 = document.createElement("a");
    a3.setAttribute("href", url);
    a3.setAttribute("target","_blank");
    a3.innerHTML = "See Original Post";
    r1.append(c1);
    news_table.append(r1);
    r2.append(c2);
    news_table.append(r2);
    c3.append(a3);
    r3.append(c3);
    news_table.append(r3);
    new_block.append(news_table);
    news_div.append(new_block);   
    // document.getElementById('news').style.display = "none";
}

function build_news(){
    document.getElementById('news').style.display = "none";
    var news_div = document.getElementById("news");
    create_news_block(news_div, news_obj.image_1, news_obj.title_1, news_obj.date_1, news_obj.url_1);
    create_news_block(news_div, news_obj.image_2, news_obj.title_2, news_obj.date_2, news_obj.url_2);
    create_news_block(news_div, news_obj.image_3, news_obj.title_3, news_obj.date_3, news_obj.url_3);
    create_news_block(news_div, news_obj.image_4, news_obj.title_4, news_obj.date_4, news_obj.url_4);
    create_news_block(news_div, news_obj.image_5, news_obj.title_5, news_obj.date_5, news_obj.url_5);
}

function build_error_block(){
    var error_block = document.getElementById("error");
    var error_message = document.createElement("p");
    error_message.setAttribute("id", "error_message");
    error_message.innerHTML = "Error: No record has been found, please enter a valid symbol";
    error_block.append(error_message);
}

f.addEventListener('submit', function(e) {
    e.preventDefault();
    let isvalid = validate();

    if(isvalid)
    {
        document.getElementById("error").innerHTML = "";
        document.getElementById("nav-bar").innerHTML = "";
        document.getElementById("company").innerHTML = "";
        document.getElementById("summary").innerHTML = "";
        document.getElementById("charts").innerHTML = "";
        document.getElementById("news").innerHTML = "";
        let req1 = new XMLHttpRequest();
        c_url = '/getcompany/' + q.value;
        req1.open('GET', c_url, true);
        req1.onreadystatechange = function(){
            if (req1.readyState == 4) {
                if (req1.status == 200){
                    company_obj = JSON.parse(req1.responseText);
                    if (Object.keys(company_obj).length == 1)
                        build_error_block();
                    else
                    {
                        initial_display();
                        console.log(company_obj);
                        let req2 = new XMLHttpRequest();
                        c_url = '/getstocksummary/' + q.value;
                        req2.open('GET', c_url, true);
                        req2.onreadystatechange = function(){
                            if (req2.readyState == 4) {
                                if (req2.status == 200){
                                    stock_obj = JSON.parse(req2.responseText);
                                    console.log(stock_obj);
                                    build_stock();
                                }
                            }
                        };
                        req2.send();

                        let req3 = new XMLHttpRequest();
                        c_url = '/displaycharts/' + q.value;
                        req3.open('GET', c_url, true);
                        req3.onreadystatechange = function(){
                            if (req3.readyState == 4) {
                                if (req3.status == 200){
                                    display_obj = JSON.parse(req3.responseText);
                                    console.log(display_obj);
                                    build_charts();
                                }
                            }
                        };
                        req3.send();

                        let req4 = new XMLHttpRequest();
                        c_url = '/displaynews/' + q.value;
                        req4.open('GET', c_url, true);
                        req4.onreadystatechange = function(){
                            if (req4.readyState == 4) {
                                if (req4.status == 200){
                                    news_obj = JSON.parse(req4.responseText);
                                    console.log(news_obj);
                                    build_news();
                                }
                            }
                        };
                        req4.send();
                    }
                }
            }
        };
        req1.send();
    }

});

const validate = () => {
    let valid = false; 
    if(q.value != "")
        valid = true;
    else
        alert('You entered nothing');
    return valid;
    
}
const dynamic = document.getElementById('dynamic');
reset.addEventListener('click', function(e) {
    document.getElementById("error").innerHTML = "";
    document.getElementById("nav-bar").innerHTML = "";
    document.getElementById("company").innerHTML = "";
    document.getElementById("summary").innerHTML = "";
    document.getElementById("charts").innerHTML = "";
    document.getElementById("news").innerHTML = "";
});