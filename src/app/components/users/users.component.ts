import {Component, ViewChild} from '@angular/core';
import {CardComponent} from "../../shared/components/card/card.component";
import {DataTableCustomComponent} from "../../shared/components/data-table-custom/data-table-custom.component";
import {MatButton} from "@angular/material/button";
import {FieldsFormGroup} from "../../core/models/FieldsFormGroup";
import {FormGroup, Validators} from "@angular/forms";
import {ColumField} from "../../core/models/ColumField";
import {RequestUrlScheme} from "../../core/models/RequestUrlScheme";
import {TEAMS} from "../../core/endpoints";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ModalCreateItemComponent} from "../../shared/components/modal-create-item/modal-create-item.component";
import {CrudService} from "../../core/services/CrudService";
import {NgxSpinnerService} from "ngx-spinner";
import {HttpErrorResponse} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {ErrorHttpCustom} from "../../core/models/ErrorHttpCustom";

@Component({
    selector: 'app-users',
    imports: [
        CardComponent,
        DataTableCustomComponent,
        MatButton
    ],
    templateUrl: './users.component.html',
    styleUrl: './users.component.sass'
})
export class UsersComponent {
  @ViewChild(DataTableCustomComponent) childDataTable!: DataTableCustomComponent
  dialogUpdate?: MatDialogRef<ModalCreateItemComponent>
  projectId = this.route.snapshot.paramMap.get('projectId');
  fields: FieldsFormGroup[] = [
    { name: "userId", label: "Email", type: "input", validator: [Validators.required]},
    { name: "role", label: "Rol", type: "input", validator: [Validators.required]},
  ]
  columField: ColumField[] = [
    { name: "user", label: "User", sticky: true },
    { name: "role", label: "Rol", sticky: false },
    { name: "actionsButton", label: "Acciones", stickyEnd: true }
  ]
  request: RequestUrlScheme = {
    urlGet: TEAMS+"/"+this.projectId,
    urlGetAll: TEAMS+"/"+this.projectId+"?limit=${limit}&offset=${page}&relations=user&user=email,name",
    urlUpdate: TEAMS+"/"+this.projectId,
    urlDelete: TEAMS+"/"+this.projectId,
    itemsPerPage: 20,
  }
  constructor(
    readonly dialog: MatDialog,
    readonly service: CrudService,
    readonly spinner: NgxSpinnerService,
    readonly route: ActivatedRoute,
    readonly toastr: ToastrService,
  ) {}

  async createModal() {
    const dt = this.childDataTable
    this.dialogUpdate = this.dialog.open(ModalCreateItemComponent, {
      width: '90%',
      data: this.fields
    })
    this.dialogUpdate.afterClosed().subscribe((result: FormGroup) => {
      if (result) {
        dt.pageNumber = 0;
        this.spinner.show("create")
        this.service.post(TEAMS+"/"+this.projectId, result.value).subscribe((response: any) => {
          this.spinner.hide("create")
          dt.getData(dt.pageNumber, dt.itemsPerPage);
          this.toastr.success("Usuario agregado!");
        }, (error: ErrorHttpCustom) => {
          this.toastr.error("Error: Verifique que el usuario ya se encuentre registrado");
          this.spinner.hide("create")
        })
      }
    })
  }
}
