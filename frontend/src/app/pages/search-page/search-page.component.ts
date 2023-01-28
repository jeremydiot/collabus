import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Store } from '@ngrx/store'
import { map, Observable, switchMap } from 'rxjs'
import { ProjectKind } from 'src/app/enums'
import { ProjectPublic } from 'src/app/interfaces'
import { ProjectService } from 'src/app/services/project.service'
import { AuthState } from 'src/app/store/auth/auth.reducer'

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent implements OnInit {
  projectsPublic!: ProjectPublic[]
  entityProjectIds!: number[]
  auth$: Observable<AuthState>
  constructor (
    private readonly projectservice: ProjectService,
    private readonly store: Store<{ auth: AuthState }>,
    private readonly router: Router
  ) {
    this.auth$ = store.select('auth')
  }

  ngOnInit (): void {
    const subscription = this.projectservice.listPulic({}).pipe(switchMap((projects) =>
      this.projectservice.entityProjectList().pipe(map((entityProjects) => {
        this.entityProjectIds = entityProjects.map(e => e.folder.pk)
        return projects
      }
      ))
    )).subscribe((projects) => {
      this.projectsPublic = projects
      subscription.unsubscribe()
    })
  }

  projectKindToString (kind: number): string {
    const keys = Object.keys(ProjectKind).filter(key => ProjectKind[key as keyof typeof ProjectKind] === kind)
    return keys.length > 0 ? keys[0] : ''
  }

  onJoinProject (id: number): void {
    if (this.entityProjectIds.includes(id)) {
      const subscription = this.projectservice.contributorProjectExit(id).subscribe(() => {
        this.ngOnInit()
        subscription.unsubscribe()
      })
    } else {
      const subscription = this.projectservice.contributorProjectJoin(id).subscribe(() => {
        this.ngOnInit()
        subscription.unsubscribe()
      })
    }
  }
}
