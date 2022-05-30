import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { faFacebookSquare, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { NewsModalComponent } from 'src/app/modal/news-modal/news-modal.component';

@Component({
    selector: 'app-company-news',
    templateUrl: './company-news.component.html',
    styleUrls: ['./company-news.component.css']
})
export class CompanyNewsComponent implements OnInit, OnChanges {

    @Input()
    news!: any;

    faFacebook = faFacebookSquare;
    faTwitter = faTwitter;//faTwitterSquare;

    constructor (private modalService: NgbModal) { }

    ngOnInit(): void {

    }

    ngOnChanges(changes: SimpleChanges): void {
    }

    openNewsModal() {
        const modalRef = this.modalService.open(NewsModalComponent, { keyboard: true });
        modalRef.componentInstance.news = this.news;
        modalRef.result.then((result) => {
            console.log("result " + result);
        }, (reason) => {
            console.log("reason " + reason);
        });
    }

    // open(content) {
    //   this.modalService.open(content);
    // }

    // close(content) {
    //   this.modalService.dismissAll(content);
    // }
}
