import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { AuthState } from 'src/app/store/auth/auth.reducer'
import { Observable } from 'rxjs'
@Component({
  selector: 'app-navbar-fragment',
  templateUrl: './navbar-fragment.component.html',
  styleUrls: ['./navbar-fragment.component.scss']
})
export class NavbarFragmentComponent implements OnInit {
  auth$: Observable<AuthState>
  constructor (
    private readonly store: Store<{ 'auth': AuthState }>
  ) {
    this.auth$ = this.store.select('auth')
  }

  ngOnInit (): void {
  }
}
