import {Component, ViewChild} from '@angular/core';
import {CardComponent} from "../../shared/components/card/card.component";
import {DataTableCustomComponent} from "../../shared/components/data-table-custom/data-table-custom.component";
import {MatButton} from "@angular/material/button";
import {FieldsFormGroup} from "../../core/models/FieldsFormGroup";
import {FormGroup, Validators} from "@angular/forms";
import {ColumField} from "../../core/models/ColumField";
import {RequestUrlScheme} from "../../core/models/RequestUrlScheme";
import {ASSOCIATION, USERS} from "../../core/endpoints";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ModalCreateItemComponent} from "../../shared/components/modal-create-item/modal-create-item.component";
import {CrudService} from "../../core/services/CrudService";
import {NgxSpinnerService} from "ngx-spinner";
import {HttpErrorResponse} from "@angular/common/http";
import {
  ValidateActionButtonDirective
} from "../../shared/directives/validate-action-button/validate-action-button.directive";

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CardComponent,
    DataTableCustomComponent,
    MatButton,
    ValidateActionButtonDirective
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.sass'
})
export class UsersComponent {
  @ViewChild(DataTableCustomComponent) childDataTable!: DataTableCustomComponent
  fields: FieldsFormGroup[] = [
    {name: "username", label: "User", type: "input", validator: [Validators.required]},
    {name: "password", label: "Contraseña", type: "password", validator: [Validators.required]},
    {name: "name", label: "Nombre", type: "input", validator: [Validators.required]},
    {name: "lastName", label: "Apellido", type: "input", validator: [Validators.required]},
    {name: "role", label: "Rol", type: "select", validator: [Validators.required], optionsChild: [{label: "Inspector", value: "inspector"},{label: "Socio", value: "partner"}]},
    {name: "phone", label: "Telefono", type: "input", validator: [Validators.required]},
    {name: "department", label: "Departamento", type: "input", validator: [Validators.required]},
    {name: "municipality", label: "Municipio", type: "input", validator: [Validators.required]},
    {name: "address", label: "Direccion", type: "input", validator: [Validators.required]},
    {name: "organizationId", label: "Organizacion", type: "select", validator: [], optionsChildUrl: {url: ASSOCIATION, keysOfValue: ["code", "name"]}}
  ]
  columField: ColumField[] = [
    { name: "username", label: "User", sticky: true },
    { name: "name", label: "Nombre", sticky: false },
    { name: "lastName", label: "Apellido", sticky: false },
    { name: "role", label: "Rol", sticky: false },
    { name: "phone", label: "Telefono", sticky: false },
    { name: "department", label: "Departamento", sticky: false },
    { name: "municipality", label: "Municipio", sticky: false },
    { name: "address", label: "Direccion", sticky: false },
    { name: "createdAt", label: "Creacion", sticky: false },
    { name: "updatedAt", label: "Actualizacion", sticky: false },
    { name: "organization", label: "Organizacion", sticky: false },
    { name: "actionsButton", label: "Acciones", stickyEnd: true }
  ]
  request: RequestUrlScheme = {
    urlGet: USERS,
    urlGetAll: USERS+"?limit=${limit}&offset=${page}&relations=organization&organization=code,name",
    urlUpdate: USERS,
    urlDelete: USERS,
    itemsPerPage: 20,
  }
  dialogUpdate?: MatDialogRef<ModalCreateItemComponent>
  constructor(
    readonly dialog: MatDialog,
    readonly service: CrudService,
    readonly spinner: NgxSpinnerService,
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
        this.service.post(USERS, result.value).subscribe((response: any) => {
          this.spinner.hide("create")
          dt.getData(dt.pageNumber, dt.itemsPerPage);
        }, (error: HttpErrorResponse) => {
          this.spinner.hide("create")
        })
      }
    })
  }
}
