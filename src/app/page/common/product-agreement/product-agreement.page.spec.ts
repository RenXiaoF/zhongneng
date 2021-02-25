import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAgreementPage } from './product-agreement.page';

describe('ProductAgreementPage', () => {
  let component: ProductAgreementPage;
  let fixture: ComponentFixture<ProductAgreementPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductAgreementPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAgreementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
