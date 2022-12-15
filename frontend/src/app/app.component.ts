import { Component } from '@angular/core'
import { MatIconRegistry } from '@angular/material/icon'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'collabus'

  constructor (private readonly matIconRegistry: MatIconRegistry) {
    matIconRegistry.setDefaultFontSetClass(...['material-symbols-rounded'].concat(matIconRegistry.getDefaultFontSetClass()))
  }
}
