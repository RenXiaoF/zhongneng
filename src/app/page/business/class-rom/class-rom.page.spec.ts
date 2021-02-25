import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ClassRomPage } from './class-rom.page';

describe('ClassRomPage', () => {
  let component: ClassRomPage;
  let fixture: ComponentFixture<ClassRomPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassRomPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ClassRomPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
