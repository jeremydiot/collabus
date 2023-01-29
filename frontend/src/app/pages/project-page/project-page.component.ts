import { Component, OnDestroy, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute } from '@angular/router'
import { Subscription } from 'rxjs'
import { EditProjectInformationDialogComponent } from 'src/app/components/edit-project-information-dialog/edit-project-information-dialog.component'
import { ProjectKind } from 'src/app/enums'
import { ProjectPrivate } from 'src/app/interfaces'
import { ProjectService } from 'src/app/services/project.service'

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.scss']
})
export class ProjectPageComponent implements OnInit, OnDestroy {
  project?: ProjectPrivate
  subscriptions: Subscription[] = []
  relations: ProjectPrivate['entities'] | any[] = []
  noteInputTimer?: NodeJS.Timeout

  constructor (
    private readonly projectService: ProjectService,
    private readonly route: ActivatedRoute,
    public dialog: MatDialog
  ) {}

  ngOnInit (): void {
    this.relations = []
    const routeSub = this.route.params.subscribe(params => {
      if (params['id'] !== undefined) {
        const subscription = this.projectService.getProjectPrivate(parseInt(params['id'])).subscribe((project) => {
          // relation entities
          const authorRelation = project.entities.find((relation) => relation.is_author)
          if (authorRelation !== undefined) this.relations?.push(authorRelation)
          const contributorRelation = project.entities.find((relation) => relation.is_accepted && relation.entity.kind === 2)
          if (contributorRelation !== undefined) this.relations?.push(contributorRelation)
          // project
          this.project = project
          subscription.unsubscribe()
        })
      }
    })
    this.subscriptions.push(routeSub)
    // this.onEditInformation()
  }

  ngOnDestroy (): void {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }

  parseDate (stringDate: string | undefined): string {
    return (stringDate === undefined) ? '' : new Date(stringDate).toLocaleDateString()
  }

  projectKindToString (kind: number | undefined): string {
    if (kind === undefined) return ''
    const keys = Object.keys(ProjectKind).filter(key => ProjectKind[key as keyof typeof ProjectKind] === kind)
    return keys.length > 0 ? keys[0] : ''
  }

  noteInput (value: string): void {
    if (this.noteInputTimer !== undefined)clearTimeout(this.noteInputTimer)
    this.noteInputTimer = setTimeout(() => {
      if (this.project !== undefined) {
        this.projectService.updateProjectPrivate(this.project.pk, undefined, undefined, value).subscribe((project) => {
          this.project = project
        })
      }
    }, 1000)
  }

  onEditInformation (): void {
    const routeSub = this.route.params.subscribe(params => {
      const dialogRef = this.dialog.open(EditProjectInformationDialogComponent, { data: { projectId: params['id'] } })
      dialogRef.afterClosed().subscribe((response) => {
        if (response === true) {
          this.ngOnInit()
        }
      })
    })
    this.subscriptions.push(routeSub)
  }
}
