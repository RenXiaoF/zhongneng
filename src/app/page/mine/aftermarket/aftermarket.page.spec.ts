import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AftermarketPage } from './aftermarket.page';

describe('MyConsumeorderPage', () => {
  let component: AftermarketPage;
  let fixture: ComponentFixture<AftermarketPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AftermarketPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AftermarketPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
