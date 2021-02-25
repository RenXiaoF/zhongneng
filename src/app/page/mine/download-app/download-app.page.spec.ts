import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadAppPage } from './download-app.page';

describe('DownloadAppPage', () => {
  let component: DownloadAppPage;
  let fixture: ComponentFixture<DownloadAppPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadAppPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadAppPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
