import { Component, ElementRef, ViewChild } from '@angular/core'
import { MatIconRegistry } from '@angular/material/icon'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('page') pageWrapper!: ElementRef
  title = 'collabus'

  constructor (private readonly matIconRegistry: MatIconRegistry) {
    matIconRegistry.setDefaultFontSetClass(...['material-symbols-rounded'].concat(matIconRegistry.getDefaultFontSetClass()))
  }

  onActivate (event: Event): void {
    this.pageWrapper.nativeElement.scroll({
      top: 0,
      left: 0,
      behavior: 'auto'
    })
  }
}
