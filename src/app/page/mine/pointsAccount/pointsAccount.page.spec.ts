import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PointsAccountPage } from './pointsAccount.page';

describe('DistributAccountPage', () => {
  let component: PointsAccountPage;
  let fixture: ComponentFixture<PointsAccountPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PointsAccountPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PointsAccountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
