import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StateLanguageComponent } from './state-language.component';

describe('StateLanguageComponent', () => {
  let component: StateLanguageComponent;
  let fixture: ComponentFixture<StateLanguageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StateLanguageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StateLanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
