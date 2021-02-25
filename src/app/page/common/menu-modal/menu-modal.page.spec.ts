import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MenuModalPage } from './menu-modal.page';

describe('MenuModalPage', () => {
  let component: MenuModalPage;
  let fixture: ComponentFixture<MenuModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MenuModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
