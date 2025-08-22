import { ComponentFixture, TestBed } from '@angular/core/testing';
import { V1BasePageComponent } from './base.component';

describe('V1BasePageComponent', () => {
  let component: V1BasePageComponent;
  let fixture: ComponentFixture<V1BasePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [V1BasePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(V1BasePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
