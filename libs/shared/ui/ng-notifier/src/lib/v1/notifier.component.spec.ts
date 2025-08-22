import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularNotifierComponent } from './ng-notifier.component';

describe('AngularNotifierComponent', () => {
  let component: AngularNotifierComponent;
  let fixture: ComponentFixture<AngularNotifierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AngularNotifierComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AngularNotifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
