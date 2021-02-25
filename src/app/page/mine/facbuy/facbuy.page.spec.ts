import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacbuyPage } from './facbuy.page';

describe('FacbuyPage', () => {
  let component: FacbuyPage;
  let fixture: ComponentFixture<FacbuyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacbuyPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacbuyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
