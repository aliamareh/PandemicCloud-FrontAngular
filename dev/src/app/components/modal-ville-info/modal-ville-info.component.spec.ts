import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalVilleInfoComponent } from './modal-ville-info.component';

describe('ModalVilleInfoComponent', () => {
  let component: ModalVilleInfoComponent;
  let fixture: ComponentFixture<ModalVilleInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalVilleInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalVilleInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
