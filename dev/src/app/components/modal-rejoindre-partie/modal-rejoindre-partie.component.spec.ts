import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRejoindrePartieComponent } from './modal-rejoindre-partie.component';

describe('ModalRejoindrePartieComponent', () => {
  let component: ModalRejoindrePartieComponent;
  let fixture: ComponentFixture<ModalRejoindrePartieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalRejoindrePartieComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalRejoindrePartieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
