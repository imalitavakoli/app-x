import { ComponentFixture, TestBed } from '@angular/core/testing';
import { V1AuthPageTplClassicComponent } from './auth-classic.component';

describe('V1AuthPageTplClassicComponent', () => {
  let component: V1AuthPageTplClassicComponent;
  let fixture: ComponentFixture<V1AuthPageTplClassicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [V1AuthPageTplClassicComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(V1AuthPageTplClassicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
