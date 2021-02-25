import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FillOrderPage } from './fill-order.page';

describe('FillOrderPage', () => {
  let component: FillOrderPage;
  let fixture: ComponentFixture<FillOrderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FillOrderPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FillOrderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
