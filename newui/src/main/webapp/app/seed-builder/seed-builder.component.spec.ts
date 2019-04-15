import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeedBuilderComponent } from './seed-builder.component';

describe('SeedBuilderComponent', () => {
  let component: SeedBuilderComponent;
  let fixture: ComponentFixture<SeedBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeedBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeedBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
