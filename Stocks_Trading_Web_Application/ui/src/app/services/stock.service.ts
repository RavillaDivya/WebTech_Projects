import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class StockService {
    private backendUrl = "/api";

    constructor (private http: HttpClient) { }

    getCompanyProfile(symbol: string): Observable<any> {
        const url = `${this.backendUrl}/profile?symbol=${symbol}`;
        return this.http.get(url);
    }

    getCompanyQuote(symbol: string): Observable<any> {
        const url = `${this.backendUrl}/quote?symbol=${symbol}`;
        return this.http.get(url);
    }

    searchCompany(symbol: string): Observable<any> {
        const url = `${this.backendUrl}/suggest?symbol=${symbol}`;
        return this.http.get(url);
    }

    getCompanyPeers(symbol: string): Observable<any> {
        const url = `${this.backendUrl}/peers?symbol=${symbol}`;
        return this.http.get(url);
    }

    getCompanyRecommendation(symbol: string): Observable<any> {
        const url = `${this.backendUrl}/recommendation?symbol=${symbol}`;
        return this.http.get(url);
    }

    getCompanyEarnings(symbol: string): Observable<any> {
        const url = `${this.backendUrl}/earnings?symbol=${symbol}`;
        return this.http.get(url);
    }

    getCompanySentiment(symbol: string): Observable<any> {
        const url = `${this.backendUrl}/sentiment?symbol=${symbol}`;
        return this.http.get(url);
    }

    getCompanyNews(symbol: string): Observable<any> {
        const url = `${this.backendUrl}/news?symbol=${symbol}`;
        return this.http.get(url);
    }

    getStockCandles(symbol: string, from: number, to: number, resol: string): Observable<any> {
        const url = `${this.backendUrl}/candle2?symbol=${symbol}&from=${from}&to=${to}&resol=${resol}`;
        return this.http.get(url);
    }
}