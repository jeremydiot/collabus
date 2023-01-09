import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ProjectFilterDialogComponent } from './project-filter-dialog.component'

describe('ProjectFilterDialogComponent', () => {
  let component: ProjectFilterDialogComponent
  let fixture: ComponentFixture<ProjectFilterDialogComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectFilterDialogComponent]
    })
      .compileComponents()

    fixture = TestBed.createComponent(ProjectFilterDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
