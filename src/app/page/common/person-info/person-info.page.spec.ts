import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PersonInfoPage } from './person-info.page';

describe('PersonInfoPage', () => {
  let component: PersonInfoPage;
  let fixture: ComponentFixture<PersonInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonInfoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PersonInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
