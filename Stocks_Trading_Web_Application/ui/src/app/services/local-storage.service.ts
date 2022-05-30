import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CompanyClass } from '../company-class.model';
import { LocalStorageRefService } from './local-storage-ref.service';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {

    localStorage: Storage;

    private _walletData$ = new BehaviorSubject<number>(null);
    walletData = this._walletData$.asObservable();

    private _portfolioData$ = new BehaviorSubject<Map<string, CompanyClass>>(new Map());
    portfolioData = this._portfolioData$.asObservable();

    private _watchlistData$ = new BehaviorSubject<Map<string, CompanyClass>>(new Map());
    watchlistData = this._watchlistData$.asObservable();

    constructor (private localStorageRefService: LocalStorageRefService) {
        this.localStorage = localStorageRefService.localStorage;
        this.loadWallet();
        this.loadPortfolio();
        this.loadWatchlist();
    }

    loadWallet(): void {
        if (this.localStorage.getItem("wallet")) {
            this._walletData$.next(Number(this.localStorage.getItem("wallet")));
        } else {
            this.updateWallet(25000);
        }
    }

    loadPortfolio(): void {
        if (this.localStorage.getItem("portfolio") && this.localStorage.getItem("portfolio") !== '{}') {
            this._portfolioData$.next(this.jsonStringToMap(this.localStorage.getItem("portfolio")))
        }
    }

    loadWatchlist(): void {
        if (this.localStorage.getItem("watchlist") && this.localStorage.getItem("watchlist") !== '{}') {
            this._watchlistData$.next(this.jsonStringToMap(this.localStorage.getItem("watchlist")))
        }
    }

    updateWallet(data: number): void {
        this.localStorage.setItem("wallet", data.toString());
        this._walletData$.next(data);
    }

    updatePortfolio(data: Map<string, CompanyClass>): void {
        this.localStorage.setItem("portfolio", this.mapToJsonString(data));
        this._portfolioData$.next(data);
    }

    updateWatchlist(data: Map<string, CompanyClass>): void {
        this.localStorage.setItem("watchlist", this.mapToJsonString(data));
        this._watchlistData$.next(data);
    }

    getWatchlistMap(): Map<string, CompanyClass> {
        if (this.localStorage.getItem("watchlist") && this.localStorage.getItem("watchlist") !== '{}') {
            return this.jsonStringToMap(this.localStorage.getItem("watchlist"));
        } else {
            return new Map;
        }
    }

    getPortfolioMap(): Map<string, CompanyClass> {
        if (this.localStorage.getItem("portfolio") && this.localStorage.getItem("portfolio") !== '{}') {
            return this.jsonStringToMap(this.localStorage.getItem("portfolio"));
        } else {
            return new Map;
        }
    }

    mapToJsonString(data: Map<string, CompanyClass>): string {
        const jsObj = {};
        data.forEach(function (value, key) {
            jsObj[key] = value;
        });
        return JSON.stringify(jsObj);
    }

    jsonStringToMap(data: string): Map<string, CompanyClass> {
        var jsObj = JSON.parse(data);
        let map = new Map<string, CompanyClass>()
        for (var value in jsObj) {
            var company = jsObj[value];
            map.set(value, Object.assign(new CompanyClass(company.ticker, company.name, company.quantity, company.total, company.c, company.d, company.dp)))
        }
        return map;
    }
}
