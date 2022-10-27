import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MaterialModule } from './modules/material.module'
import { FooterComponent } from './fragments/footer/footer.component'
import { NavbarComponent } from './fragments/navbar/navbar.component'
import { HomeComponent } from './pages/home/home.component'
import { DashboardComponent } from './pages/dashboard/dashboard.component'
import { SettingsComponent } from './pages/settings/settings.component'
import { ProjectComponent } from './pages/project/project.component'
import { AdminComponent } from './pages/admin/admin.component'
import { SignInDialogComponent } from './components/sign-in-dialog/sign-in-dialog.component'
import { StoreModule } from '@ngrx/store'

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    NavbarComponent,
    HomeComponent,
    DashboardComponent,
    SettingsComponent,
    ProjectComponent,
    AdminComponent,
    SignInDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    StoreModule.forRoot({}, {})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
