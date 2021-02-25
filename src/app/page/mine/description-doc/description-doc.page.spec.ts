import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionDocPage } from './description-doc.page';

describe('DescriptionDocPage', () => {
  let component: DescriptionDocPage;
  let fixture: ComponentFixture<DescriptionDocPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DescriptionDocPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptionDocPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
