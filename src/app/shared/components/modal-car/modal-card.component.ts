import {Component, Inject, OnInit, signal, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogContent, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {FormComponent} from "../form/form.component";
import {MatButtonModule} from "@angular/material/button";
import {FormGroup} from "@angular/forms";
import {FieldsFormGroup, FieldsOptions} from "../../../core/models/FieldsFormGroup";
import {PROJECT} from "../../../core/endpoints";
import {HttpErrorResponse} from "@angular/common/http";
import {MatIcon} from "@angular/material/icon";

@Component({
    selector: 'app-modal-card',
    imports: [
      MatDialogModule,
      MatButtonModule,
      MatIcon,
      FormComponent,
    ],
    templateUrl: './modal-card.component.html',
    styleUrl: './modal-card.component.sass'
})
export class ModalCardComponent {

  fields = signal<FieldsFormGroup[]>([])
  fieldsValue = signal<FieldsOptions[]>([])
  urlDelete = signal<String>("")
  @ViewChild(FormComponent) child!: FormComponent

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ModalCardComponent>
  ) {
    this.fields.set(data.fieldsForm)
    this.fieldsValue.set(data.fieldsValue)
    this.urlDelete.set(data.urlDelete)
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
        this.dialogRef.close({form})
      else
        this.dialogRef.close()
    }
  }

  remove() {
    this.dialogRef.close({delete: true})
  }
}
