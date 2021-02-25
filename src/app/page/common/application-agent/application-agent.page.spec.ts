import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ApplicationAgentPage } from './application-agent.page';

describe('ApplicationAgentPage', () => {
  let component: ApplicationAgentPage;
  let fixture: ComponentFixture<ApplicationAgentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationAgentPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ApplicationAgentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
