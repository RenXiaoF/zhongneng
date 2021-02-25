import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FillOrderPage } from './fill-order.page';

describe('FillOrderPage', () => {
  let component: FillOrderPage;
  let fixture: ComponentFixture<FillOrderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FillOrderPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FillOrderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
