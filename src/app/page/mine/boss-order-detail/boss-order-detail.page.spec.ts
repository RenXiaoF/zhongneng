import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BossOrderDetailPage } from './boss-order-detail.page';

describe('BossOrderDetailPage', () => {
  let component: BossOrderDetailPage;
  let fixture: ComponentFixture<BossOrderDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BossOrderDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BossOrderDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
