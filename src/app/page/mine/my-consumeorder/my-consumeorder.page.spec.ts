import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyConsumeorderPage } from './my-consumeorder.page';

describe('MyConsumeorderPage', () => {
  let component: MyConsumeorderPage;
  let fixture: ComponentFixture<MyConsumeorderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyConsumeorderPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MyConsumeorderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
