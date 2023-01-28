import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { EditUserProfilDialogComponent } from 'src/app/components/edit-user-profil-dialog/edit-user-profil-dialog.component'
import { ProjectKind } from 'src/app/enums'
import { ProjectPrivate } from 'src/app/interfaces'
import { ProjectService } from 'src/app/services/project.service'
import { AuthState } from 'src/app/store/auth/auth.reducer'

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit {
  auth$: Observable<AuthState>
  projectsPrivate: Observable<ProjectPrivate[]>
  constructor (
    private readonly store: Store<{ auth: AuthState }>,
    public dialog: MatDialog,
    private readonly projectService: ProjectService
  ) {
    this.auth$ = store.select('auth')
    this.projectsPrivate = this.projectService.listPrivate({})
  }

  ngOnInit (): void {

  }

  onEditProfile (): void {
    this.dialog.open(EditUserProfilDialogComponent)
  }

  projectKindToString (kind: number): string {
    const keys = Object.keys(ProjectKind).filter(key => ProjectKind[key as keyof typeof ProjectKind] === kind)
    return keys.length > 0 ? keys[0] : ''
  }
}
