import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Store } from '@ngrx/store'
import * as authActions from 'src/app/store/auth/auth.actions'

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  formGroup = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: [Validators.email, Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  })

  constructor (
    private readonly store: Store
  ) {}

  ngOnInit (): void {
  }

  onSubmit (): void {
    if (this.formGroup.valid) {
      this.store.dispatch(authActions.login({
        email: this.formGroup.controls.email.value,
        password: this.formGroup.controls.password.value
      }))
    }
  }
}
