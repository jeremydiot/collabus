import { Component } from '@angular/core'
import { FormControl } from '@angular/forms'
import { MatDialogRef } from '@angular/material/dialog'
import { User } from '../../models/user'

@Component({
  selector: 'app-sign-in-dialog',
  templateUrl: './sign-in-dialog.component.html',
  styleUrls: ['./sign-in-dialog.component.scss']
})
export class SignInDialogComponent {
  user: User = new User()

  constructor (
    public dialogRef: MatDialogRef<SignInDialogComponent>
  ) {
    this.user.email = ''
    this.user.password = ''
  }

  passwordFormControl = new FormControl()
  emailFormControl = new FormControl()

  onValid (): void {
    if (this.user.password?.trim() !== '' && this.user.email?.trim() !== '') this.dialogRef.close(this.user)
    else {
      this.user.password === '' && this.passwordFormControl.markAsTouched()
      this.user.email === '' && this.emailFormControl.markAsTouched()
    }
  }

  onKeyUpTrim (): void {
    this.user.email = this.user.email?.trim()
    this.user.password = this.user.password?.trim()
  }
}
