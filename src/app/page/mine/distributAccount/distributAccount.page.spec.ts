import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributAccountPage } from './distributAccount.page';

describe('DistributAccountPage', () => {
  let component: DistributAccountPage;
  let fixture: ComponentFixture<DistributAccountPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistributAccountPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributAccountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
