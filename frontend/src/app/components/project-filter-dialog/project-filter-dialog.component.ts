import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { MatDialogRef } from '@angular/material/dialog'
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete'

@Component({
  selector: 'app-project-filter-dialog',
  templateUrl: './project-filter-dialog.component.html',
  styleUrls: ['./project-filter-dialog.component.scss']
})
export class ProjectFilterDialogComponent implements OnInit {
  form = new FormGroup({
    startCreatedAt: new FormControl('', { nonNullable: true }),
    endCreatedAt: new FormControl('', { nonNullable: true }),
    startDeadline: new FormControl('', { nonNullable: true }),
    endDeadline: new FormControl('', { nonNullable: true }),
    description: new FormControl('', { nonNullable: true }),
    entity: new FormControl('', { nonNullable: true }),
    name: new FormControl('', { nonNullable: true }),
    type: new FormControl('', { nonNullable: true })
  })

  projectTypes: Array<{ id: number, name: string }> = [
    { id: 1, name: 'developpement de site web' },
    { id: 2, name: 'maquettage de site web' },
    { id: 3, name: 'création de charte graphique' },
    { id: 4, name: 'stratégie de communication' },
    { id: 5, name: 'stratégie digitale' }
  ]

  projectEntities: Array<{ id: number, name: string }> = [
    { id: 1, name: 'test1' },
    { id: 2, name: 'test2' },
    { id: 3, name: 'test3' },
    { id: 4, name: 'test4' },
    { id: 5, name: 'test5' }
  ]

  selectedProjectEntities: Array<{ id: number, name: string }> = [

  ]

  filteredProjectEntities = this.projectEntities

  constructor (
    public dialogRef: MatDialogRef<ProjectFilterDialogComponent>
  ) {
    this.form.controls.entity.valueChanges.subscribe(search => {
      if (typeof search === 'string') {
        this.filteredProjectEntities = this.projectEntities.filter(e => e.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
      } else {
        this.filteredProjectEntities = this.projectEntities
      }
    })
  }

  ngOnInit (): void {
  }

  onValid (): void {

  }

  removeEntity (entityId: number): void {
    const index = this.selectedProjectEntities.findIndex(e => e.id === entityId)

    if (index > -1) {
      this.projectEntities.push(this.selectedProjectEntities[index])
      this.selectedProjectEntities.splice(index, 1)
    }
  }

  addEntity (event: MatAutocompleteSelectedEvent): void {
    const index = this.projectEntities.findIndex(e => e.id === event.option.value)

    if (index > -1) {
      this.selectedProjectEntities.push(this.projectEntities[index])
      this.projectEntities.splice(index, 1)
    }
  }
}
