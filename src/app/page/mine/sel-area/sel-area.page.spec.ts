import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelAreaPage } from './sel-area.page';

describe('SelAreaPage', () => {
  let component: SelAreaPage;
  let fixture: ComponentFixture<SelAreaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelAreaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelAreaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
