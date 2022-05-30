import { Component, Input, OnInit } from '@angular/core';
import { faFacebookSquare, faTwitter } from '@fortawesome/free-brands-svg-icons'

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-news-modal',
    templateUrl: './news-modal.component.html',
    styleUrls: ['./news-modal.component.css']
})
export class NewsModalComponent implements OnInit {

    @Input()
    news: any;

    faFacebook = faFacebookSquare;
    faTwitter = faTwitter;
    twitterURL = '';
    facebookURL = '';

    constructor (private activeModal: NgbActiveModal) { }

    ngOnInit(): void {
        this.twitterURL = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(this.news.headline) + "&url=" + encodeURIComponent(this.news.url);;
        this.facebookURL = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(this.news.url) + '&amp;src=sdkpreparse';
    }

    close(): void {
        this.activeModal.close();
    }
}
