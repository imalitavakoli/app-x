import { ComponentFixture, TestBed } from '@angular/core/testing';
import { V1ModalNetworkFeaComponent } from './modal-network.component';

describe('V1ModalNetworkComponent', () => {
  let component: V1ModalNetworkFeaComponent;
  let fixture: ComponentFixture<V1ModalNetworkFeaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [V1ModalNetworkFeaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(V1ModalNetworkFeaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
