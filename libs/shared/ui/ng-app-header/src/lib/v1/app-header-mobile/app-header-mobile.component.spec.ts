import { ComponentFixture, TestBed } from '@angular/core/testing';
import { V1AppHeaderMobileComponent } from './app-header-mobile.component';

describe('V1AppHeaderMobileComponent', () => {
  let component: V1AppHeaderMobileComponent;
  let fixture: ComponentFixture<V1AppHeaderMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [V1AppHeaderMobileComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(V1AppHeaderMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
