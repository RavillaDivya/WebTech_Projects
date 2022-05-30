import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-sell-modal',
    templateUrl: './sell-modal.component.html',
    styleUrls: ['./sell-modal.component.css']
})
export class SellModalComponent implements OnInit {

    @Input()
    ticker: any;

    @Input()
    wallet: any;

    @Input()
    price: any;

    @Input()
    currentQuantity: any;

    quantity = 0.0;

    constructor (private activeModal: NgbActiveModal) { }

    ngOnInit(): void {
    }

    sellStocks(): void {
        this.activeModal.close(this.quantity);
    }

    close(): void {
        this.activeModal.close();
    }

}
