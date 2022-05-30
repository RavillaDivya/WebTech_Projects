import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchDetailsComponent } from './search-details.component';

describe('CompanyDetailsComponent', () => {
    let component: SearchDetailsComponent;
    let fixture: ComponentFixture<SearchDetailsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SearchDetailsComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SearchDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
