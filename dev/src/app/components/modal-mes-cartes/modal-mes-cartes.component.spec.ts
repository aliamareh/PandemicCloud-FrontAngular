import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMesCartesComponent } from './modal-mes-cartes.component';

describe('ModalMesCartesComponent', () => {
  let component: ModalMesCartesComponent;
  let fixture: ComponentFixture<ModalMesCartesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalMesCartesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalMesCartesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
