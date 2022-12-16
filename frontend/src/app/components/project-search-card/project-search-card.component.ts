import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'app-project-search-card',
  templateUrl: './project-search-card.component.html',
  styleUrls: ['./project-search-card.component.scss']
})
export class ProjectSearchCardComponent implements OnInit {
  @Input() title = ''
  @Input() subTitle = ''
  @Input() content = ''
  @Input() projectId!: number

  ngOnInit (): void {
  }
}
