import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DivideInformationPage } from './divide-information.page';

describe('DivideInformationPage', () => {
  let component: DivideInformationPage;
  let fixture: ComponentFixture<DivideInformationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DivideInformationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DivideInformationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
