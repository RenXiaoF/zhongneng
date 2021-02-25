import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AfterSaleProcessPage } from './after-sale-process.page';

describe('AfterSalePage', () => {
  let component: AfterSaleProcessPage;
  let fixture: ComponentFixture<AfterSaleProcessPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AfterSaleProcessPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AfterSaleProcessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
