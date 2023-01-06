import { Component, OnDestroy, OnInit } from '@angular/core'
import { ProjectService } from 'src/app/services/project.service'
import { Subscription } from 'rxjs'
import { Project } from 'src/app/models/project'
import { Entity } from 'src/app/models/auth'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  subscription?: Subscription
  projects: Project[] = []

  constructor (private readonly projectService: ProjectService) {}

  ngOnInit (): void {
    this.subscription = this.projectService.list({}).subscribe((projects) => {
      this.projects = projects
    })
  }

  ngOnDestroy (): void {
    if (this.subscription !== undefined) this.subscription.unsubscribe()
  }

  getProjectAuthorEntity (project: Project): Entity | undefined {
    return project.entity.find(e => e.is_author)?.entity
  }
}
