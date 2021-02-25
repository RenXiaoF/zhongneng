import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseSpecPage } from './choose-spec.page';

describe('ChooseSpecPage', () => {
  let component: ChooseSpecPage;
  let fixture: ComponentFixture<ChooseSpecPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseSpecPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseSpecPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
