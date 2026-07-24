import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VxBlahblahComponent } from './blahblah.component';

describe('VxBlahblahComponent', () => {
  let component: VxBlahblahComponent;
  let fixture: ComponentFixture<VxBlahblahComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VxBlahblahComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VxBlahblahComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
