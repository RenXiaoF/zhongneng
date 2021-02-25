import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FuliAreaPage } from './fuli-area.page';

describe('FuliAreaPage', () => {
  let component: FuliAreaPage;
  let fixture: ComponentFixture<FuliAreaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuliAreaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FuliAreaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
