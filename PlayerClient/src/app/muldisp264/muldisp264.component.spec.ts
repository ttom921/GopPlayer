import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Muldisp264Component } from './muldisp264.component';

describe('Muldisp264Component', () => {
  let component: Muldisp264Component;
  let fixture: ComponentFixture<Muldisp264Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Muldisp264Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Muldisp264Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
