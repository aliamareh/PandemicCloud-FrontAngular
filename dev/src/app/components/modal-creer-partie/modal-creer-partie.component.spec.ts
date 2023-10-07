import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCreerPartieComponent } from './modal-creer-partie.component';

describe('ModalCreerPartieComponent', () => {
  let component: ModalCreerPartieComponent;
  let fixture: ComponentFixture<ModalCreerPartieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalCreerPartieComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCreerPartieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
