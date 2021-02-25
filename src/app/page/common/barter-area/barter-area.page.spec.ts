import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BarterAreaPage } from './barter-area.page';

describe('BarterAreaPage', () => {
  let component: BarterAreaPage;
  let fixture: ComponentFixture<BarterAreaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarterAreaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BarterAreaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
