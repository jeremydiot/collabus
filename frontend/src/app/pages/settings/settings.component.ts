import { Component, OnDestroy, OnInit } from '@angular/core'
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { Store } from '@ngrx/store'
import { Observable, Subscription } from 'rxjs'
import { User } from 'src/app/models/auth'
import { AuthState } from 'src/app/store/auth/auth.reducer'
import { removeFormControlError } from 'src/app/utils/form-control'
import { environment } from 'src/environments/environment'
import { Md5 } from 'ts-md5'
import * as authActions from '../../store/auth/auth.actions'
import { ToastrService } from 'ngx-toastr'

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
  avatarUrl: string
  auth$: Observable<AuthState>
  subscription?: Subscription
  userProfile?: User

  constructor (
    private readonly store: Store<{ auth: AuthState }>,
    public dialog: MatDialog
  ) {
    this.avatarUrl = ''
    this.auth$ = store.select('auth')
  }

  onEditProfile (): void {
    const dialogRef = this.dialog.open(EditUserProfileDialogComponent)

    dialogRef.afterClosed().subscribe(() => {
      this.store.dispatch(authActions.clearError())
    })
  }

  ngOnInit (): void {
    this.subscription = this.auth$.subscribe(({ profile, isLoggedIn }) => {
      this.userProfile = profile
      this.avatarUrl = (isLoggedIn) ? `${environment.avatarUrl}/${Md5.hashStr(profile.email)}?s=110&d=identicon` : `${environment.avatarUrl}/?s=95&d=mp`
    })
  }

  ngOnDestroy (): void {
    if (this.subscription !== undefined) this.subscription.unsubscribe()
  }
}

@Component({
  selector: 'app-settings-edit-user-profile-dialog',
  templateUrl: './edit-user-profile.dialog.component.html',
  styleUrls: ['./edit-user-profile.dialog.component.scss']

})
export class EditUserProfileDialogComponent implements OnInit, OnDestroy {
  formGroupValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const oldPassword = control.get('old_password')
    const newPassword = control.get('new_password')

    if (oldPassword?.value === '' && newPassword?.value !== '') oldPassword?.setErrors({ missingPassword: 'Champ manquant' })
    else if (oldPassword != null) removeFormControlError(oldPassword, 'missingPassword')

    if (oldPassword?.value !== '' && newPassword?.value === '') newPassword?.setErrors({ missingPassword: 'Champ manquant' })
    else if (newPassword != null) removeFormControlError(newPassword, 'missingPassword')

    if (oldPassword?.value !== '' && newPassword?.value !== '' && oldPassword?.value === newPassword?.value) {
      oldPassword?.setErrors({ samePassword: 'Champs identiques' })
      newPassword?.setErrors({ samePassword: 'Champs identiques' })
    } else {
      if (newPassword != null) removeFormControlError(newPassword, 'samePassword')
      if (oldPassword != null) removeFormControlError(oldPassword, 'samePassword')
    }

    return null
  }

  form = new FormGroup({
    username: new FormControl('', { nonNullable: true }),
    first_name: new FormControl('', { nonNullable: true }),
    last_name: new FormControl('', { nonNullable: true }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.email] }),
    phone: new FormControl('', { nonNullable: true, validators: [Validators.pattern(/^\+[0-9]{11,14}$/)] }),
    old_password: new FormControl('', { nonNullable: true }),
    new_password: new FormControl('', { nonNullable: true })
  }, { validators: [this.formGroupValidator] })

  auth$: Observable<AuthState>

  userProfile?: User

  subscription?: Subscription

  updateInProgress = false

  constructor (
    public dialogRef: MatDialogRef<EditUserProfileDialogComponent>,
    private readonly store: Store<{ auth: AuthState }>,
    private readonly toastr: ToastrService
  ) {
    this.auth$ = this.store.select('auth')
  }

  ngOnInit (): void {
    this.subscription = this.auth$.subscribe(({ profile, error }) => {
      this.userProfile = profile
      this.dialogRef.disableClose = false

      const formControlsCheck: { [key: string]: boolean } = {
        username: false,
        first_name: false,
        last_name: false,
        email: false,
        phone: false,
        old_password: false,
        new_password: false
      }

      if (Object.keys(error).length === 0 && this.updateInProgress) this.toastr.success('Modification enregistré')

      Object.keys(error).forEach((key) => {
        this.form.get(key)?.setErrors({ apiError: error[key][0] })
        formControlsCheck[key] = true
      })

      Object.keys(formControlsCheck).forEach((key) => {
        if (!formControlsCheck[key]) {
          const formControl = this.form.get(key)
          if (formControl !== null) removeFormControlError(formControl, 'apiError')
        }
        formControlsCheck[key] = true
      })
      this.updateInProgress = false
    })
  }

  ngOnDestroy (): void {
    this.subscription?.unsubscribe()
  }

  onValid (): void {
    this.store.dispatch(authActions.clearError())
    this.dialogRef.disableClose = true
    if (this.form.valid) {
      const data = Object.assign({}, this.form.value)

      const passwords = {
        old_password: (data.old_password !== undefined) ? data.old_password : '',
        new_password: (data.new_password !== undefined) ? data.new_password : ''
      }
      delete data.old_password
      delete data.new_password

      const updatedKeys = Object.keys(data).filter(key => data[key as keyof typeof data] !== this.userProfile?.[key as keyof User])
      const updatedValues = updatedKeys.map(key => data[key as keyof typeof data])

      const newData = updatedKeys.reduce((accumulator, element, index) => {
        return { ...accumulator, [element]: updatedValues[index] }
      }, {})

      const enableClose = {
        formInfo: false,
        formPassword: false
      }

      if (Object.keys(newData).length > 0) this.store.dispatch(authActions.updateUserProfile(newData as User))
      else enableClose.formInfo = true

      if (passwords.old_password !== '' && passwords.new_password !== '') this.store.dispatch(authActions.changeUserPassword(passwords))
      else enableClose.formPassword = true

      if (enableClose.formInfo && enableClose.formPassword) {
        this.dialogRef.disableClose = false
      } else {
        this.updateInProgress = true
      }
    }
  }

  onCancel (): void {
    if (this.dialogRef.disableClose !== true) {
      this.dialogRef.close()
    }
  }
}
