import { Component, OnDestroy, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Router } from '@angular/router'
import { Store } from '@ngrx/store'
import { Observable, Subscription } from 'rxjs'
import { EditProjectInformationDialogComponent } from 'src/app/components/edit-project-information-dialog/edit-project-information-dialog.component'
import { EditUserProfilDialogComponent } from 'src/app/components/edit-user-profil-dialog/edit-user-profil-dialog.component'
import { ProjectAccessDialogComponent } from 'src/app/components/project-access-dialog/project-access-dialog.component'
import { ProjectKind } from 'src/app/enums'
import { ProjectPrivate } from 'src/app/interfaces'
import { ProjectService } from 'src/app/services/project.service'
import { AuthState } from 'src/app/store/auth/auth.reducer'
import { MatTableDataSource } from '@angular/material/table'

export interface datasourceInterface {
  projectId: number
  projectName: string
  projectType: string
  entityEmail: string
  entityPhone: string
  entityName: string
}

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['projectName', 'projectType', 'entityName', 'entityEmail', 'entityPhone']
  dataSource = new MatTableDataSource<datasourceInterface>()
  subscription?: Subscription

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

  ngOnDestroy (): void {
    if (this.subscription !== undefined) this.subscription.unsubscribe()
  }

  ngOnInit (): void {
    this.subscription = this.auth$.subscribe(authState => {
      if (authState.user !== undefined) {
        this.projectService.listPrivate({}).subscribe(projects => {
          this.projects = projects
          this.countAccessRequest = 0

          projects.forEach(project => project.entities.forEach(relation => {
            if (!relation.is_accepted) this.countAccessRequest++
          }))

          const tableData: datasourceInterface[] = []
          projects.forEach(project => {
            const relations = project.entities.filter(relation => relation.is_accepted && relation.entity.pk !== authState.user?.entity.pk)

            const data: datasourceInterface = {
              projectId: project.pk,
              projectName: project.name,
              projectType: this.projectKindToString(project.kind),
              entityName: (relations.length > 0) ? relations[0].entity.name : '',
              entityEmail: (relations.length > 0) ? relations[0].entity.email : '',
              entityPhone: (relations.length > 0) ? relations[0].entity.phone : ''
            }

            tableData.push(data)
          })
          this.dataSource.data = tableData
        })
      }
    })
  }

  onEditProfile (): void {
    this.dialog.open(EditUserProfilDialogComponent)
  }

  projectKindToString (kind: number): string {
    const keys = Object.keys(ProjectKind).filter(key => ProjectKind[key as keyof typeof ProjectKind] === kind)
    return keys.length > 0 ? keys[0] : ''
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
