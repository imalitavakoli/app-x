import { ComponentFixture, TestBed } from '@angular/core/testing';
import { V2AuthPageTplClassicComponent } from './auth-classic.component';

describe('V2AuthPageTplClassicComponent', () => {
  let component: V2AuthPageTplClassicComponent;
  let fixture: ComponentFixture<V2AuthPageTplClassicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [V2AuthPageTplClassicComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(V2AuthPageTplClassicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
