import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MethodMagicComponent } from './method-magic.component';

describe('MethodMagicComponent', () => {
  let component: MethodMagicComponent;
  let fixture: ComponentFixture<MethodMagicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MethodMagicComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MethodMagicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
