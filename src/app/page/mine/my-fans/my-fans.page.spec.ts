import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyFansPage } from './my-fans.page';

describe('MyFansPage', () => {
  let component: MyFansPage;
  let fixture: ComponentFixture<MyFansPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyFansPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyFansPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
