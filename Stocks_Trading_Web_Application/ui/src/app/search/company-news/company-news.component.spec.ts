import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyNewsComponent } from './company-news.component';

describe('CompanyNewsComponent', () => {
    let component: CompanyNewsComponent;
    let fixture: ComponentFixture<CompanyNewsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CompanyNewsComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CompanyNewsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
