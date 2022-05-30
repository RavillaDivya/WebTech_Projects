import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyWatchlistComponent } from './company-watchlist.component';

describe('CompanyWatchlistComponent', () => {
    let component: CompanyWatchlistComponent;
    let fixture: ComponentFixture<CompanyWatchlistComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CompanyWatchlistComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CompanyWatchlistComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
