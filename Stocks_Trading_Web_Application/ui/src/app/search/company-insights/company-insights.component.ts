import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
    selector: 'app-company-insights',
    templateUrl: './company-insights.component.html',
    styleUrls: ['./company-insights.component.css']
})
export class CompanyInsightsComponent implements OnInit, OnChanges {


    @Input()
    selectedStock!: any;

    @Input()
    companyProfile!: any;

    @Input()
    companyEarnings!: any;

    @Input()
    companyRecommendation!: any;

    @Input()
    companySentiment!: any;

    sentimentTableData = this.getEmptySentimentData();

    constructor () {
    }

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.refreshSentimentTableData();
    }

    refreshSentimentTableData(): void {
        this.sentimentTableData = this.getEmptySentimentData();
        if (this.companySentiment?.reddit) {
            this.sentimentTableData.reddit = this.companySentiment.reddit
                .reduce((p, c) => [p[0] + c['mention'], p[1] + c['positiveMention'], p[2] + c['negativeMention']], [0, 0, 0]);
        }
        if (this.companySentiment?.twitter) {
            this.sentimentTableData.twitter = this.companySentiment.twitter
                .reduce((p, c) => [p[0] + c['mention'], p[1] + c['positiveMention'], p[2] + c['negativeMention']], [0, 0, 0]);
        }
    }

    getEmptySentimentData(): any {
        return {
            reddit: [0, 0, 0],
            twitter: [0, 0, 0]
        }
    }

}
