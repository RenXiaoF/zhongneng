import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashdetailPage } from './cashdetail.page';

describe('CashdetailPage', () => {
  let component: CashdetailPage;
  let fixture: ComponentFixture<CashdetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashdetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashdetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
