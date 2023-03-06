import { ComponentFixture, TestBed } from '@angular/core/testing'

import { EditUserProfilDialogComponent } from './edit-user-profil-dialog.component'

describe('EditUserProfilDialogComponent', () => {
  let component: EditUserProfilDialogComponent
  let fixture: ComponentFixture<EditUserProfilDialogComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditUserProfilDialogComponent]
    })
      .compileComponents()

    fixture = TestBed.createComponent(EditUserProfilDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
