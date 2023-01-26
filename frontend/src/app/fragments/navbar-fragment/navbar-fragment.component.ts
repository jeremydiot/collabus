import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { AuthState } from 'src/app/store/auth/auth.reducer'
import { Observable } from 'rxjs'
import * as authActions from 'src/app/store/auth/auth.actions'
import { Router } from '@angular/router'
@Component({
  selector: 'app-navbar-fragment',
  templateUrl: './navbar-fragment.component.html',
  styleUrls: ['./navbar-fragment.component.scss']
})
export class NavbarFragmentComponent implements OnInit {
  auth$: Observable<AuthState>
  constructor (
    private readonly store: Store<{ 'auth': AuthState }>,
    private readonly router: Router

  ) {
    this.auth$ = this.store.select('auth')
  }

  ngOnInit (): void {
  }

  signout (): void {
    this.store.dispatch(authActions.logout())
    void this.router.navigate(['/'])
  }
}
