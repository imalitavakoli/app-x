import { ComponentFixture, TestBed } from '@angular/core/testing';
import { V1AppHeaderDesktopComponent } from './app-header-desktop.component';

describe('V1AppHeaderDesktopComponent', () => {
  let component: V1AppHeaderDesktopComponent;
  let fixture: ComponentFixture<V1AppHeaderDesktopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [V1AppHeaderDesktopComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(V1AppHeaderDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
