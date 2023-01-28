import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss']
})
export class ProjectCardComponent implements OnInit {
  @Input() title = ''
  @Input() subTitle = ''
  @Input() content = ''
  @Input() deadline = ''
  @Input() projectId!: number
  @Input() buttonIcon = ''
  @Input() showButton = true
  @Output() actionEvent = new EventEmitter<number>()

  onAction (): void {
    this.actionEvent.emit(this.projectId)
  }

  ngOnInit (): void {
  }

  parseDeadline (stringDate: string): string {
    return new Date(stringDate).toLocaleDateString()
  }
}
