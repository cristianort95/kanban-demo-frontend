import {Component, Inject, OnInit, signal, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogContent, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {FormComponent} from "../form/form.component";
import {MatButtonModule} from "@angular/material/button";
import {FormGroup} from "@angular/forms";
import {FieldsFormGroup, FieldsOptions} from "../../../core/models/FieldsFormGroup";

@Component({
  selector: 'app-modal-create-item',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    FormComponent
  ],
  templateUrl: './modal-create-item.component.html',
  styleUrl: './modal-create-item.component.sass'
})
export class ModalCreateItemComponent {

  fields = signal<FieldsFormGroup[]>([])
  fieldsValue = signal<FieldsOptions[]>([])
  @ViewChild(FormComponent) child!: FormComponent

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ModalCreateItemComponent>
  ) {
    this.fields.set(data.fieldsForm ?? data)
    this.fieldsValue.set(data.fieldsValue)
  }

  sendSubmit() {
    this.child.form.markAllAsTouched();
    this.child.onSubmit();
  }

  onSubmit(form: FormGroup) {
    if (form.valid) {
      this.fieldsValue()?.forEach((field) => {
        if (!((form.get(field.label)?.value) && form.get(field.label)?.value != field.value))
          form.removeControl(field.label)
      })
      if (Object.keys(form.value).length > 0 )
        this.dialogRef.close(form)
      else
        this.dialogRef.close()
    }
  }
}
