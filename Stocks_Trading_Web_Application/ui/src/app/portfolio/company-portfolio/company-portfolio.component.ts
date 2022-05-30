import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CompanyClass } from '../../company-class.model';
import { LocalStorageService } from '../../services/local-storage.service';
import { BuyModalComponent } from '../../modal/buy-modal/buy-modal.component';
import { SellModalComponent } from '../../modal/sell-modal/sell-modal.component';

@Component({
    selector: 'app-company-portfolio',
    templateUrl: './company-portfolio.component.html',
    styleUrls: ['./company-portfolio.component.css']
})
export class CompanyPortfolioComponent implements OnInit, OnChanges {

    @Input()
    company: CompanyClass;

    currentQuantity: number;
    avgCost: number;
    totalCost: number;
    currentPrice: number;
    change: number;
    currentMarketValue!: number;
    tickerStyle: string = '';


    //quantity: number = 0;
    wallet!: number;
    portfolio: Map<string, CompanyClass>;

    @Output()
    companyBuy = new EventEmitter<CompanyClass>();

    @Output()
    companySell = new EventEmitter<CompanyClass>();

    constructor (private modalService: NgbModal, private localStorageService: LocalStorageService) {
        localStorageService.walletData.subscribe(val => {
            this.wallet = val;
        });
        localStorageService.portfolioData.subscribe(val => {
            this.portfolio = val;
        })
    }

    ngOnInit(): void {
        this.calculatePortfolioDetails();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.calculatePortfolioDetails();
        console.log(this.currentMarketValue);
    }


    openBuyModal() {
        const modalRef = this.modalService.open(BuyModalComponent, { keyboard: true });
        modalRef.componentInstance.ticker = this.company.ticker + " comp";
        modalRef.componentInstance.price = this.company?.c;
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

    buyStocks(quantity: number) {
        console.log("Bought stocks", this.company.ticker);
        const price: number = this.wallet - (quantity * this.company?.c);
        this.localStorageService.updateWallet(price);
        this.updatePortfolio(quantity);
        this.companyBuy.emit(this.company);
    }

    updatePortfolio(quantity: number): void {
        var company;
        var totalPrice = (quantity * this.company?.c);
        if (this.portfolio.has(this.company.ticker)) {
            company = this.portfolio.get(this.company.ticker);
            company = new CompanyClass(this.company.ticker, this.company.name,
                quantity + company.quantity, totalPrice + company.total,
                this.company.c, this.company.d, this.company.dp)
        } else {
            company = new CompanyClass(this.company.ticker, this.company.name, quantity, totalPrice, this.company.c, this.company.d, this.company.dp)
        }
        this.portfolio.set(this.company.ticker, company);
        this.localStorageService.updatePortfolio(this.portfolio);
    }

    openSellModal() {
        const modalRef = this.modalService.open(SellModalComponent, { keyboard: true });
        modalRef.componentInstance.ticker = this.company.ticker + " comp";
        modalRef.componentInstance.price = this.company?.c;
        modalRef.componentInstance.wallet = this.wallet;
        modalRef.componentInstance.currentQuantity = this.portfolio.get(this.company.ticker).quantity;

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
        const price: number = this.wallet + (quantity * this.company?.c);
        this.localStorageService.updateWallet(price);
        this.decreasePortfolio(quantity);
        this.companySell.emit(this.company);
    }

    decreasePortfolio(quantity: number): void {
        if (quantity === this.company.quantity) {
            this.portfolio.delete(this.company.ticker);
        } else {
            var newCompany = new CompanyClass(this.company.ticker, this.company.name,
                this.company.quantity - quantity,
                this.company.total - (quantity * this.company?.c),
                this.company.c, this.company.d, this.company.dp)
            this.portfolio.set(this.company.ticker, newCompany);
        }
        this.localStorageService.updatePortfolio(this.portfolio);
    }

    tickerStatus(): string {
        if (this.change > 0) {
            return 'green';
        } else if (this.change < 0) {
            return 'red';
        } else {
            return '';
        }
    }

    calculatePortfolioDetails() {
        this.currentQuantity = this.company.quantity;
        this.totalCost = this.roundTo(this.company.total, 2);
        this.avgCost = this.roundTo(this.company.total / this.company.quantity, 2);
        this.currentPrice = this.roundTo(this.company.c, 2);
        this.currentMarketValue = this.roundTo(this.company.quantity * this.company.c, 2);
        this.change = this.roundTo(this.company.c - this.avgCost, 2);
        this.tickerStyle = this.tickerStatus();
    }

    roundTo(num: number, places: number): number {
        const factor = 10 ** places;
        return Math.round(num * factor) / factor;
    }

    /*
    open(content) {
      this.modalService.open(content);
    }
  
    close(content) {
      this.modalService.dismissAll(content);
      this.quantity = 0;
    }
  
  
    
    buyStocks(content) {
      console.log("Bought stocks", this.company.ticker);
      const price: number = this.wallet - (this.quantity * this.company?.c);
      this.localStorageService.updateWallet(price);
      this.updatePortfolio();
      this.companyBuy.emit(this.company);
      this.close(content)
    }
  
    sellStocks(content) {
      console.log("Sold stocks");
      const price: number = this.wallet + (this.quantity * this.company?.c);
      this.localStorageService.updateWallet(price);
      this.decreasePortfolio();
      this.companySell.emit(this.company);
      this.close(content)
    }
  
    decreasePortfolio(): void {
      var company = this.portfolio.get(this.company.ticker);
      if (this.quantity === company.quantity) {
        this.portfolio.delete(this.company.ticker);
      } else {
        company.quantity -= this.quantity;
        company.total -= (this.quantity * this.company?.c);
        this.portfolio.set(this.company.ticker, company);
      }
      this.localStorageService.updatePortfolio(this.portfolio);
    }
  
  
    updatePortfolio(): void {
      var company;
      var totalPrice = (this.quantity * this.company?.c);
      if (this.portfolio.has(this.company.ticker)) {
        company = this.portfolio.get(this.company.ticker);
        company = new CompanyClass(this.company.ticker, this.company.name,
          this.quantity + company.quantity, totalPrice + company.total,
          this.company.c, this.company.d, this.company.dp)
      } else {
        company = new CompanyClass(this.company.ticker, this.company.name, this.quantity, totalPrice, this.company.c, this.company.d, this.company.dp)
      }
      this.portfolio.set(this.company.ticker, company);
      this.localStorageService.updatePortfolio(this.portfolio);
    }
  */

}
