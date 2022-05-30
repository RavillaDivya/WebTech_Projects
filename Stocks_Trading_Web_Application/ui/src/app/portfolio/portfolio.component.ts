import { Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { CompanyClass } from '../company-class.model';
import { LocalStorageService } from '../services/local-storage.service';

@Component({
    selector: 'app-portfolio',
    templateUrl: './portfolio.component.html',
    styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit, OnChanges {

    @ViewChild('selfClosingTransaction', { static: false }) selfClosingTransaction: NgbAlert;
    transactionMessage = '';
    transactionType = '';
    transactionAlertTimer: any;


    quantity: number = 0;
    wallet!: number;
    portfolio: Map<string, CompanyClass> = new Map();
    buyMessage: CompanyClass;
    sellMessage: CompanyClass;

    constructor (private localStorageService: LocalStorageService) {
        localStorageService.walletData.subscribe(val => {
            this.wallet = val;
        });
        localStorageService.portfolioData.subscribe(val => {
            this.portfolio = val;
        })
    }

    ngOnInit(): void {
        this.localStorageService.walletData.subscribe(val => {
            this.wallet = val;
        });
        this.localStorageService.portfolioData.subscribe(val => {
            this.portfolio = val;
        })

    }

    ngOnChanges(changes: SimpleChanges): void {
    }

    setBuyMessage(data: CompanyClass): void {
        this.setTransactionMessage(data?.ticker?.toUpperCase() + ' bought successfully.', 'success');
    }

    setSellMessage(data: CompanyClass): void {
        this.setTransactionMessage(data?.ticker?.toUpperCase() + ' sold successfully.', 'danger');
    }

    setTransactionMessage(message, type): void {
        clearTimeout(this.transactionAlertTimer);
        this.transactionMessage = message;
        this.transactionType = type;
        this.transactionAlertTimer = setTimeout(() => this.selfClosingTransaction?.close(), 5000);
    }

    asIsOrder(a, b) {
        return 1;
    }
}
