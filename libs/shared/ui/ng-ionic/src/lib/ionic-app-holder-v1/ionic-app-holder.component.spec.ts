import { ComponentFixture, TestBed } from '@angular/core/testing';
import { V1IonicComponent } from './ionic.component';

describe('V1IonicComponent', () => {
  let component: V1IonicComponent;
  let fixture: ComponentFixture<V1IonicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [V1IonicComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(V1IonicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
