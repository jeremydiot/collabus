import { Injectable, NgModule } from '@angular/core'
import { ActivatedRouteSnapshot, CanActivate, Router, RouterModule, RouterStateSnapshot, Routes, UrlTree } from '@angular/router'
import { Store } from '@ngrx/store'
import { map, Observable } from 'rxjs'
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component'
import { HomePageComponent } from './pages/home-page/home-page.component'
import { LoginPageComponent } from './pages/login-page/login-page.component'
import { ProjectPageComponent } from './pages/project-page/project-page.component'
import { RegisterPageComponent } from './pages/register-page/register-page.component'
import { SearchPageComponent } from './pages/search-page/search-page.component'
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
      if (!authState.isLoggedIn) void this.router.navigate([''])
      return authState.isLoggedIn
    }))
  }
}

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'dashboard', component: DashboardPageComponent, canActivate: [CanActivateLoggedIn] },
  { path: 'project/:id', component: ProjectPageComponent, canActivate: [CanActivateLoggedIn] },
  { path: 'search', component: SearchPageComponent, canActivate: [CanActivateLoggedIn] }
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload', anchorScrolling: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
