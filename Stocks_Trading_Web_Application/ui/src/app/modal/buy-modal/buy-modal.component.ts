import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-buy-modal',
    templateUrl: './buy-modal.component.html',
    styleUrls: ['./buy-modal.component.css']
})
export class BuyModalComponent implements OnInit {

    @Input()
    ticker: any;

    @Input()
    wallet: any;

    @Input()
    price: any;

    quantity = 0.0;


    constructor (private activeModal: NgbActiveModal) { }

    ngOnInit(): void {
    }

    buyStocks(): void {
        this.activeModal.close(this.quantity);
    }

    close(): void {
        this.activeModal.close();
    }

}
