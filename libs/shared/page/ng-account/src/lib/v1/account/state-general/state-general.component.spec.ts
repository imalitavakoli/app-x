import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StateGeneralComponent } from './state-general.component';

describe('StateGeneralComponent', () => {
  let component: StateGeneralComponent;
  let fixture: ComponentFixture<StateGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StateGeneralComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StateGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
