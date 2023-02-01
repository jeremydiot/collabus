import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatSort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'
import { Store } from '@ngrx/store'
import { Observable, Subscription } from 'rxjs'
import { ProjectKind } from 'src/app/enums'
import { ProjectPrivate } from 'src/app/interfaces'
import { AuthState } from 'src/app/store/auth/auth.reducer'

export interface datasourceInterface {
  entityId: number
  projectId: number
  projectName: string
  projectType: string
  relationDate: string
  entityAddress: string
  entityPhone: string
  entityName: string
}

@Component({
  selector: 'app-project-access-dialog',
  templateUrl: './project-access-dialog.component.html',
  styleUrls: ['./project-access-dialog.component.scss']
})
export class ProjectAccessDialogComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort) sort!: MatSort
  displayedColumns: string[] = ['projectName', 'projectType', 'entityName', 'relationDate', 'entityAddress', 'entityPhone', 'action']
  dataSource = new MatTableDataSource<datasourceInterface>()

  auth$: Observable<AuthState>
  projects: ProjectPrivate[]
  subscription?: Subscription

  constructor (
    public dialogRef: MatDialogRef<ProjectAccessDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { projects: ProjectPrivate[] },
    store: Store<{ 'auth': AuthState }>
  ) {
    this.auth$ = store.select('auth')
    this.projects = data.projects
  }

  ngOnInit (): void {
    this.subscription = this.auth$.subscribe(authState => {
      if (authState.user !== undefined) {
        const relations: datasourceInterface[] = []
        this.projects.forEach(project => project.entities.forEach(relation => {
          if (relation.entity.pk !== authState.user?.entity.pk) {
            // console.log(this.projectkindToString(project.kind))

            relations.push({
              entityAddress: `${relation.entity.address}, ${relation.entity.zip_code} ${relation.entity.city}`,
              entityId: relation.entity.pk,
              entityPhone: relation.entity.phone,
              projectId: relation.folder,
              projectType: this.projectKindToString(project.kind),
              projectName: project.name,
              relationDate: this.parseDate(relation.created_at),
              entityName: relation.entity.name
            })
          }
        }))
        this.dataSource.data = relations
      }
    })
  }

  ngAfterViewInit (): void {
    this.dataSource.sort = this.sort
  }

  ngOnDestroy (): void {
    if (this.subscription !== undefined) this.subscription.unsubscribe()
  }

  onClose (): void {
    this.dialogRef.close()
  }

  parseDate (dateStr: string): string {
    const deadline = new Date(dateStr)
    const year = deadline.getFullYear()
    const month = ('0' + (deadline.getMonth() + 1).toString()).slice(-2)
    const day = ('0' + deadline.getDate().toString()).slice(-2)
    return `${year}-${month}-${day}`
  }

  projectKindToString (kind: number): string {
    const keys = Object.keys(ProjectKind).filter(key => ProjectKind[key as keyof typeof ProjectKind] === kind)
    return keys.length > 0 ? keys[0] : ''
  }

  onFilter (event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()
  }

  onDeleteRelation (idFolder: number, idEntity: number): void {
    console.log(idFolder, idEntity)
  }

  onAcceptRelation (idFolder: number, idEntity: number): void {
    console.log(idFolder, idEntity)
  }
}
