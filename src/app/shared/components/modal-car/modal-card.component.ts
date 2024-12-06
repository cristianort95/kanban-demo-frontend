import {Component, Inject, OnInit, signal, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogContent, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {FormComponent} from "../form/form.component";
import {MatButtonModule} from "@angular/material/button";
import {FormGroup} from "@angular/forms";
import {FieldsComments, FieldsFormGroup, FieldsOptions} from "../../../core/models/FieldsFormGroup";
import {MatIcon} from "@angular/material/icon";
import {NgForOf, NgIf} from "@angular/common";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {RequestUrlScheme} from "../../../core/models/RequestUrlScheme";
import {CommentComponent} from "../../../components/comment/comment.component";
import {NgxSpinnerService} from "ngx-spinner";
import {ToastrService} from "ngx-toastr";
import {CrudService} from "../../../core/services/CrudService";
import {ErrorHttpCustom} from "../../../core/models/ErrorHttpCustom";

@Component({
  selector: 'app-modal-card',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIcon,
    FormComponent,
    NgIf,
    NgForOf,
    CommentComponent
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
  urlComment: RequestUrlScheme
  id: string
  @ViewChild(FormComponent) child!: FormComponent

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ModalCardComponent>,
    readonly service: CrudService,
    readonly spinner: NgxSpinnerService,
    readonly toastr: ToastrService,
  ) {
    this.fields.set(data.fieldsForm)
    this.fieldsValue.set(data.fieldsValue)
    this.fieldsComments.set(data.fieldsComments)
    this.urlDelete.set(data.urlDelete)
    this.urlComment = this.data.urlComment
    this.id = this.data.id
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

  async deleteItem(id: number) {
    await this.spinner.show("job-delete").then()
    this.service.delete(`${this.urlComment.urlGet}/${this.id}/${id}`).subscribe((response: any) => {
      this.toastr.success("Comentario Eliminado!");
      this.spinner.hide("job-delete").then()
      window.location.reload()
    }, (error: ErrorHttpCustom) => {
      this.toastr.error("Error intente de nuevo!");
      this.spinner.hide("job-delete").then()
    });
  }

  remove() {
    this.dialogRef.close({delete: true})
  }
}
