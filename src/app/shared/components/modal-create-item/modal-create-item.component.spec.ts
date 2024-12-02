import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCreateItemComponent } from './modal-create-item.component';

describe('ModalCreateItemComponent', () => {
  let component: ModalCreateItemComponent;
  let fixture: ComponentFixture<ModalCreateItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCreateItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCreateItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
