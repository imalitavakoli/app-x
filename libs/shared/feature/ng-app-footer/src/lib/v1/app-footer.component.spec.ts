import { ComponentFixture, TestBed } from '@angular/core/testing';
import { V1AppFooterFeaComponent } from './app-footer.component';

describe('V1AppFooterFeaComponent', () => {
  let component: V1AppFooterFeaComponent;
  let fixture: ComponentFixture<V1AppFooterFeaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [V1AppFooterFeaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(V1AppFooterFeaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
