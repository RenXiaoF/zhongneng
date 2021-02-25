import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AfterSalePage } from './after-sale.page';

describe('AfterSalePage', () => {
  let component: AfterSalePage;
  let fixture: ComponentFixture<AfterSalePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AfterSalePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AfterSalePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
