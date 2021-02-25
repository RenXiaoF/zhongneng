import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ClassifyPage } from './classify.page';

describe('ClassifyPage', () => {
  let component: ClassifyPage;
  let fixture: ComponentFixture<ClassifyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassifyPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ClassifyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
