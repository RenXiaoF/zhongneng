import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PswSettingPage } from './psw-setting.page';

describe('PswSettingPage', () => {
  let component: PswSettingPage;
  let fixture: ComponentFixture<PswSettingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PswSettingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PswSettingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
