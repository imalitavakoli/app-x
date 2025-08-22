import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedUiAngularDaylightComponent } from './daylight.component';

describe('SharedUiAngularDaylightComponent', () => {
  let component: SharedUiAngularDaylightComponent;
  let fixture: ComponentFixture<SharedUiAngularDaylightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedUiAngularDaylightComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedUiAngularDaylightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
