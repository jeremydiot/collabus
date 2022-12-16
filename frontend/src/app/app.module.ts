import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { ReactiveFormsModule } from '@angular/forms'
import { AppRoutingModule, CanActivateLoggedIn } from './app-routing.module'
import { AppComponent } from './app.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MaterialModule } from './modules/material.module'
import { FooterComponent } from './fragments/footer/footer.component'
import { NavbarComponent } from './fragments/navbar/navbar.component'
import { HomeComponent } from './pages/home/home.component'
import { DashboardComponent } from './pages/dashboard/dashboard.component'
import { EditUserProfileDialogComponent, SettingsComponent } from './pages/settings/settings.component'
import { ProjectComponent } from './pages/project/project.component'
import { AdminComponent } from './pages/admin/admin.component'
import { SignInDialogComponent } from './components/sign-in-dialog/sign-in-dialog.component'
import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { authReducer } from './store/auth/auth.reducer'
import { AuthEffects } from './store/auth/auth.effects'
import { AuthInterceptor } from './interceptors'
import { ToastrModule } from 'ngx-toastr';
import { ProjectSearchCardComponent } from './components/project-search-card/project-search-card.component'
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
    SignInDialogComponent,
    EditUserProfileDialogComponent,
    ProjectSearchCardComponent
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
    ToastrModule.forRoot()

  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    CanActivateLoggedIn
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
