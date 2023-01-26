import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { EditUserProfilDialogComponent } from 'src/app/components/edit-user-profil-dialog/edit-user-profil-dialog.component'
import { AuthState } from 'src/app/store/auth/auth.reducer'

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit {
  auth$: Observable<AuthState>
  constructor (
    private readonly store: Store<{ auth: AuthState }>,
    public dialog: MatDialog
  ) {
    this.auth$ = store.select('auth')
  }

  ngOnInit (): void {
    this.onEditProfile()
  }

  onEditProfile (): void {
    this.dialog.open(EditUserProfilDialogComponent)
  }
}
