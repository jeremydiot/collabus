import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'

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

  constructor () { }

  ngOnInit (): void {
  }

  onSubmit (): void {
    if (this.formGroup.valid) {
      console.log('ok')
    }
  }
}
