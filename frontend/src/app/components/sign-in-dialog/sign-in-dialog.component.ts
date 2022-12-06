import { Component } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDialogRef } from '@angular/material/dialog'
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { AuthState } from 'src/app/store/auth/auth.reducer'
import * as authActions from '../../store/auth/auth.actions'

interface CallbackConnectionData {
  dialogRef?: MatDialogRef<SignInDialogComponent>
  connectionError: boolean
  alreadyInitialized: boolean
  connectionInProgress: boolean
}

const CALLBACK_CONNECTION_DATA: CallbackConnectionData = {
  dialogRef: undefined,
  connectionError: false,
  alreadyInitialized: false,
  connectionInProgress: false

}

@Component({
  selector: 'app-sign-in-dialog',
  templateUrl: './sign-in-dialog.component.html',
  styleUrls: ['./sign-in-dialog.component.scss']
})
export class SignInDialogComponent {
  auth$: Observable<AuthState>

  callbackConnectionData = CALLBACK_CONNECTION_DATA

  form = new FormGroup({
    email: new FormControl('admin@admin.com', { nonNullable: true, validators: [Validators.email, Validators.required] }),
    password: new FormControl('admin', { nonNullable: true, validators: [Validators.required] })
  })

  constructor (
    public dialogRef: MatDialogRef<SignInDialogComponent>,
    private readonly store: Store<{ auth: AuthState }>
  ) {
    this.callbackConnectionData.dialogRef = this.dialogRef
    this.callbackConnectionData.connectionError = false
    this.auth$ = store.select('auth')

    if (!CALLBACK_CONNECTION_DATA.alreadyInitialized) {
      this.auth$.subscribe(({ isLoggedIn, profile }) => {
        if (isLoggedIn) {
          CALLBACK_CONNECTION_DATA.dialogRef?.close()
        } else {
          if (CALLBACK_CONNECTION_DATA.alreadyInitialized) CALLBACK_CONNECTION_DATA.connectionError = true
          if (CALLBACK_CONNECTION_DATA.dialogRef !== undefined) CALLBACK_CONNECTION_DATA.dialogRef.disableClose = false
        }
        CALLBACK_CONNECTION_DATA.connectionInProgress = false
      })
      CALLBACK_CONNECTION_DATA.alreadyInitialized = true
    }
  }

  onValid (): void {
    if (this.form.valid) {
      this.callbackConnectionData.connectionInProgress = true
      if (this.callbackConnectionData.dialogRef !== undefined) this.callbackConnectionData.dialogRef.disableClose = true
      this.store.dispatch(authActions.login({ email: this.form.controls.email.value, password: this.form.controls.password.value }))
    }
  }
}
