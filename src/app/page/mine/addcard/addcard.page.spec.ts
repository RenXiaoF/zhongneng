import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddcardPage } from './addcard.page';

describe('AddcardPage', () => {
  let component: AddcardPage;
  let fixture: ComponentFixture<AddcardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddcardPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddcardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
