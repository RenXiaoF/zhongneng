import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationAgreementPage } from './registration-agreement.page';

describe('RegistrationAgreementPage', () => {
  let component: RegistrationAgreementPage;
  let fixture: ComponentFixture<RegistrationAgreementPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrationAgreementPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationAgreementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
