import { Component, OnDestroy, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute } from '@angular/router'
import { Subscription } from 'rxjs'
import { EditProjectInformationDialogComponent } from 'src/app/components/edit-project-information-dialog/edit-project-information-dialog.component'
import { ProjectKind } from 'src/app/enums'
import { Attachment, ProjectPrivate } from 'src/app/interfaces'
import { AttachmentService } from 'src/app/services/attachment.service'
import { ProjectService } from 'src/app/services/project.service'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.scss']
})
export class ProjectPageComponent implements OnInit, OnDestroy {
  projectId?: number
  project?: ProjectPrivate
  subscriptions: Subscription[] = []
  relations: ProjectPrivate['entities'] | any[] = []
  noteInputTimer?: NodeJS.Timeout
  sendAttachmentUrl?: string
  attachments?: Attachment[]
  backendHost = environment.backendHost

  constructor (
    private readonly projectService: ProjectService,
    private readonly route: ActivatedRoute,
    public dialog: MatDialog,
    private readonly attachmentService: AttachmentService
  ) {}

  ngOnInit (): void {
    this.relations = []
    const routeSub = this.route.params.subscribe(params => {
      if (params['id'] !== undefined) {
        if (this.projectId === undefined) this.projectId = params['id']

        this.projectService.getProjectPrivate(parseInt(params['id'])).subscribe((project) => {
          // relation entities
          const authorRelation = project.entities.find((relation) => relation.is_author)
          if (authorRelation !== undefined) this.relations?.push(authorRelation)
          const contributorRelation = project.entities.find((relation) => relation.is_accepted && relation.entity.kind === 2)
          if (contributorRelation !== undefined) this.relations?.push(contributorRelation)
          // project
          this.project = project

          this.attachmentService.get(params['id']).subscribe(attachments => { this.attachments = attachments })
        })
      }
    })
    this.subscriptions.push(routeSub)
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
        if (response !== undefined) {
          this.project = response
        }
      })
    })
    this.subscriptions.push(routeSub)
  }

  onFileUpload (event: any): void {
    if (this.projectId !== undefined) {
      const file = event.target.files[0] as File
      this.attachmentService.add(this.projectId, file).subscribe(() => {
        if (this.projectId !== undefined) this.attachmentService.get(this.projectId).subscribe(attachments => { this.attachments = attachments })
      })
    }
  }

  onDeleteFile (event: Event, attachmentId: number): void {
    event.preventDefault()
    if (this.projectId !== undefined) {
      this.attachmentService.delete(this.projectId, attachmentId).subscribe(() => {
        if (this.projectId !== undefined) this.attachmentService.get(this.projectId).subscribe(attachments => { this.attachments = attachments })
      })
    }
  }
}
