import { ComponentFixture, TestBed } from '@angular/core/testing';
import { V1AppFooterMobileComponent } from './app-footer-mobile.component';

describe('V1AppFooterMobileComponent', () => {
  let component: V1AppFooterMobileComponent;
  let fixture: ComponentFixture<V1AppFooterMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [V1AppFooterMobileComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(V1AppFooterMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
