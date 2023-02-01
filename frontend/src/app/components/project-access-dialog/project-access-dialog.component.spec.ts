import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectAccessDialogComponent } from './project-access-dialog.component';

describe('ProjectAccessDialogComponent', () => {
  let component: ProjectAccessDialogComponent;
  let fixture: ComponentFixture<ProjectAccessDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectAccessDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectAccessDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
