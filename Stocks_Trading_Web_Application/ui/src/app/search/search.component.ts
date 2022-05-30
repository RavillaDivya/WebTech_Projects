import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

import { debounceTime, tap, switchMap, finalize, distinctUntilChanged, filter } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { StockService } from '../services/stock.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.sass']
})
export class SearchComponent implements OnInit {

    @ViewChild('validTickerAlert', { static: false }) validTickerAlert: NgbAlert;
    validTickerMessage = '';
    noDataFoundMessage = '';

    searchStockCtrl = new FormControl();
    isLoading = false;
    selectedStock: any;
    stockSuggestions: any;

    companyProfile: any;

    constructor (
        private stockService: StockService, private route: ActivatedRoute, private router: Router,
    ) {
        this.route.params.subscribe(params => {
            console.log(params);
            if (params["symbol"] && params["symbol"].toUpperCase() !== 'HOME') {
                //this.selectedStock = params["symbol"].toUpperCase();
                this.searchProfile(params["symbol"].toUpperCase())
            } else {
                localStorage.setItem('selectedStock', '');
            }
        });
    }

    searchStock(): void {
        var input = this.searchStockCtrl.value;
        console.log("type input ", input);
        if (input) {
            this.validTickerAlert?.close();
            this.router.navigate(['/search/' + input.toUpperCase()]);
        } else {
            this.validTickerMessage = 'Please enter a valid ticker.';
        }
    }

    searchProfile(stock: string): void {
        this.searchStockCtrl.setValue(stock);
        this.stockService.getCompanyProfile(stock)
            .subscribe((data: any) => {
                if (!this.isEmptyObject(data)) {
                    this.noDataFoundMessage = ''
                    this.companyProfile = data;
                    this.selectedStock = stock;
                    localStorage.setItem('selectedStock', stock)
                } else {
                    this.companyProfile = null;
                    this.selectedStock = '';
                    this.noDataFoundMessage = "No data found. Please enter a valid Ticker";
                    localStorage.setItem('selectedStock', '')
                }
            });
        this.selectedStock = stock;
    }

    displayWith(stock: any) {
        return stock?.symbol;
    }

    clearResults(): void {
        this.validTickerAlert?.close();
        this.searchStockCtrl.setValue('');
        this.selectedStock = ''
        this.noDataFoundMessage = '';
        this.companyProfile = null;
        this.stockSuggestions = [];
        this.router.navigate(['/search/' + '']);
    }

    onSelected(value: any) {
        this.stockSuggestions = [];
        console.log(this.selectedStock);
        //this.setStockValue(value?.option?.value?.toUpperCase())
        this.selectedStock = value?.option?.value?.toUpperCase();
        this.router.navigate(['/search/' + this.selectedStock]);
    }

    ngOnInit(): void {
        this.searchStockCtrl
            .valueChanges
            .pipe(
                filter(val => {
                    return val && val !== null && val.trim().length > 0
                }),
                debounceTime(500),
                distinctUntilChanged((a: any, b: any) => {
                    return false;//JSON.stringify(a).toLowerCase() === JSON.stringify(b).toLowerCase();
                }),
                tap(() => {
                    this.noDataFoundMessage = ''
                    this.isLoading = true;
                    this.stockSuggestions = []
                }),
                switchMap((value: string) => this.stockService.searchCompany(value)
                    .pipe(
                        finalize(() => this.isLoading = false),
                    )
                )
            ).subscribe((data: any) => {
                this.stockSuggestions = [];
                if (data) {
                    this.stockSuggestions = data['result'].filter((ele: any) => !ele.symbol.includes(".") && ele.type === "Common Stock");
                }
                if (!(this.stockSuggestions.length > 0)) {
                    this.stockSuggestions = []
                    this.isLoading = false;
                    //this.companyProfile = null;
                    this.companyProfile = null;
                    this.noDataFoundMessage = "No data found. Please enter a valid Ticker"
                    console.error("empty data");
                } else {
                    console.error("non empty data");
                    this.noDataFoundMessage = ''
                    this.isLoading = false;
                    this.stockSuggestions = data['result'].filter((ele: any) => !ele.symbol.includes(".") && ele.type === "Common Stock");
                }
            })
    }

    isEmptyObject(obj: any) {
        return (obj && (Object.keys(obj).length === 0));
    }
}
