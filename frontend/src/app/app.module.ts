import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { ReactiveFormsModule } from '@angular/forms'
import { AppRoutingModule, CanActivateLoggedIn, CanActivateNotLoggedIn } from './app-routing.module'
import { AppComponent } from './app.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MaterialModule } from './modules/material.module'
import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { authReducer } from './store/auth/auth.reducer'
import { AuthEffects } from './store/auth/auth.effects'
import { AuthInterceptor } from './interceptors'
import { ToastrModule } from 'ngx-toastr'
import { extModules } from './build-specifics'
import { HomePageComponent } from './pages/home-page/home-page.component'
import { LoginPageComponent } from './pages/login-page/login-page.component'
import { ProjectPageComponent } from './pages/project-page/project-page.component'
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component'
import { SearchPageComponent } from './pages/search-page/search-page.component'
import { NavbarFragmentComponent } from './fragments/navbar-fragment/navbar-fragment.component'
import { FooterFragmentComponent } from './fragments/footer-fragment/footer-fragment.component'
import { RegisterPageComponent } from './pages/register-page/register-page.component'
@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    LoginPageComponent,
    ProjectPageComponent,
    DashboardPageComponent,
    SearchPageComponent,
    NavbarFragmentComponent,
    FooterFragmentComponent,
    RegisterPageComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    StoreModule.forRoot({ auth: authReducer }, {}),
    EffectsModule.forRoot([AuthEffects]),
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    ...extModules

  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    CanActivateLoggedIn,
    CanActivateNotLoggedIn
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
