import { ComponentFixture, TestBed } from '@angular/core/testing';
import { V1AppAccSidebarComponent } from './app-acc-sidebar.component';

describe('V1AppAccSidebarComponent', () => {
  let component: V1AppAccSidebarComponent;
  let fixture: ComponentFixture<V1AppAccSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [V1AppAccSidebarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(V1AppAccSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
