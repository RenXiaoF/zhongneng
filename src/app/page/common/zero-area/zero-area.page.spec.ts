import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ZeroAreaPage } from './zero-area.page';

describe('ZeroAreaPage', () => {
  let component: ZeroAreaPage;
  let fixture: ComponentFixture<ZeroAreaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZeroAreaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ZeroAreaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
