import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FansDetailPage } from './fans-detail.page';

describe('FansDetailPage', () => {
  let component: FansDetailPage;
  let fixture: ComponentFixture<FansDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FansDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FansDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
