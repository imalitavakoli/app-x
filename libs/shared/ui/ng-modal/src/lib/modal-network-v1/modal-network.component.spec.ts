import { ComponentFixture, TestBed } from '@angular/core/testing';
import { V1ModalNetworkComponent } from './modal-network.component';

describe('V1ModalNetworkComponent', () => {
  let component: V1ModalNetworkComponent;
  let fixture: ComponentFixture<V1ModalNetworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [V1ModalNetworkComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(V1ModalNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
