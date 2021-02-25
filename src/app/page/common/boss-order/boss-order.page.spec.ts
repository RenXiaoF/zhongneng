import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BossOrderPage } from './boss-order.page';

describe('BossOrderPage', () => {
  let component: BossOrderPage;
  let fixture: ComponentFixture<BossOrderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BossOrderPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BossOrderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
