import { ComponentFixture, TestBed } from '@angular/core/testing';
import { V1PopupComponent } from './popup.component';

describe('PopupComponent', () => {
  let component: V1PopupComponent;
  let fixture: ComponentFixture<V1PopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [V1PopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(V1PopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
