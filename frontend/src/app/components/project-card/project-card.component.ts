import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { ProjectDomain, ProjectKind } from 'src/app/enums'

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss']
})
export class ProjectCardComponent implements OnInit {
  @Input() entityName = ''
  @Input() entityActivity = ''
  @Input() entityLocation = ''

  @Input() projectName = ''
  @Input() projectKind!: number
  @Input() projectDescription = ''

  @Input() projectId!: number
  @Input() buttonIcon = ''
  @Input() buttonText = ''
  @Input() showButton = true
  @Output() actionEvent = new EventEmitter<number>()

  projectKindToString (kind: number): string {
    const keys = Object.keys(ProjectKind).filter(key => ProjectKind[key as keyof typeof ProjectKind] === kind)
    return keys.length > 0 ? keys[0] : ''
  }

  projectKindToDomainString (kind: number): string {
    let keys: string[] = []
    if (kind >= 1 && kind <= 5) keys = Object.keys(ProjectDomain).filter(key => ProjectDomain[key as keyof typeof ProjectDomain] === 1)
    if (kind >= 6 && kind <= 10) keys = Object.keys(ProjectDomain).filter(key => ProjectDomain[key as keyof typeof ProjectDomain] === 2)
    if (kind >= 11 && kind <= 15) keys = Object.keys(ProjectDomain).filter(key => ProjectDomain[key as keyof typeof ProjectDomain] === 3)
    return keys.length > 0 ? keys[0] : ''
  }

  projectKindToHeaderPicturePath (kind: number): string {
    if (kind >= 1 && kind <= 5) return '/assets/images/project-cards/uxuidesign.jpg'
    if (kind >= 6 && kind <= 10) return '/assets/images/project-cards/development.jpg'
    if (kind >= 11 && kind <= 15) return '/assets/images/project-cards/marketing.jpg'
    return ''
  }

  onAction (): void {
    this.actionEvent.emit(this.projectId)
  }

  ngOnInit (): void {
  }
}
