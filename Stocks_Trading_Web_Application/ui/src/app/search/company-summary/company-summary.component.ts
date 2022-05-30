import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';
import NoData from "highcharts/modules/no-data-to-display";

NoData(Highcharts);

@Component({
    selector: 'app-company-summary',
    templateUrl: './company-summary.component.html',
    styleUrls: ['./company-summary.component.css']
})
export class CompanySummaryComponent implements OnInit {

    @Input() selectedStock!: any;

    @Input()
    companyProfile!: any;
    @Input()
    companyQuote!: any;
    @Input()
    companyPeers!: any;
    @Input()
    hourlyPrices!: any;

    stockData!: [];
    updateFlag = false;
    Highcharts: typeof Highcharts = Highcharts;
    companyPeerHyperLinks: any;

    chartCallback: Highcharts.ChartCallbackFunction = function (chart): void {
        setTimeout(() => {
            chart.reflow();
        }, 0);
    }

    chartOptions: Highcharts.Options = {
        yAxis: {
            opposite: true,
            title: {
                text: ''
            },
            scrollbar: {
                enabled: true
            }

        },
        xAxis: {
            scrollbar: {
                enabled: true
            }
        },
        series: [{
            data: [],
            type: 'line'
        }]
    };

    getData(): void {
        if (this.hourlyPrices && this.hourlyPrices.s === 'ok') {
            var stock = this.hourlyPrices.c.map((st: number) => [st]);
            var time = this.hourlyPrices.t.map((tm: number) => [tm * 1000])
            this.stockData = time.map((tm: [], i: number) => tm.concat(stock[i]));
            this.chartOptions = {
                time: {
                    useUTC: false
                },
                plotOptions: {
                    line: {
                        color: this.companyQuote?.dp > 0 ? 'green' : this.companyQuote?.dp < 0 ? 'red' : '',
                        marker: {
                            enabled: false
                        }
                    }
                },
                yAxis: {
                    opposite: true,
                    title: {
                        text: ''
                    },
                    scrollbar: {
                        enabled: true
                    }
                },

                title: {
                    text: this.selectedStock + ' Hourly Price Variation'
                },
                xAxis: {
                    type: 'datetime',
                    title: {
                        text: ''
                    },
                    scrollbar: {
                        enabled: true
                    },
                    crosshair: true
                },
                tooltip: {
                    split: true
                },
                series: [{
                    showInLegend: false,
                    name: this.selectedStock,
                    type: 'line',
                    data: this.stockData,
                    tooltip: {
                        valueDecimals: 2
                    }
                }]
            }
            this.updateFlag = true;
        }
    }

    constructor () { }

    ngOnInit(): void {
        this.getData();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.setCompanyPeers();
        this.getData();

    }

    setCompanyPeers(): void {
        if (this.companyPeers) {
            this.companyPeers = this.companyPeers.filter(peer => peer && !peer.includes("."));
            //this.companyPeerHyperLinks = this.companyPeers.filter(peer => peer && !peer.includes("."));
                // .map(item => '<div [routerLink]="/search/' + item + '">' + item + '</div>')
                // .join(", ");
        }
    }

}
