import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProjectInformationDialogComponent } from './edit-project-information-dialog.component';

describe('EditProjectInformationDialogComponent', () => {
  let component: EditProjectInformationDialogComponent;
  let fixture: ComponentFixture<EditProjectInformationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditProjectInformationDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditProjectInformationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
