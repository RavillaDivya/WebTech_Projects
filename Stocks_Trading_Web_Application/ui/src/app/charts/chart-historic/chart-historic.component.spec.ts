import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartHistoricComponent } from './chart-historic.component';

describe('HistoricChartComponent', () => {
    let component: ChartHistoricComponent;
    let fixture: ComponentFixture<ChartHistoricComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ChartHistoricComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ChartHistoricComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
