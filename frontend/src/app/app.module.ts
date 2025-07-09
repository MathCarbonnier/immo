import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BienCardComponent } from './components/bien-card/bien-card.component';
import { BienListComponent } from './containers/bien-list/bien-list.component';
import { BienDetailComponent } from './containers/bien-detail/bien-detail.component';
import { BienFormComponent } from './containers/bien-form/bien-form.component';
import { DeleteConfirmationDialogComponent } from './components/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { ApiUrlInterceptor } from './interceptors/api-url.interceptor';
import {MatDialogActions, MatDialogContent, MatDialogTitle, MatDialogModule} from "@angular/material/dialog";

@NgModule({
  declarations: [
    AppComponent,
    BienCardComponent,
    BienListComponent,
    BienDetailComponent,
    BienFormComponent,
    DeleteConfirmationDialogComponent,
    CarouselComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatDialogModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogTitle
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiUrlInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
