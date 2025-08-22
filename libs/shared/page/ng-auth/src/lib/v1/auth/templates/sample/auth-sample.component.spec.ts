import { ComponentFixture, TestBed } from '@angular/core/testing';
import { V1AuthPageTplSampleComponent } from './auth-sample.component';

describe('V1AuthPageTplSampleComponent', () => {
  let component: V1AuthPageTplSampleComponent;
  let fixture: ComponentFixture<V1AuthPageTplSampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [V1AuthPageTplSampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(V1AuthPageTplSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
