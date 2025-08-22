import { ComponentFixture, TestBed } from '@angular/core/testing';
import { V1PreloadersComponent } from './preloaders.component';

describe('PreloadersComponent', () => {
  let component: V1PreloadersComponent;
  let fixture: ComponentFixture<V1PreloadersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [V1PreloadersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(V1PreloadersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
