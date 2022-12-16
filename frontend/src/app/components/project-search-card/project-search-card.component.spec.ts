import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSearchCardComponent } from './project-search-card.component';

describe('ProjectSearchCardComponent', () => {
  let component: ProjectSearchCardComponent;
  let fixture: ComponentFixture<ProjectSearchCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectSearchCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectSearchCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
