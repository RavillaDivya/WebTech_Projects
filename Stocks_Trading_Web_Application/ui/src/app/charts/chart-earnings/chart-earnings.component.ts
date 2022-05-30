import { Component, OnInit, Input, OnChanges, AfterViewInit, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';
import NoData from "highcharts/modules/no-data-to-display";

NoData(Highcharts);

@Component({
    selector: 'app-chart-earnings',
    templateUrl: './chart-earnings.component.html',
    styleUrls: ['./chart-earnings.component.css']
})
export class ChartEarningsComponent implements OnInit, OnChanges, AfterViewInit {

    @Input()
    selectedStock!: any;

    @Input()
    companyEarnings!: any;


    updateFlag = false;
    earnings = Highcharts;
    earningsData = this.getEmptyEarningsData();

    constructor () {
        this.updateEarningsChart();

    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.updateFlag = true;
    }
    ngOnChanges(changes: SimpleChanges): void {
        this.updateEarningsChart();
        this.updateFlag = true;
    }

    updateEarningsChart(): void {
        this.refreshEarningsData();
        this.updateEarningsOption();
    }

    updateEarningsOption(): void {
        this.earningsChartOptions.series = [
            {
                name: 'Actual',
                data: this.earningsData['actual'],
                type: 'spline'
            },
            {
                name: 'Estimate',
                data: this.earningsData['estimate'],
                type: 'spline'
            }
        ];
        this.earningsChartOptions.xAxis.categories = this.earningsData['xAxis'];

    }

    earningsChartOptions = {
        chart: {
            type: "spline"
        },
        title: {
            text: "Historical EPS Surprises"
        },
        xAxis: {
            reversed: false,
            maxPadding: 0.05,
            showLastLabel: true,
            categories: []
        },
        yAxis: {
            title: {
                text: "Quarterly EPS"
            }
        },
        tooltip: {
            shared: true
        },
        series: []
    };



    refreshEarningsData(): void {
        if (this.companyEarnings) {
            this.earningsData = this.getEmptyEarningsData();
            for (var i = 0; i < this.companyEarnings.length; i++) {
                this.earningsData['xAxis'].push(this.companyEarnings[i]['period'] + "<br>Surprise: " + this.formatValue(this.companyEarnings[i]['surprise']));
                this.earningsData['actual'].push(this.formatValue(this.companyEarnings[i]['actual']));
                this.earningsData['estimate'].push(this.formatValue(this.companyEarnings[i]['estimate']));
            }
        }
    }

    formatValue(data: any): any {
        if (data) {
            return data;
        }
        return 0;
    }



    getEmptyEarningsData(): any {
        return {
            "xAxis": [],
            "estimate": [],
            "actual": []
        };
    }

}
