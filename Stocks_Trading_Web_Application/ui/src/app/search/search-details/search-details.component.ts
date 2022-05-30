import { Component, OnInit, Input, SimpleChanges, OnChanges, OnDestroy, AfterViewChecked, Output, EventEmitter, ComponentFactoryResolver, ViewChild, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { CompanyClass } from 'src/app/company-class.model';
import { StockService } from '../../services/stock.service';
import { UtilService } from '../../services/util.service';
import { ChartHistoricComponent } from '../../charts/chart-historic/chart-historic.component'
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ThrowStmt } from '@angular/compiler';

@Component({
    selector: 'app-search-details',
    templateUrl: './search-details.component.html',
    styleUrls: ['./search-details.component.css']
})
export class SearchDetailsComponent implements OnInit, OnChanges, AfterViewChecked {

    @Input()
    selectedStock!: any;

    @Input()
    companyProfile!: any;
    companyQuote!: any;
    companyPeers!: any;
    hourlyPrices!: any;
    historicalPrices!: any;
    companyRecommendation!: any;
    companyEarnings!: any;
    companySentiment!: any;
    companyNews!: any;
    historicalChartData: any[] = [];

    isLoading = true;
    loadingCounter = 0;
    //dontDestoy = true;

    @ViewChild(ChartHistoricComponent) chartHistoricComponent: ChartHistoricComponent;
    @ViewChild('messagecontainer', { read: ViewContainerRef }) entry: ViewContainerRef;

    timerId: any;

    constructor (private stockService: StockService, private utilService: UtilService, private localStorageService: LocalStorageService, private componentFactoryResolver: ComponentFactoryResolver, private changeDetectorRef: ChangeDetectorRef) { }

    ngAfterViewChecked(): void {
        //window.dispatchEvent(new Event('resize'));
    }

    ngOnInit() {
        //this.refreshData();
        this.refreshLocalStorage();
    }

    handleChange($event): void {
        //window.dispatchEvent(new Event('resize'));
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.loadingCounter = 0;
        if (changes.companyProfile) {
            this.historicalPrices = null;
            this.changeDetectorRef.detectChanges();
            this.refreshData();
        }
        
        clearInterval(this.timerId);
        if ((this.companyQuote?.t * 1000) <= this.utilService.getDate().valueOf()) {
            this.timerId = setInterval(() => {
            this.refreshData();
            this.refreshLocalStorage()
            }, 15000);
        }
        //this.refreshLocalStorage();

        // clearInterval(this.timerId);
        // this.timerId = setInterval(() => {
        //   this.refreshData();
        //   this.refreshLocalStorage()
        // }, 15000);
    }

    refreshLocalStorage(): void {
        //this.refreshCompanyMap(this.localStorageService.getWatchlistMap()).then(result => this.localStorageService.updateWatchlist(result));
        //this.refreshCompanyMap(this.localStorageService.getPortfolioMap()).then(result => this.localStorageService.updatePortfolio(result));
        this.refreshCompanyMap(this.localStorageService.getWatchlistMap(), false);
        this.refreshCompanyMap(this.localStorageService.getPortfolioMap(), true);
        //this.localStorageService.updateWatchlist(this.refreshCompanyMap2(this.localStorageService.getWatchlistMap()));
        //this.localStorageService.updatePortfolio(this.refreshCompanyMap(this.localStorageService.getPortfolioMap()));
    }

    // refreshCompanyMap(data: Map<string, CompanyClass>): Map<string, CompanyClass> {
    //     let updatedData: Map<string, CompanyClass> = new Map;
    //     data.forEach((val, key, m) => {
    //         let updatedCompany = val;
    //         //const data = await this.stockService.getCompanyQuote(key).toPromise();
    //         this.stockService.getCompanyQuote(key).subscribe((data: any) => {
    //             if (!this.isEmptyObject(data)) {
    //                 updatedCompany = this.responseToCompany(data, val);
    //             }
    //         })
    //         if (!this.isEmptyObject(data)) {
    //             updatedCompany = this.responseToCompany(data, val);
    //         }
    //         updatedData.set(key, updatedCompany);
    //     });
    //     return updatedData;
    // }

    refreshCompanyMap(data: Map<string, CompanyClass>, isPortfolio: boolean): void {
        console.log("reload")
        let updatedData: Map<string, CompanyClass> = new Map;
        const promises = [];
        data.forEach((val, key, m) => {
            //const data = await this.stockService.getCompanyQuote(key).toPromise();
            const promise = this.stockService.getCompanyQuote(key).toPromise().then((result) => {
                if (!this.isEmptyObject(result)) {
                    updatedData.set(key, this.responseToCompany(result, val))
                } else {
                    updatedData.set(key, val);
                }
            }).catch(reason => updatedData.set(key, val));
            promises.push(promise);
        });

        Promise.allSettled(promises).then(results => {
            console.log("promise resolved");
            if (isPortfolio) {
                this.localStorageService.updatePortfolio(updatedData);
            } else {
                this.localStorageService.updateWatchlist(updatedData);
            }
        });
    }

    responseToCompany(data: any, company: CompanyClass): CompanyClass {
        console.log(JSON.stringify(company));
        let newCompany = new CompanyClass(company.ticker, company.name, company.quantity, company.total, data?.c, data?.d, data?.dp);
        return newCompany;
    }

    refreshData(): void {
        //this.getCompanyProfile();
        this.getCompanyQuotes();
        this.getCompanyPeers();
        //this.getHourlyCandles();
        this.getYearlyCandles();
        this.getRecommendation()
        this.getEarnings();
        this.getCompanySentiment();
        this.getCompanyNews();
        this.setHistoricalChartData();
    }


    getCompanyProfile(): void {
        if (this.selectedStock) {
            this.loadingCounter--;
            this.stockService.getCompanyProfile(this.selectedStock)
                .subscribe((data: any) => {
                    this.loadingCounter++;
                    this.isLoading = false;
                    if (!this.isEmptyObject(data)) {
                        this.companyProfile = data;
                        this.getCompanyQuotes();
                        this.getCompanyPeers();
                        //this.getHourlyCandles();
                        this.getYearlyCandles();
                        this.getRecommendation()
                        this.getEarnings();
                        this.getCompanySentiment();
                        this.getCompanyNews();
                        this.setHistoricalChartData();
                    }
                });
        }
    }

    getCompanyQuotes(): void {
        if (this.selectedStock) {
            this.loadingCounter--;
            this.isLoading = true;
            this.stockService.getCompanyQuote(this.selectedStock)
                .subscribe((data: any) => {
                    this.loadingCounter++;
                    this.isLoading = false;
                    if (!this.isEmptyObject(data)) {
                        this.companyQuote = data;
                        this.getHourlyCandles();
                    }
                });
        }
    }

    getCompanyPeers(): void {
        if (this.selectedStock) {
            this.loadingCounter--;
            this.isLoading = true;
            this.stockService.getCompanyPeers(this.selectedStock)
                .subscribe((data: any) => {
                    this.loadingCounter++;
                    this.isLoading = false;
                    if (!this.isEmptyObject(data)) {
                        this.companyPeers = data;
                    }
                });
        }
    }

    getHourlyCandles(): void {
        if (this.selectedStock) {
            this.loadingCounter--;
            this.isLoading = true;
            var to = this.utilService.getDate().unix();
            if (to > this.companyQuote.t) {
                to = this.companyQuote.t;
            }
            var from = this.utilService.getDateFromEpoch(to).subtract(6, 'hours').unix();
            this.stockService.getStockCandles(this.selectedStock, from, to, '5')
                .subscribe((data: any) => {
                    this.loadingCounter++;
                    this.isLoading = false;
                    if (!this.isEmptyObject(data)) {
                        this.hourlyPrices = data;
                    }
                });
        }
    }

    getYearlyCandles(): void {
        if (this.selectedStock) {
            this.loadingCounter--;
            this.isLoading = true;
            var to = this.utilService.getDate().unix();
            var from = this.utilService.getDateFromEpoch(to).subtract(2, 'years').unix();
            this.stockService.getStockCandles(this.selectedStock, from, to, 'D')
                .subscribe((data: any) => {
                    this.loadingCounter++;
                    this.isLoading = false;
                    if (!this.isEmptyObject(data)) {
                        this.historicalPrices = data;
                        //this.dontDestoy = true;
                        this.setHistoricalChartData();
                    }
                });
        }
    }

    getRecommendation(): void {
        if (this.selectedStock) {
            this.loadingCounter--;
            this.isLoading = true;
            this.stockService.getCompanyRecommendation(this.selectedStock)
                .subscribe((data: any) => {
                    this.loadingCounter++;
                    this.isLoading = false;
                    if (!this.isEmptyObject(data)) {
                        this.companyRecommendation = data;
                    }
                });
        }
    }

    getEarnings(): void {
        if (this.selectedStock) {
            this.loadingCounter--;
            this.isLoading = true;
            this.stockService.getCompanyEarnings(this.selectedStock)
                .subscribe((data: any) => {
                    this.loadingCounter++;
                    this.isLoading = false;
                    if (!this.isEmptyObject(data)) {
                        this.companyEarnings = data;
                    }
                });
        }
    }

    getCompanySentiment(): void {
        if (this.selectedStock) {
            this.loadingCounter--;
            this.isLoading = true;
            this.stockService.getCompanySentiment(this.selectedStock)
                .subscribe((data: any) => {
                    this.loadingCounter++;
                    this.isLoading = false;
                    if (!this.isEmptyObject(data)) {
                        this.companySentiment = data;
                    }
                });
        }
    }

    getCompanyNews(): void {
        if (this.selectedStock) {
            this.loadingCounter--;
            this.isLoading = true;
            this.stockService.getCompanyNews(this.selectedStock)
                .subscribe((data: any) => {
                    this.loadingCounter++;
                    this.isLoading = false;
                    if (!this.isEmptyObject(data)) {
                        this.companyNews = data
                            .filter(news => news && news.image && news.headline && news.source && news.summary && news.datetime && news.url)
                            .slice(0, 20);
                    }
                });
        }
    }

    setHistoricalChartData(): void {
        // this.entry.clear();
        // const facory = this.componentFactoryResolver.resolveComponentFactory(ChartHistoricComponent);
        // const ref = this.entry?.createComponent(facory);
        // ref.instance.selectedStock = this.selectedStock;
        // ref.instance.historicalPrices = this.historicalChartData;

        if (this.selectedStock) {
            this.historicalChartData = [];
            this.historicalChartData.push({ name: this.selectedStock, data: this.historicalPrices });
        }

    }
    isEmptyObject(obj: any) {
        return (obj && (Object.keys(obj).length === 0));
    }

}
