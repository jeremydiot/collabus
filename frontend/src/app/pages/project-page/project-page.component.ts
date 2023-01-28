import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Subscription } from 'rxjs'
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
  routeSubscription: Subscription
  relations: ProjectPrivate['entities'] | any[] = []

  constructor (
    private readonly projectService: ProjectService,
    private readonly route: ActivatedRoute
  ) {
    this.routeSubscription = this.route.params.subscribe(params => {
      if (params['id'] !== undefined) {
        const subscription = this.projectService.getProjectPrivate(parseInt(params['id'])).subscribe((project) => {
          const authorRelation = project.entities.find((relation) => relation.is_author)
          if (authorRelation !== undefined) this.relations?.push(authorRelation)
          const contributorRelation = project.entities.find((relation) => relation.is_accepted && relation.entity.kind === 2)
          if (contributorRelation !== undefined) this.relations?.push(contributorRelation)
          this.project = project
          subscription.unsubscribe()
        })
      }
    })
  }

  ngOnInit (): void {
  }

  ngOnDestroy (): void {
    this.routeSubscription.unsubscribe()
  }

  parseDate (stringDate: string | undefined): string {
    return (stringDate === undefined) ? '' : new Date(stringDate).toLocaleDateString()
  }

  projectKindToString (kind: number | undefined): string {
    if (kind === undefined) return ''
    const keys = Object.keys(ProjectKind).filter(key => ProjectKind[key as keyof typeof ProjectKind] === kind)
    return keys.length > 0 ? keys[0] : ''
  }
}
