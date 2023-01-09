import { Component, OnDestroy, OnInit } from '@angular/core'
import { ProjectService } from 'src/app/services/project.service'
import { Subscription } from 'rxjs'
import { Project } from 'src/app/models/project'
import { Entity } from 'src/app/models/auth'
import { MatDialog } from '@angular/material/dialog'
import { ProjectFilterDialogComponent } from 'src/app/components/project-filter-dialog/project-filter-dialog.component'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  subscription?: Subscription
  projects: Project[] = []

  constructor (
    private readonly projectService: ProjectService,
    public dialog: MatDialog
  ) {}

  ngOnInit (): void {
    this.subscription = this.projectService.list({ size: 9 }).subscribe((projects) => {
      this.projects = projects
    })
  }

  ngOnDestroy (): void {
    if (this.subscription !== undefined) this.subscription.unsubscribe()
  }

  getProjectAuthorEntity (project: Project): Entity | undefined {
    return project.entity.find(e => e.is_author)?.entity
  }

  onFilter (): void {
    this.dialog.open(ProjectFilterDialogComponent)
  }
}
