import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GoodsListPage } from './goods-list.page';

describe('GoodsListPage', () => {
  let component: GoodsListPage;
  let fixture: ComponentFixture<GoodsListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GoodsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
