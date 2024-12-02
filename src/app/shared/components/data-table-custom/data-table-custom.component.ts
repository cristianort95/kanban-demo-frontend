import {Component, Input, OnInit, signal} from '@angular/core';
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {CrudService} from "../../../core/services/CrudService";
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable
} from "@angular/material/table";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {KeyValuePipe, NgForOf, NgIf, NgOptimizedImage, NgSwitch, NgSwitchCase, NgSwitchDefault} from "@angular/common";
import {MatButtonModule, MatIconButton} from "@angular/material/button";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ModalCreateItemComponent} from "../modal-create-item/modal-create-item.component";
import {FormGroup} from "@angular/forms";
import {RequestUrlScheme} from "../../../core/models/RequestUrlScheme";
import {ColumField} from "../../../core/models/ColumField";
import {FieldsFormGroup, FieldsOptions} from "../../../core/models/FieldsFormGroup";
import {NgxSpinnerService} from "ngx-spinner";
import {HttpErrorResponse} from "@angular/common/http";
import {RouterLink} from "@angular/router";
import {MatFormField} from "@angular/material/form-field";
import {FullscreenImageDirective} from "../../directives/fullscreen-image/fullscreen-image.directive";
import {environment} from "../../../../environments/environment";
import {ValidateActionButtonDirective} from "../../directives/validate-action-button/validate-action-button.directive";
import {ModalReportInspectComponent} from "../modal-report-inspect/modal-report-inspect.component";
import {FieldsFormValues} from "../../../core/models/FieldsFormValues";

@Component({
  selector: 'app-data-table-custom',
  standalone: true,
  imports: [
    MatPaginator, MatTable, MatIcon, MatCell, MatColumnDef, MatHeaderCell, MatHeaderRow,
    MatRow, MatHeaderRowDef, MatCellDef, MatHeaderCellDef, MatRowDef,
    MatIconModule, MatButtonModule, MatFormField,
    NgForOf, NgIf, KeyValuePipe, RouterLink,
    NgSwitchCase, NgSwitch, NgSwitchDefault, NgOptimizedImage,
    FullscreenImageDirective, ValidateActionButtonDirective
  ],
  templateUrl: './data-table-custom.component.html',
  styleUrl: './data-table-custom.component.sass'
})
export class DataTableCustomComponent implements OnInit {
  initColumns = signal<ColumField[]>([])
  displayedColumns = signal<string[]>([])
  idField = signal<string>('')
  fieldsForm = signal<FieldsFormGroup[]>([])
  @Input() set fieldsForms(value: FieldsFormGroup[]) {
    this.fieldsForm.set(value)
  }
  @Input() set idFieldColum(value: string) {
    this.idField.set(value)
  }
  @Input() set columField(value: ColumField[]) {
    this.initColumns.set(value)
    this.displayedColumns.set(this.initColumns().map(col => col.name))
  }
  @Input() set requestInfo(value: RequestUrlScheme) {
    this.urlGet = value.urlGet
    this.urlGetAll = value.urlGetAll
    this.urlUpdate = value.urlUpdate
    this.urlDelete = value.urlDelete
    this.itemsPerPage = value.itemsPerPage
    this.isMultiPart = value.isMultiPart ?? false
    this.getData(this.pageNumber, this.itemsPerPage);
  }
  @Input() set viewReportStructures(value: FieldsFormValues[]) {
    this.viewReportStructure=value
  }

  viewReportStructure: FieldsFormValues[]=[]
  urlGet= ''
  urlGetAll= ''
  isMultiPart=false
  urlUpdate= ''
  urlDelete= ''
  postPerPage = 0
  pageNumber = 0
  totalItems= 0
  itemsPerPage = 5
  dataSource = [
  ];
  dialogUpdate?: MatDialogRef<ModalCreateItemComponent>
  hostAssets = environment.HOST_ASSETS_BACKEND

  constructor(
    readonly service: CrudService,
    readonly dialog: MatDialog,
    readonly spinner: NgxSpinnerService,
  ) {
    this.spinner.show('get').then()
  }

  onPaginate(pageEvent: PageEvent) {
    this.itemsPerPage=pageEvent.pageSize;
    this.postPerPage = + pageEvent.pageSize;
    this.pageNumber = +pageEvent.pageIndex + 1;
    this.getData(this.pageNumber, this.itemsPerPage);
  }

  ngOnInit(): void {
  }

  getData(page: Number, limit: number) {
    this.spinner.show('get').then()
    const urlGet = this.urlGetAll.replace("${page}", String(page)).replace("${limit}", String(limit));
    this.service.get(urlGet).subscribe((response: any) => {
      this.totalItems = response.data.length;
      this.dataSource = response.data;
      this.spinner.hide('get').then()
    }, (error: HttpErrorResponse) => {
      this.spinner.hide('get').then()
    });
  }

  updateModal(id: string) {
    this.spinner.show('get').then()
    this.service.get(`${this.urlGet}/${id}`).subscribe((data: any) => {
      const fieldsValue: FieldsOptions[] = []
      Object.keys(data?.data).forEach((key:string)=>{
        fieldsValue.push({label:key,'value':data?.data[key]});
      });
      this.dialogUpdate = this.dialog.open(ModalCreateItemComponent, {
        width: '90%',
        data: {fieldsForm: this.fieldsForm(), fieldsValue}
      })
      this.spinner.hide('get').then()
      this.dialogUpdate.afterClosed().subscribe((result: FormGroup) => {
        if (result) {
          this.spinner.show('update').then()
          this.service.patch(`${this.urlUpdate}/${id}`, result.value, this.isMultiPart).subscribe((data: any) => {
            this.spinner.hide('update').then()
            this.getData(this.pageNumber, this.itemsPerPage);
          }, (error: HttpErrorResponse) => {
            this.spinner.hide('update').then()
          })
        }
      })
    }, (error: HttpErrorResponse) => {
      this.spinner.hide('get').then()
    });
  }

  delete(id: string|null = null) {
    if (id) {
      this.spinner.show('delete').then()
      this.service.delete(`${this.urlDelete}/${id}`).subscribe((data: any) => {
        this.spinner.hide('delete').then()
        this.getData(this.pageNumber, this.itemsPerPage);
      }, (error: HttpErrorResponse) => {
        this.spinner.hide('delete').then()
      })
    }
  }

  detail=async (id: string) => {
    await this.spinner.show('get').then()
    this.service.get(`${this.urlGet}/${id}`).subscribe((response: any) => {
      this.dialog.open(ModalReportInspectComponent, {
        height: "calc(100% - 30px)",
        width: '90%',
        maxWidth: "100%",
        maxHeight: "100%",
        data: {fields: this.viewReportStructure, fieldsValue: response.data}
      })
      this.spinner.hide('get').then()
    }, (error: HttpErrorResponse) => {
      this.spinner.hide('get').then();
    });
  }

  typeOf(value: any) {
    return typeof value;
  }

  getRouterLink(linkUrl: string, element: any, linkParams?: string[]): string {
    let link = '/'+linkUrl;
    linkParams?.forEach((param: string) => {
      link += `/${element[param]}`;
    });
    return link;
  }
}
