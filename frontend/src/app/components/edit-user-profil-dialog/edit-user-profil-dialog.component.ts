import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDialogRef } from '@angular/material/dialog'
import { Store } from '@ngrx/store'
import { Observable, Subscription } from 'rxjs'
import { AuthState } from 'src/app/store/auth/auth.reducer'
import * as authActions from 'src/app/store/auth/auth.actions'

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
    firstName: new FormControl('', { nonNullable: true }),
    lastName: new FormControl('', { nonNullable: true }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.email] }),
    phone: new FormControl('', { nonNullable: true, validators: [Validators.pattern(/^\+[0-9]{11,14}$/)] })
  })

  auth$: Observable<AuthState>

  subscription!: Subscription

  constructor (
    public dialogRef: MatDialogRef<EditUserProfilDialogComponent>,
    private readonly store: Store<{ auth: AuthState }>
  ) {
    this.auth$ = store.select('auth')
  }

  ngOnInit (): void {
    this.subscription = this.auth$.subscribe(
      {
        next: ({ user }) => {
          this.profileFormGroup.controls.email.setValue(user?.email ?? '')
          this.profileFormGroup.controls.firstName.setValue(user?.first_name ?? '')
          this.profileFormGroup.controls.lastName.setValue(user?.last_name ?? '')
          this.profileFormGroup.controls.phone.setValue(user?.phone ?? '')
          this.dialogRef.disableClose = false
        },
        error (err) {
          console.error(err)
        }
      }
    )
  }

  ngOnDestroy (): void {
    this.subscription.unsubscribe()
  }

  onClose (): void {
    if (this.dialogRef.disableClose === false) {
      this.dialogRef.close()
    }
  }

  onSubmit (): void {
    if (this.profileFormGroup.valid) {
      this.store.dispatch(authActions.updateUserProfile({
        email: this.profileFormGroup.controls.email.value,
        firstName: this.profileFormGroup.controls.firstName.value,
        lastName: this.profileFormGroup.controls.lastName.value,
        phone: this.profileFormGroup.controls.phone.value
      }))
    }
    this.dialogRef.disableClose = true
  }
}
