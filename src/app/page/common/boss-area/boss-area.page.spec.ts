import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BossAreaPage } from './boss-area.page';

describe('BossAreaPage', () => {
  let component: BossAreaPage;
  let fixture: ComponentFixture<BossAreaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BossAreaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BossAreaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
