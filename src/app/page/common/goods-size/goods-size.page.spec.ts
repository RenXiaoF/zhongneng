import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GoodsSizePage } from './goods-size.page';

describe('GoodsSizePage', () => {
  let component: GoodsSizePage;
  let fixture: ComponentFixture<GoodsSizePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsSizePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GoodsSizePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
