import { ComponentFixture, TestBed } from '@angular/core/testing';
import { V1AppAccSidebarFeaComponent } from './app-acc-sidebar.component';

describe('V1AppAccSidebarFeaComponent', () => {
  let component: V1AppAccSidebarFeaComponent;
  let fixture: ComponentFixture<V1AppAccSidebarFeaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [V1AppAccSidebarFeaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(V1AppAccSidebarFeaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
