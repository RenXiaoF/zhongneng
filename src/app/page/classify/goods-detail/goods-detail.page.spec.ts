import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsDetailPage } from './goods-detail.page';

describe('GoodsDetailPage', () => {
  let component: GoodsDetailPage;
  let fixture: ComponentFixture<GoodsDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsDetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
