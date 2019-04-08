import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PairBuilderComponent } from './pair-builder.component';

describe('PairBuilderComponent', () => {
  let component: PairBuilderComponent;
  let fixture: ComponentFixture<PairBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PairBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PairBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
