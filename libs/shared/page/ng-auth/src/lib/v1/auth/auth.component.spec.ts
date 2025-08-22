import { ComponentFixture, TestBed } from '@angular/core/testing';
import { V1AuthPageComponent } from './auth.component';

describe('V1AuthPageComponent', () => {
  let component: V1AuthPageComponent;
  let fixture: ComponentFixture<V1AuthPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [V1AuthPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(V1AuthPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
