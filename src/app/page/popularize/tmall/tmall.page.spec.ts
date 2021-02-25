import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TmallPage } from './tmall.page';

describe('TmallPage', () => {
  let component: TmallPage;
  let fixture: ComponentFixture<TmallPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TmallPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TmallPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
