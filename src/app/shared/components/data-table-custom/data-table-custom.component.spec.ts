import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTableCustomComponent } from './data-table-custom.component';

describe('DataTableComponent', () => {
  let component: DataTableCustomComponent;
  let fixture: ComponentFixture<DataTableCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataTableCustomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataTableCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
