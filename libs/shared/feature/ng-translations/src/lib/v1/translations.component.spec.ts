import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedFeatureAngularTranslationsComponent } from './shared-feature-ng-translations.component';

describe('SharedFeatureAngularTranslationsComponent', () => {
  let component: SharedFeatureAngularTranslationsComponent;
  let fixture: ComponentFixture<SharedFeatureAngularTranslationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedFeatureAngularTranslationsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      SharedFeatureAngularTranslationsComponent,
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
