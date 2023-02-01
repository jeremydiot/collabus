import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Router } from '@angular/router'
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { EditProjectInformationDialogComponent } from 'src/app/components/edit-project-information-dialog/edit-project-information-dialog.component'
import { EditUserProfilDialogComponent } from 'src/app/components/edit-user-profil-dialog/edit-user-profil-dialog.component'
import { ProjectAccessDialogComponent } from 'src/app/components/project-access-dialog/project-access-dialog.component'
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
  countAccessRequest = 0
  projects?: ProjectPrivate[]
  constructor (
    private readonly store: Store<{ auth: AuthState }>,
    public dialog: MatDialog,
    private readonly projectService: ProjectService,
    private readonly router: Router
  ) {
    this.auth$ = store.select('auth')
  }

  ngOnInit (): void {
    this.projectService.listPrivate({}).subscribe(projects => {
      this.projects = projects
      this.countAccessRequest = 0
      projects.forEach(project => project.entities.forEach(relation => {
        if (!relation.is_accepted) this.countAccessRequest++
      }))
    })
  }

  onEditProfile (): void {
    this.dialog.open(EditUserProfilDialogComponent)
  }

  projectKindToString (kind: number): string {
    const keys = Object.keys(ProjectKind).filter(key => ProjectKind[key as keyof typeof ProjectKind] === kind)
    return keys.length > 0 ? keys[0] : ''
  }

  onOpenProject (id: number): void {
    void this.router.navigate(['project', id])
  }

  onManageAccess (): void {
    if (this.projects !== undefined) {
      const dialogRef = this.dialog.open(ProjectAccessDialogComponent, { data: { projects: this.projects } })
      dialogRef.afterClosed().subscribe(() => {
        this.ngOnInit()
      })
    }
  }

  onCreateNewProject (): void {
    const dialogRef = this.dialog.open(EditProjectInformationDialogComponent)
    dialogRef.afterClosed().subscribe((response) => {
      this.ngOnInit()
    })
  }
}
