import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PresellPage } from './presell.page';

describe('PresellPage', () => {
  let component: PresellPage;
  let fixture: ComponentFixture<PresellPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PresellPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PresellPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
