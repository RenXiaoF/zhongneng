import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BrandClassifyPage } from './brand-classify.page';

describe('BrandClassifyPage', () => {
  let component: BrandClassifyPage;
  let fixture: ComponentFixture<BrandClassifyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrandClassifyPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BrandClassifyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
