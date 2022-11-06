import { Component } from '@angular/core'
import { FormControl, Validators } from '@angular/forms'
import { MatDialogRef } from '@angular/material/dialog'
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { AuthState } from 'src/app/store/auth/auth.reducer'
import * as authActions from '../../store/auth/auth.actions'

export interface LoginFormData{
  email: string
  password: string
}

@Component({
  selector: 'app-sign-in-dialog',
  templateUrl: './sign-in-dialog.component.html',
  styleUrls: ['./sign-in-dialog.component.scss']
})
export class SignInDialogComponent {
  auth$: Observable<AuthState>
  username: string = ''

  loginFormData: LoginFormData = {
    email: '',
    password: ''
  }

  emailFormControl: FormControl = new FormControl('admin', [Validators.email, Validators.required])
  passwordFormControl: FormControl = new FormControl('admin', [Validators.required])

  constructor (
    public dialogRef: MatDialogRef<SignInDialogComponent>,
    private readonly store: Store<{auth: AuthState}>
  ) {
    this.auth$ = store.select('auth')
    this.auth$.subscribe(data => {
      this.username = String(data.profile?.email)
    })
  }

  onValid (): void {
    this.store.dispatch(authActions.login({ email: this.emailFormControl.value, password: this.passwordFormControl.value }))
    if (this.emailFormControl.valid && this.passwordFormControl.valid) {
      this.loginFormData.email = this.emailFormControl.value
      this.loginFormData.password = this.passwordFormControl.value
      // this.dialogRef.close(this.loginFormData)
    }
  }

  onKeyUpTrim (): void {
    this.emailFormControl.setValue(this.emailFormControl.value.trim())
    this.passwordFormControl.setValue(this.passwordFormControl.value.trim())
  }

  onClick (): void {
    this.store.dispatch(authActions.loginSuccess())
  }
}
