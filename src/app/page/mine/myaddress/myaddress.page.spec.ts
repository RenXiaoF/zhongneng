import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyaddressPage } from './myaddress.page';

describe('MyaddressPage', () => {
  let component: MyaddressPage;
  let fixture: ComponentFixture<MyaddressPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyaddressPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyaddressPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
