import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedUiAngularTranslationsComponent } from './shared-ui-ng-translations.component';

describe('SharedUiAngularTranslationsComponent', () => {
  let component: SharedUiAngularTranslationsComponent;
  let fixture: ComponentFixture<SharedUiAngularTranslationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedUiAngularTranslationsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedUiAngularTranslationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
