import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Disp264Component } from './disp264.component';

describe('Disp264Component', () => {
  let component: Disp264Component;
  let fixture: ComponentFixture<Disp264Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Disp264Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Disp264Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
