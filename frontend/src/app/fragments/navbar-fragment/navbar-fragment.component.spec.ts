import { ComponentFixture, TestBed } from '@angular/core/testing'

import { NavbarFragmentComponent } from './navbar-fragment.component'

describe('NavbarFragmentComponent', () => {
  let component: NavbarFragmentComponent
  let fixture: ComponentFixture<NavbarFragmentComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbarFragmentComponent]
    })
      .compileComponents()

    fixture = TestBed.createComponent(NavbarFragmentComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
