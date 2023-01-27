import { Component, OnDestroy, OnInit } from '@angular/core'
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms'
import { Store } from '@ngrx/store'
import { Observable, Subscription } from 'rxjs'
import * as authActions from 'src/app/store/auth/auth.actions'
import { AuthState } from 'src/app/store/auth/auth.reducer'
import { removeFormControlError } from 'src/app/utils'

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, OnDestroy {
  formGroupValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const emailControl = control.get('email')
    const passwordControl = control.get('password')

    if (emailControl !== null) removeFormControlError(emailControl, 'wrongCredentials')
    if (passwordControl !== null) removeFormControlError(passwordControl, 'wrongCredentials')
    this.errorMessage = ''

    return null
  }

  formGroup = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: [Validators.email, Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  }, { validators: [this.formGroupValidator] })

  auth$: Observable<AuthState>
  errorMessage: string
  subscription!: Subscription

  constructor (
    private readonly store: Store<{ auth: AuthState }>
  ) {
    this.auth$ = store.select('auth')
    this.errorMessage = ''
  }

  ngOnInit (): void {
    this.subscription = this.auth$.subscribe(({ error }) => {
      if (Object.keys(error).length > 0) {
        this.errorMessage = 'Identifiants de connexion non reconnus'
        this.formGroup.controls.email.setErrors({ wrongCredentials: this.errorMessage })
        this.formGroup.controls.password.setErrors({ wrongCredentials: this.errorMessage })
      }
    })
  }

  ngOnDestroy (): void {
    this.subscription.unsubscribe()
    this.store.dispatch(authActions.error({ error: {} }))
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
