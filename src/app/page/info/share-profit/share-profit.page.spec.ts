import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShareProfitPage } from './share-profit.page';

describe('ShareProfitPage', () => {
  let component: ShareProfitPage;
  let fixture: ComponentFixture<ShareProfitPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareProfitPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShareProfitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
