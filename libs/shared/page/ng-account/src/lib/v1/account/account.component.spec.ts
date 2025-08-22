import { ComponentFixture, TestBed } from '@angular/core/testing';
import { V1AccountPageComponent } from './account.component';

describe('V1AccountPageComponent', () => {
  let component: V1AccountPageComponent;
  let fixture: ComponentFixture<V1AccountPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [V1AccountPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(V1AccountPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
