import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsignPage } from './commission.page';

describe('ConsignPage', () => {
  let component: ConsignPage;
  let fixture: ComponentFixture<ConsignPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsignPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsignPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
