import { ComponentFixture, TestBed } from '@angular/core/testing';
import { V1AppFooterDesktopComponent } from './app-footer-desktop.component';

describe('V1AppFooterDesktopComponent', () => {
  let component: V1AppFooterDesktopComponent;
  let fixture: ComponentFixture<V1AppFooterDesktopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [V1AppFooterDesktopComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(V1AppFooterDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
