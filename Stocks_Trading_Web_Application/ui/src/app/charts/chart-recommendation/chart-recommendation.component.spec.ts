import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartRecommendationComponent } from './chart-recommendation.component';

describe('ChartRecommendationComponent', () => {
    let component: ChartRecommendationComponent;
    let fixture: ComponentFixture<ChartRecommendationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ChartRecommendationComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ChartRecommendationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
