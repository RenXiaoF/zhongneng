import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePswPage } from './change-psw.page';

describe('ChangePswPage', () => {
  let component: ChangePswPage;
  let fixture: ComponentFixture<ChangePswPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangePswPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePswPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
