import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDialogRef } from '@angular/material/dialog'
import { Store } from '@ngrx/store'
import { Observable, Subscription } from 'rxjs'
import { AuthState } from 'src/app/store/auth/auth.reducer'
import * as authActions from 'src/app/store/auth/auth.actions'
import { ToastrService } from 'ngx-toastr'

@Component({
  selector: 'app-edit-user-profil-dialog',
  templateUrl: './edit-user-profil-dialog.component.html',
  styleUrls: ['./edit-user-profil-dialog.component.scss']
})
export class EditUserProfilDialogComponent implements OnInit, OnDestroy {
  passwordFormGroup = new FormGroup({
    oldPassword: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    newPassword: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  })

  profileFormGroup = new FormGroup({
    firstName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    lastName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.email, Validators.required] }),
    phone: new FormControl('', { nonNullable: true, validators: [Validators.pattern(/^\+[0-9]{11,14}$/), Validators.required] })
  })

  auth$: Observable<AuthState>
  subscription!: Subscription
  updateProfileInProgress = false
  updatePasswordInProgress = false

  constructor (
    public dialogRef: MatDialogRef<EditUserProfilDialogComponent>,
    private readonly store: Store<{ auth: AuthState }>,
    private readonly toaster: ToastrService
  ) {
    this.auth$ = store.select('auth')
  }

  ngOnInit (): void {
    this.subscription = this.auth$.subscribe(({ user, error }) => {
      if (this.profileFormGroup.controls.email.value === '') this.profileFormGroup.controls.email.setValue(user?.email ?? '')
      if (this.profileFormGroup.controls.firstName.value === '') this.profileFormGroup.controls.firstName.setValue(user?.first_name ?? '')
      if (this.profileFormGroup.controls.lastName.value === '') this.profileFormGroup.controls.lastName.setValue(user?.last_name ?? '')
      if (this.profileFormGroup.controls.phone.value === '') this.profileFormGroup.controls.phone.setValue(user?.phone ?? '')

      if (Object.keys(error).length > 0) {
        console.log(error)
        if (error['email'] !== undefined) this.profileFormGroup.controls.email.setErrors({ apiError: 'Déja utilisé' })
        if (error['old_password'] !== undefined) this.passwordFormGroup.controls.oldPassword.setErrors({ apiError: 'Eronné' })
        if (error['new_password'] !== undefined) this.passwordFormGroup.controls.newPassword.setErrors({ apiError: 'Trop court' })
        this.store.dispatch(authActions.error({ error: {} }))
      } else {
        if (this.updateProfileInProgress) this.toaster.success('Profil mis à jours')
        if (this.updatePasswordInProgress) this.toaster.success('Mot de passe mis à jours')
      }
      this.updatePasswordInProgress = false
      this.updateProfileInProgress = false
    }
    )
  }

  ngOnDestroy (): void {
    this.subscription.unsubscribe()
    this.store.dispatch(authActions.error({ error: {} }))
  }

  onClose (): void {
    this.dialogRef.close()
  }

  onSubmit (): void {
    if (this.profileFormGroup.valid && this.profileFormGroup.dirty) {
      this.profileFormGroup.markAsPristine()
      this.store.dispatch(authActions.updateUserProfile({
        email: this.profileFormGroup.controls.email.value,
        firstName: this.profileFormGroup.controls.firstName.value,
        lastName: this.profileFormGroup.controls.lastName.value,
        phone: this.profileFormGroup.controls.phone.value
      }))
      this.updateProfileInProgress = true
    }
    if (this.passwordFormGroup.valid && this.passwordFormGroup.dirty) {
      this.passwordFormGroup.markAsPristine()
      this.store.dispatch(authActions.changeUserPassword({
        oldPassword: this.passwordFormGroup.controls.oldPassword.value,
        newPassword: this.passwordFormGroup.controls.newPassword.value
      }))
      this.updatePasswordInProgress = true
    }
  }
}
