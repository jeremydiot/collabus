import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  formGroup = new FormGroup({
    lastName: new FormControl(),
    firstName: new FormControl(),
    email: new FormControl(),
    phone: new FormControl(),
    entity: new FormControl(),
    entityName: new FormControl(),
    message: new FormControl()
  })

  constructor () { }

  ngOnInit (): void {
  }

  onSubmit (): void {
  }
}
