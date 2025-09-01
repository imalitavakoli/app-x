import { ComponentFixture, TestBed } from '@angular/core/testing';
import { V2AuthPageComponent } from './auth.component';

describe('V2AuthPageComponent', () => {
  let component: V2AuthPageComponent;
  let fixture: ComponentFixture<V2AuthPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [V2AuthPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(V2AuthPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
