import { Component } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { SignInDialogComponent } from 'src/app/components/sign-in-dialog/sign-in-dialog.component'
import { AuthState } from 'src/app/store/auth/auth.reducer'
import * as authActions from '../../store/auth/auth.actions'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  auth$: Observable<AuthState>

  constructor (
    public signInDialog: MatDialog,
    private readonly store: Store<{ auth: AuthState }>
  ) {
    this.auth$ = store.select('auth')
  }

  onOpenSignInDialog (): void {
    this.signInDialog.open(SignInDialogComponent, {
      width: '500px'
    })
  }

  onLogout (): void {
    this.store.dispatch(authActions.logout())
  }
}
