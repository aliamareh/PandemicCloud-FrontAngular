import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMonRoleComponent } from './modal-mon-role.component';

describe('ModalMesActionsComponent', () => {
  let component: ModalMonRoleComponent;
  let fixture: ComponentFixture<ModalMonRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalMonRoleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalMonRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
