import { Component, Inject } from '@angular/core'
import { FormControl } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'

export interface DialogData {
  username: string
  password: string
}

@Component({
  selector: 'app-sign-in-dialog',
  templateUrl: './sign-in-dialog.component.html',
  styleUrls: ['./sign-in-dialog.component.scss']
})
export class SignInDialogComponent {
  constructor (
    public dialogRef: MatDialogRef<SignInDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.data.username = ''
    this.data.password = ''
  }

  passwordFormControl = new FormControl()
  usernameFormControl = new FormControl()

  onValid (): void {
    if (this.data.password.trim() !== '' && this.data.username.trim() !== '') this.dialogRef.close(this.data)
    else {
      this.data.password === '' && this.passwordFormControl.markAsTouched()
      this.data.username === '' && this.usernameFormControl.markAsTouched()
    }
  }

  onKeyUpTrim (): void {
    this.data.username = this.data.username.trim()
    this.data.password = this.data.password.trim()
  }
}
