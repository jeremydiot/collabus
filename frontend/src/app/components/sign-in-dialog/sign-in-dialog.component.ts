import { Component, Inject } from '@angular/core'
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
    this.data.password = ''
    this.data.username = ''
  }

  onValid (): void {
    if (this.data.password.trim() !== '' && this.data.password.trim() !== '') this.dialogRef.close(this.data)
  }

  onKeyUpTrim (): void {
    this.data.username = this.data.username.trim()
    this.data.password = this.data.password.trim()
  }
}
