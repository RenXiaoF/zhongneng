import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewaddressPage } from './newaddress.page';

describe('NewaddressPage', () => {
  let component: NewaddressPage;
  let fixture: ComponentFixture<NewaddressPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewaddressPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewaddressPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
