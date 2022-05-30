import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartEarningsComponent } from './chart-earnings.component';

describe('ChartEarningsComponent', () => {
    let component: ChartEarningsComponent;
    let fixture: ComponentFixture<ChartEarningsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ChartEarningsComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ChartEarningsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
