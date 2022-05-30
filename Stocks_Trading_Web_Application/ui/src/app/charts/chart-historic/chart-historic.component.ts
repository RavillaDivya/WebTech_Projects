import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy, AfterViewInit, AfterViewChecked } from '@angular/core';

import * as Highcharts from "highcharts/highstock.src";
import { Options } from "highcharts/highstock";
import IndicatorsCore from "highcharts/indicators/indicators-all.src";
import vbp from "highcharts/indicators/volume-by-price";
import NoData from "highcharts/modules/no-data-to-display";


IndicatorsCore(Highcharts)
NoData(Highcharts)
//vbp(Highcharts)

@Component({
    selector: 'app-chart-historic',
    templateUrl: './chart-historic.component.html',
    styleUrls: ['./chart-historic.component.css']
})
export class ChartHistoricComponent implements OnInit, OnChanges, OnDestroy, AfterViewChecked {

    @Input()
    selectedStock!: any;

    @Input()
    historicalPrices!: any;

    constructor () {
        this.transformData();
    }

    ngAfterViewChecked(): void {
        window.dispatchEvent(new Event('resize'));
    }

    ngOnInit(): void {
        this.chartOptions.title.text = this.selectedStock + ' Historical';
        this.chartOptions.series = [{
            type: 'candlestick',
            name: this.selectedStock,
            id: 'aapl',
            zIndex: 2,
            data: this.ohlc,
            tooltip: {
                valueDecimals: 2
            }
        }, {
            type: 'column',
            name: 'Volume',
            id: 'volume',
            data: this.volume,
            yAxis: 1
        },
        {
            type: 'vbp',
            linkedTo: 'aapl',
            params: {
                volumeSeriesID: 'volume'
            },
            dataLabels: {
                enabled: false
            },
            zoneLines: {
                enabled: false
            }
        },
        {
            type: 'sma',
            linkedTo: 'aapl',
            zIndex: 1,
            marker: {
                enabled: false
            },
            tooltip: {
                valueDecimals: 2
            }
        }]
        console.log(this.selectedStock);
        this.updateFlag = true;

    }


    ngOnDestroy(): void {

    }

    ohlc: number[][] = [];
    volume: number[][] = [];
    updateFlag = false;
    chartRef: any;

    groupingUnits: [string, number[] | null][] = [['day', [1]],
    ['month', [1, 2, 3, 4, 6]]];

    Highcharts: typeof Highcharts = Highcharts;


    chartCallback: Highcharts.ChartCallbackFunction = (chart): void => {
        this.chartRef = chart;
        window.dispatchEvent(new Event('resize'));
    };

    chartOptions: Options = {

        rangeSelector: {
            selected: 2,
            enabled: true,
            inputEnabled: true
        },

        title: {
            text: this.selectedStock + ' Historical'
        },

        subtitle: {
            text: 'With SMA and Volume by Price technical indicators'
        },

        yAxis: [{
            startOnTick: false,
            endOnTick: false,
            opposite: true,
            labels: {
                align: 'right',
                x: -3
            },
            title: {
                text: 'OHLC'
            },
            height: '60%',
            lineWidth: 2,
            resize: {
                enabled: true
            }
        }, {
            opposite: true,
            labels: {
                align: 'right',
                x: -3
            },
            title: {
                text: 'Volume'
            },
            top: '65%',
            height: '35%',
            offset: 0,
            lineWidth: 2
        }],

        tooltip: {
            split: true
        },

        series: [{
            type: 'candlestick',
            name: 'AAPL',
            id: 'aapl',
            zIndex: 2,
            data: []
        }, {
            type: 'column',
            name: 'Volume',
            id: 'volume',
            data: [],
            yAxis: 1
        },
        {
            type: 'vbp',
            linkedTo: 'aapl',
            params: {
                volumeSeriesID: 'volume'
            },
            dataLabels: {
                enabled: false
            },
            zoneLines: {
                enabled: false
            }
        },
        {
            type: 'sma',
            linkedTo: 'aapl',
            zIndex: 1,
            marker: {
                enabled: false
            }
        }]
    };

    ngOnChanges(changes: SimpleChanges): void {
        this.transformData();

        this.updateFlag = true;
    }

    transformData(): void {
        if (this.historicalPrices?.s === 'ok') {
            this.ohlc = [];
            this.volume = [];
            for (var i = 0; i < this.historicalPrices.t.length; i += 1) {
                this.ohlc.push([
                    this.historicalPrices.t[i] * 1000, 
                    this.historicalPrices.o[i], 
                    this.historicalPrices.h[i], 
                    this.historicalPrices.l[i],
                    this.historicalPrices.c[i]
                ]);
                this.volume.push([
                    this.historicalPrices.t[i] * 1000, 
                    this.historicalPrices.v[i],
                ]);
            }
        }
    }

}
