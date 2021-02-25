import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoneyRecordPage } from './money-record.page';

describe('MoneyRecordPage', () => {
  let component: MoneyRecordPage;
  let fixture: ComponentFixture<MoneyRecordPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoneyRecordPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoneyRecordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
