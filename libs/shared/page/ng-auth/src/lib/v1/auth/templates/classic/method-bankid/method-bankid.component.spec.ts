import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MethodBankidComponent } from './method-bankid.component';

describe('MethodBankidComponent', () => {
  let component: MethodBankidComponent;
  let fixture: ComponentFixture<MethodBankidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MethodBankidComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MethodBankidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
