import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { CompanyClass } from '../company-class.model';
import { LocalStorageService } from '../services/local-storage.service';

@Component({
    selector: 'app-watchlist',
    templateUrl: './watchlist.component.html',
    styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {

    @ViewChild('selfClosingAlert', { static: false }) selfClosingAlert: NgbAlert;
    watchlist: Map<string, CompanyClass> = new Map();
    message: CompanyClass;

    constructor (private localStorageService: LocalStorageService) {
        localStorageService.watchlistData.subscribe(value => {
            this.watchlist = value;  
        })
    }

    setMessage(data: CompanyClass): void {
        this.message = data;
        setTimeout(() => this.selfClosingAlert.close(), 5000);
    }
    
    ngOnInit(): void {
    }
}
