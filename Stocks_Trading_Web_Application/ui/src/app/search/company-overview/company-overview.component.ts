import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { CompanyClass } from '../../company-class.model';
import { LocalStorageService } from '../../services/local-storage.service';
import { BuyModalComponent } from '../../modal/buy-modal/buy-modal.component';
import { SellModalComponent } from '../../modal/sell-modal/sell-modal.component';
import { UtilService } from '../../services/util.service';

@Component({
    selector: 'app-company-overview',
    templateUrl: './company-overview.component.html',
    styleUrls: ['./company-overview.component.css']
})
export class CompanyOverviewComponent implements OnInit, OnChanges {

    @Input()
    selectedStock!: any;
    @Input()
    companyProfile!: any;
    @Input()
    companyQuote!: any;


    @ViewChild('selfClosingTransaction', { static: false }) selfClosingTransaction: NgbAlert;
    transactionMessage = '';
    transactionType = '';
    transactionAlertTimer: any;

    @ViewChild('selfClosingWatchlist', { static: false }) selfClosingWatchlist: NgbAlert;
    watchlistMessage = '';
    watchlistType = '';
    watchlistAlertTimer: any;

    closeResult = '';
    // quantity: number = 0;
    wallet!: number;
    portfolio: Map<string, CompanyClass>;
    watchlist: Map<string, CompanyClass>;
    currentTime: any;
    marketStatus: string = '';
    marketStatusColor: string = '';

    constructor (private modalService: NgbModal, private localStorageService: LocalStorageService, private utilService: UtilService) {
        localStorageService.walletData.subscribe(val => {
            this.wallet = val;
        });
        localStorageService.portfolioData.subscribe(val => {
            this.portfolio = val;
        });
        localStorageService.watchlistData.subscribe(val => {
            console.log("Updated watchlist in Overview");
            this.watchlist = val;
        });
        this.currentTime = utilService.getDate();

    }

    toggleWatchlist(): void {
        if (this.watchlist.has(this.selectedStock)) {
            this.watchlist.delete(this.selectedStock);
            this.setWatchlistMessage(this.selectedStock.toUpperCase() + ' removed from Watchlist.', 'danger');
        } else {
            var company = new CompanyClass(this.selectedStock, this.companyProfile.name, 0, 0, this.companyQuote.c,
                this.companyQuote.d, this.companyQuote.dp);
            this.watchlist.set(this.selectedStock, company);
            this.setWatchlistMessage(this.selectedStock.toUpperCase() + ' added to Watchlist.', 'success');
        }
        this.localStorageService.updateWatchlist(this.watchlist);
    }

    tickerStatus(): string {
        if (this.companyQuote?.dp > 0) {
            return 'green';
        } else if (this.companyQuote?.dp < 0) {
            return 'red';
        } else {
            return '';
        }
    }

    // open(content) {
    //   this.modalService.open(content);
    // }

    // close(content) {
    //   this.modalService.dismissAll(content);
    //   this.quantity = 0;
    // }

    openBuyModal() {
        const modalRef = this.modalService.open(BuyModalComponent, { keyboard: true });
        modalRef.componentInstance.ticker = this.selectedStock;
        modalRef.componentInstance.price = this.companyQuote?.c;
        modalRef.componentInstance.wallet = this.wallet;
        modalRef.result.then((result) => {
            if (result && result > 0) {
                this.buyStocks(result);
            }
            console.log("result " + result);
        }, (reason) => {
            console.log("reason " + reason);
        });
    }


    openSellModal() {
        const modalRef = this.modalService.open(SellModalComponent, { keyboard: true });
        modalRef.componentInstance.ticker = this.selectedStock;
        modalRef.componentInstance.price = this.companyQuote?.c;
        modalRef.componentInstance.wallet = this.wallet;
        modalRef.componentInstance.currentQuantity = this.portfolio.get(this.selectedStock).quantity;

        modalRef.result.then((result) => {
            if (result && result > 0) {
                this.sellStocks(result);
            }
            console.log("result " + result);
        }, (reason) => {
            console.log("reason " + reason);
        });
    }

    sellStocks(quantity: number) {
        console.log("Sold stocks");
        const price: number = this.wallet + (quantity * this.companyQuote?.c);
        this.localStorageService.updateWallet(price);
        this.decreasePortfolio(quantity);
        this.setTransactionMessage(this.selectedStock.toUpperCase() + ' sold successfully.', 'danger');
        //this.close(content)
    }

    decreasePortfolio(quantity: number): void {
        var company = this.portfolio.get(this.selectedStock);
        if (quantity === company.quantity) {
            this.portfolio.delete(this.selectedStock);
        } else {
            company.quantity -= quantity;
            company.total -= (quantity * this.companyQuote?.c);
            this.portfolio.set(this.selectedStock, company);
        }
        this.localStorageService.updatePortfolio(this.portfolio);
    }

    buyStocks(quantity: number) {
        console.log("Bought stocks");
        const price: number = this.wallet - (quantity * this.companyQuote?.c);
        this.localStorageService.updateWallet(price);
        this.updatePortfolio(quantity);
        this.setTransactionMessage(this.selectedStock.toUpperCase() + ' bought successfully.', 'success');
        //this.close(content)
    }

    updatePortfolio(quantity: number): void {
        var company;
        var totalPrice = (quantity * this.companyQuote?.c);
        if (this.portfolio.has(this.selectedStock)) {
            company = this.portfolio.get(this.selectedStock);
            company = new CompanyClass(this.selectedStock, this.companyProfile.name,
                quantity + company.quantity, totalPrice + company.total,
                this.companyQuote.c, this.companyQuote.d, this.companyQuote.dp)
        } else {
            company = new CompanyClass(this.selectedStock, this.companyProfile.name, quantity, totalPrice, this.companyQuote.c, this.companyQuote.d, this.companyQuote.dp)
        }
        this.portfolio.set(this.selectedStock, company);
        this.localStorageService.updatePortfolio(this.portfolio);
    }

    // buyStocks(content) {
    //   console.log("Bought stocks");
    //   const price: number = this.wallet - (this.quantity * this.companyQuote?.c);
    //   this.localStorageService.updateWallet(price);
    //   this.updatePortfolio();
    //   this.setTransactionMessage(this.selectedStock.toUpperCase() + ' bought successfully.', 'success');
    //   //this.close(content)
    // }

    // updatePortfolio(): void {
    //   var company;
    //   var totalPrice = (this.quantity * this.companyQuote?.c);
    //   if (this.portfolio.has(this.selectedStock)) {
    //     company = this.portfolio.get(this.selectedStock);
    //     company = new CompanyClass(this.selectedStock, this.companyProfile.name,
    //       this.quantity + company.quantity, totalPrice + company.total,
    //       this.companyQuote.c, this.companyQuote.d, this.companyQuote.dp)
    //   } else {
    //     company = new CompanyClass(this.selectedStock, this.companyProfile.name, this.quantity, totalPrice, this.companyQuote.c, this.companyQuote.d, this.companyQuote.dp)
    //   }
    //   this.portfolio.set(this.selectedStock, company);
    //   this.localStorageService.updatePortfolio(this.portfolio);
    // }

    // sellStocks(content) {
    //   console.log("Sold stocks");
    //   const price: number = this.wallet + (this.quantity * this.companyQuote?.c);
    //   this.localStorageService.updateWallet(price);
    //   this.decreasePortfolio();
    //   this.setTransactionMessage(this.selectedStock.toUpperCase() + ' sold successfully.', 'danger');
    //   //this.close(content)
    // }

    // decreasePortfolio(): void {
    //   var company = this.portfolio.get(this.selectedStock);
    //   if (this.quantity === company.quantity) {
    //     this.portfolio.delete(this.selectedStock);
    //   } else {
    //     company.quantity -= this.quantity;
    //     company.total -= (this.quantity * this.companyQuote?.c);
    //     this.portfolio.set(this.selectedStock, company);
    //   }
    //   this.localStorageService.updatePortfolio(this.portfolio);
    // }


    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.companyQuote) {
            this.currentTime = this.utilService.getDate();
            if ((this.companyQuote.t * 1000 + 300000) <= this.currentTime.valueOf()) {
                this.marketStatus = "Market Closed on " + this.utilService.getDateFromEpoch(this.companyQuote.t).format('YYYY-MM-DD HH:mm:ss');
                this.marketStatusColor = 'red';
            } else {
                this.marketStatus = "Market is Open"
                this.marketStatusColor = 'green';
            }
        }
    }

    setTransactionMessage(message, type): void {
        clearTimeout(this.transactionAlertTimer);
        this.transactionMessage = message;
        this.transactionType = type;
        this.transactionAlertTimer = setTimeout(() => this.selfClosingTransaction?.close(), 5000);
    }

    setWatchlistMessage(message, type): void {
        clearTimeout(this.watchlistAlertTimer);
        this.watchlistMessage = message;
        this.watchlistType = type;
        this.watchlistAlertTimer = setTimeout(() => this.selfClosingWatchlist?.close(), 5000);
    }

}
