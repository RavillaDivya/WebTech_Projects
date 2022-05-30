import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartHistoricComponent } from './charts/chart-historic/chart-historic.component';
import { CompanyOverviewComponent } from './search/company-overview/company-overview.component';
import { SearchDetailsComponent } from './search/search-details/search-details.component';
import { CompanySummaryComponent } from './search/company-summary/company-summary.component';
import { CompanyNewsComponent } from './search/company-news/company-news.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { SearchComponent } from './search/search.component';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HighchartsChartModule } from 'highcharts-angular';
import { CompanyInsightsComponent } from './search/company-insights/company-insights.component';
import { ChartRecommendationComponent } from './charts/chart-recommendation/chart-recommendation.component';
import { ChartEarningsComponent } from './charts/chart-earnings/chart-earnings.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CompanyPortfolioComponent } from './portfolio/company-portfolio/company-portfolio.component';
import { CompanyWatchlistComponent } from './watchlist/company-watchlist/company-watchlist.component';
import { RouteReuseStrategy } from '@angular/router';
import { CustomReuseStrategy } from './CustomReuseStrategy';
import { BuyModalComponent } from './modal/buy-modal/buy-modal.component';
import { SellModalComponent } from './modal/sell-modal/sell-modal.component';
import { FormatterPipe } from './formatter.pipe';
import { NewsModalComponent } from './modal/news-modal/news-modal.component';

@NgModule({
    declarations: [
        AppComponent,
        ChartHistoricComponent,
        CompanyOverviewComponent,
        SearchDetailsComponent,
        CompanySummaryComponent,
        CompanyNewsComponent,
        HeaderComponent,
        FooterComponent,
        PortfolioComponent,
        WatchlistComponent,
        SearchComponent,
        CompanyInsightsComponent,
        ChartRecommendationComponent,
        ChartEarningsComponent,
        CompanyPortfolioComponent,
        CompanyWatchlistComponent,
        BuyModalComponent,
        SellModalComponent,
        FormatterPipe,
        NewsModalComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgbModule,
        BrowserAnimationsModule,
        MatButtonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatAutocompleteModule,
        MatProgressSpinnerModule,
        MatTabsModule,
        HighchartsChartModule,
        FontAwesomeModule,
        MatIconModule
    ],
    entryComponents: [BuyModalComponent, SellModalComponent, ChartHistoricComponent, NewsModalComponent],
    providers: [{ provide: RouteReuseStrategy, useClass: CustomReuseStrategy }],
    bootstrap: [AppComponent]
})
export class AppModule { }
