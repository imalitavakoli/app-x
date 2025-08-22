import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DepFacade } from './dep-facade';

describe('DepFacade', () => {
  let component: DepFacade;
  let fixture: ComponentFixture<DepFacade>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepFacade],
    }).compileComponents();

    fixture = TestBed.createComponent(DepFacade);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
