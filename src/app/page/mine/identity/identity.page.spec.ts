import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentityPage } from './identity.page';

describe('IdentityPage', () => {
  let component: IdentityPage;
  let fixture: ComponentFixture<IdentityPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdentityPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
