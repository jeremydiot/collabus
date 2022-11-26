import { Component } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDialogRef } from '@angular/material/dialog'
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { AuthState } from 'src/app/store/auth/auth.reducer'
import * as authActions from '../../store/auth/auth.actions'

export interface LoginFormData {
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

  form = new FormGroup({
    email: new FormControl('admin@admin.com', { nonNullable: true, validators: [Validators.email, Validators.required] }),
    password: new FormControl('admin', { nonNullable: true, validators: [Validators.required] })
  })

  constructor (
    public dialogRef: MatDialogRef<SignInDialogComponent>,
    private readonly store: Store<{ auth: AuthState }>
  ) {
    this.auth$ = store.select('auth')
    this.auth$.subscribe(data => {

    })
  }

  onValid (): void {
    if (this.form.valid) {
      this.store.dispatch(authActions.login({ email: this.form.controls.email.value, password: this.form.controls.password.value }))
      this.dialogRef.close()
    }
  }
}
