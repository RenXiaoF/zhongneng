import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RecommendedCoursePage } from './recommended-course.page';

describe('RecommendedCoursePage', () => {
  let component: RecommendedCoursePage;
  let fixture: ComponentFixture<RecommendedCoursePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecommendedCoursePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RecommendedCoursePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
