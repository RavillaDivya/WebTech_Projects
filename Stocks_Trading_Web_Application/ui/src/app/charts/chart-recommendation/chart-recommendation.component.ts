import { Component, OnInit, Input, OnChanges, AfterViewInit, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';
import NoData from "highcharts/modules/no-data-to-display";

NoData(Highcharts);

@Component({
    selector: 'app-chart-recommendation',
    templateUrl: './chart-recommendation.component.html',
    styleUrls: ['./chart-recommendation.component.css']
})
export class ChartRecommendationComponent implements OnInit, OnChanges, AfterViewInit {

    @Input()
    selectedStock!: any;

    @Input()
    companyRecommendation!: any;

    recommendation = Highcharts;
    updateFlag = false;
    recommendationData = this.getEmptyRecommData();

    constructor () {
        this.updateRecomChart();
        this.updateFlag = true;
    }

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.updateRecomChart();
        this.updateFlag = true;
    }

    ngAfterViewInit(): void {
        this.updateFlag = true;
    }

    updateRecomChart(): void {
        this.refreshRecomData();
        this.updateRecomOption()
    }

    updateRecomOption(): void {
        this.recomChartOptions.series = [
            {
                name: 'Strong Buy',
                data: this.recommendationData['strongBuy']
            },
            {
                name: 'Buy',
                data: this.recommendationData['buy']
            },
            {
                name: 'Hold',
                data: this.recommendationData['hold']
            },
            {
                name: 'Sell',
                data: this.recommendationData['sell']
            }, {
                name: 'Strong Sell',
                data: this.recommendationData['strongSell']
            }
        ];
        this.recomChartOptions.xAxis = {
            categories: this.recommendationData['xAxis'], title: {
                text: null
            }
        };
    }





    recomChartOptions = {
        chart: {
            type: 'column'
        },
        colors: ['#427E4E', '#66BF73', '#C19C46', "#EB7C74", '#8C4843'],
        title: {
            text: 'Recommendation Trends'
        },
        legend: {
            align: 'center',
            verticalAlign: 'bottom',
            floating: false,
            borderColor: 'white',
            borderWidth: 1,
            backgroundColor: (
                '#FFFFFF'),
            shadow: false
        },
        xAxis: {
            categories: [],
            title: {
                text: null
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: '#Analysis',
                align: 'high'
            },
            labels: {
                overflow: 'justify'
            }
        },
        // tooltip: {
        //   valueSuffix: ' millions'
        // },
        plotOptions: {
            column: {
                dataLabels: {
                    enabled: true
                }
            },
            series: {
                stacking: 'normal'
            }
        },
        credits: {
            enabled: false
        },
        series: [

        ]
    };

    refreshRecomData(): void {
        if (this.companyRecommendation) {
            this.recommendationData = this.getEmptyRecommData();
            for (var i = 0; i < this.companyRecommendation.length; i++) {
                this.recommendationData['xAxis'].push(this.companyRecommendation[i]['period']?.substring(0, 7));
                this.recommendationData['strongBuy'].push(this.companyRecommendation[i]['strongBuy']);
                this.recommendationData['buy'].push(this.companyRecommendation[i]['buy']);
                this.recommendationData['hold'].push(this.companyRecommendation[i]['hold']);
                this.recommendationData['sell'].push(this.companyRecommendation[i]['sell']);
                this.recommendationData['strongSell'].push(this.companyRecommendation[i]['strongSell']);
            }
        }
    }

    getEmptyRecommData(): any {
        return {
            "xAxis": [],
            "strongBuy": [],
            "buy": [],
            "hold": [],
            "sell": [],
            "strongSell": []
        };
    }
}
