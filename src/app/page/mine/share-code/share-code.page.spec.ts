import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareCodePage } from './share-code.page';

describe('ShareCodePage', () => {
  let component: ShareCodePage;
  let fixture: ComponentFixture<ShareCodePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareCodePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareCodePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
