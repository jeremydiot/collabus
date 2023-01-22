import { ComponentFixture, TestBed } from '@angular/core/testing'

import { FooterFragmentComponent } from './footer-fragment.component'

describe('FooterFragmentComponent', () => {
  let component: FooterFragmentComponent
  let fixture: ComponentFixture<FooterFragmentComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FooterFragmentComponent]
    })
      .compileComponents()

    fixture = TestBed.createComponent(FooterFragmentComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
