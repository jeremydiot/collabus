import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { AuthService } from 'src/app/services/auth.service'

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit {
  formGroup = new FormGroup({
    userEmail: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    userPhone: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^\+[0-9]{11,14}$/)] }),
    userFirstName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    userLastName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    userPassword1: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
    userPassword2: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
    entityName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    entityAddress: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    entityZipCode: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    entityCity: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    entityCountry: new FormControl('FR', { nonNullable: true, validators: [Validators.required] }),
    entityPhone: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^\+[0-9]{11,14}$/)] }),
    entityEmail: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    entitySiret: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(14)] })
  })

  constructor (
    private readonly authService: AuthService
  ) { }

  ngOnInit (): void {
  }

  onSubmit (): void {
    if (this.formGroup.valid &&
      this.formGroup.controls.userPassword1.value === this.formGroup.controls.userPassword2.value) {
      this.authService.createUser(
        this.formGroup.controls.userEmail.value,
        this.formGroup.controls.userPhone.value,
        this.formGroup.controls.userFirstName.value,
        this.formGroup.controls.userLastName.value,
        this.formGroup.controls.userPassword1.value,
        this.formGroup.controls.entityName.value,
        this.formGroup.controls.entityEmail.value,
        this.formGroup.controls.entityPhone.value,
        this.formGroup.controls.entitySiret.value,
        this.formGroup.controls.entityAddress.value,
        this.formGroup.controls.entityZipCode.value,
        this.formGroup.controls.entityCity.value,
        this.formGroup.controls.entityCountry.value

      ).subscribe()
    }
  }
}
