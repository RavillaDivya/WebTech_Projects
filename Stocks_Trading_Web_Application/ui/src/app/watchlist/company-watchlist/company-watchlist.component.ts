import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CompanyClass } from '../../company-class.model';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
    selector: 'app-company-watchlist',
    templateUrl: './company-watchlist.component.html',
    styleUrls: ['./company-watchlist.component.css']
})

export class CompanyWatchlistComponent implements OnInit {

    @Input()
    company: CompanyClass;

    @Output()
    companyChange = new EventEmitter<CompanyClass>();

    watchlist: Map<string, CompanyClass>;

    constructor (private localStorageService: LocalStorageService) {
        localStorageService.watchlistData.subscribe(val => {
            this.watchlist = val;
        })
    }

    ngOnInit(): void {
        console.log("wl createed");
    }

    tickerStatus(): string {
        if (this.company.dp < 0) {
            return 'red';
        } else if (this.company.dp > 0) {
            return 'green';
        } else {
            return '';
        }
    }
    
    removeCompany(): void {
        this.watchlist.delete(this.company.ticker);
        this.localStorageService.updateWatchlist(this.watchlist);
        this.companyChange.emit(this.company);
    }
}
