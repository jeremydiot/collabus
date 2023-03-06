import { Injectable, NgModule } from '@angular/core'
import { ActivatedRouteSnapshot, CanActivate, Router, RouterModule, RouterStateSnapshot, Routes, UrlTree } from '@angular/router'
import { Store } from '@ngrx/store'
import { map, Observable } from 'rxjs'
import { CompanyPageComponent } from './pages/company-page/company-page.component'
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component'
import { HomePageComponent } from './pages/home-page/home-page.component'
import { LegalPageComponent } from './pages/legal-page/legal-page.component'
import { LoginPageComponent } from './pages/login-page/login-page.component'
import { ProjectPageComponent } from './pages/project-page/project-page.component'
import { RegisterPageComponent } from './pages/register-page/register-page.component'
import { SchoolPageComponent } from './pages/school-page/school-page.component'
import { SearchPageComponent } from './pages/search-page/search-page.component'
import { TeamPageComponent } from './pages/team-page/team-page.component'
import { AuthState } from './store/auth/auth.reducer'

@Injectable()
export class CanActivateLoggedIn implements CanActivate {
  auth$: Observable<AuthState>

  constructor (
    private readonly router: Router,
    private readonly store: Store<{ auth: AuthState }>
  ) {
    this.auth$ = this.store.select('auth')
  }

  canActivate (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.auth$.pipe(map(authState => {
      const isLoggedIn = authState.accessToken !== ''
      if (!isLoggedIn) void this.router.navigate([''])
      return isLoggedIn
    }))
  }
}

@Injectable()
export class CanActivateNotLoggedIn implements CanActivate {
  auth$: Observable<AuthState>

  constructor (
    private readonly router: Router,
    private readonly store: Store<{ auth: AuthState }>
  ) {
    this.auth$ = this.store.select('auth')
  }

  canActivate (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.auth$.pipe(map(authState => {
      const isNotLoggedIn = authState.accessToken === ''
      if (!isNotLoggedIn) void this.router.navigate([''])
      return isNotLoggedIn
    }))
  }
}

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'school', component: SchoolPageComponent },
  { path: 'company', component: CompanyPageComponent },
  { path: 'team', component: TeamPageComponent },
  { path: 'legal', component: LegalPageComponent },
  { path: 'login', component: LoginPageComponent, canActivate: [CanActivateNotLoggedIn] },
  { path: 'register', component: RegisterPageComponent, canActivate: [CanActivateNotLoggedIn] },
  { path: 'dashboard', component: DashboardPageComponent, canActivate: [CanActivateLoggedIn] },
  { path: 'project/:id', component: ProjectPageComponent, canActivate: [CanActivateLoggedIn] },
  { path: 'search', component: SearchPageComponent, canActivate: [CanActivateLoggedIn] }
]

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // onSameUrlNavigation: 'reload'
    // anchorScrolling: 'enabled',
    // scrollPositionRestoration: 'disabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
