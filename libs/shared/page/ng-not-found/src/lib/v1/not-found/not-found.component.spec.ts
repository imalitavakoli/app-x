import { ComponentFixture, TestBed } from '@angular/core/testing';
import { V1NotFoundPageComponent } from './not-found.component';

describe('V1NotFoundPageComponent', () => {
  let component: V1NotFoundPageComponent;
  let fixture: ComponentFixture<V1NotFoundPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [V1NotFoundPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(V1NotFoundPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
