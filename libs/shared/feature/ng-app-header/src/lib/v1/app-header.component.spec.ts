import { ComponentFixture, TestBed } from '@angular/core/testing';
import { V1AppHeaderFeaComponent } from './app-header.component';

describe('V1AppHeaderFeaComponent', () => {
  let component: V1AppHeaderFeaComponent;
  let fixture: ComponentFixture<V1AppHeaderFeaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [V1AppHeaderFeaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(V1AppHeaderFeaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
