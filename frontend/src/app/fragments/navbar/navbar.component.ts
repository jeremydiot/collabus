import { Component } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { SignInDialogComponent } from 'src/app/components/sign-in-dialog/sign-in-dialog.component'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  username: string = ''

  constructor (public signInDialog: MatDialog) { }

  openSignInDialog (): void {
    const dialogRef = this.signInDialog.open(SignInDialogComponent, {
      width: '500px',
      data: { username: this.username }
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
    })
  }
}
