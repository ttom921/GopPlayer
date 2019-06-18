import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatBoardComponent } from './mat-board.component';

describe('MatBoardComponent', () => {
  let component: MatBoardComponent;
  let fixture: ComponentFixture<MatBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
