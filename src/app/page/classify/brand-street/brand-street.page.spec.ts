import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BrandStreetPage } from './brand-street.page';

describe('BrandStreetPage', () => {
  let component: BrandStreetPage;
  let fixture: ComponentFixture<BrandStreetPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrandStreetPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BrandStreetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
