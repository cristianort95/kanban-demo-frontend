import {Component, Inject, OnInit, signal, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogContent, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {FormComponent} from "../form/form.component";
import {MatButtonModule} from "@angular/material/button";
import {FormGroup} from "@angular/forms";
import {FieldsComments, FieldsFormGroup, FieldsOptions} from "../../../core/models/FieldsFormGroup";
import {PROJECT} from "../../../core/endpoints";
import {HttpErrorResponse} from "@angular/common/http";
import {MatIcon} from "@angular/material/icon";
import {NgForOf, NgIf} from "@angular/common";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";

@Component({
  selector: 'app-modal-card',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIcon,
    FormComponent,
    NgIf,
    NgForOf,
    MatFormField,
    MatInput,
    MatLabel
  ],
  templateUrl: './modal-card.component.html',
  standalone: true,
  styleUrl: './modal-card.component.sass'
})
export class ModalCardComponent {

  fields = signal<FieldsFormGroup[]>([])
  fieldsValue = signal<FieldsOptions[]>([])
  fieldsComments = signal<FieldsComments[]>([])
  urlDelete = signal<String>("")
  @ViewChild(FormComponent) child!: FormComponent

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ModalCardComponent>
  ) {
    this.fields.set(data.fieldsForm)
    this.fieldsValue.set(data.fieldsValue)
    console.log(data.fieldsComments)
    this.fieldsComments.set(data.fieldsComments)
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
