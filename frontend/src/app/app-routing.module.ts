import { Injectable, NgModule } from '@angular/core'
import { ActivatedRouteSnapshot, CanActivate, Router, RouterModule, RouterStateSnapshot, Routes, UrlTree } from '@angular/router'
import { Store } from '@ngrx/store'
import { map, Observable } from 'rxjs'
import { DashboardComponent } from './pages/dashboard/dashboard.component'
import { HomeComponent } from './pages/home/home.component'
import { ProjectComponent } from './pages/project/project.component'
import { SettingsComponent } from './pages/settings/settings.component'
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
  { path: '', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [CanActivateLoggedIn] },
  { path: 'project/:id', component: ProjectComponent, canActivate: [CanActivateLoggedIn] },
  { path: 'settings', component: SettingsComponent, canActivate: [CanActivateLoggedIn] },
  { path: '**', redirectTo: '/' } // redirect 404 to home
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
