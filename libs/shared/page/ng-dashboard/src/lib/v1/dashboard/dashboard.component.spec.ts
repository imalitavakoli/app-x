import { ComponentFixture, TestBed } from '@angular/core/testing';
import { V1DashboardPageComponent } from './dashboard.component';

describe('V1DashboardPageComponent', () => {
  let component: V1DashboardPageComponent;
  let fixture: ComponentFixture<V1DashboardPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [V1DashboardPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(V1DashboardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
