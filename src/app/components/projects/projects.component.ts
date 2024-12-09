import {AfterViewInit, Component, OnInit} from '@angular/core';
import {CardComponent} from "../../shared/components/card/card.component";
import {MatButton, MatIconButton} from "@angular/material/button";
import {COMMENTS, PROJECT, TASK, TEAMS} from "../../core/endpoints";
import {CrudService} from "../../core/services/CrudService";
import {NgxSpinnerService} from "ngx-spinner";
import {HttpErrorResponse} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragPlaceholder,
  CdkDropList,
  moveItemInArray,
  transferArrayItem
} from "@angular/cdk/drag-drop";
import {MatIcon} from "@angular/material/icon";
import {ModalCreateItemComponent} from "../../shared/components/modal-create-item/modal-create-item.component";
import {FormGroup, Validators} from "@angular/forms";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FieldsComments, FieldsFormGroup, FieldsOptions} from "../../core/models/FieldsFormGroup";
import { Task } from '../../core/models/Task';
import {NgIf} from "@angular/common";
import {ErrorHttpCustom} from "../../core/models/ErrorHttpCustom";
import {ModalCardComponent} from "../../shared/components/modal-car/modal-card.component";
import {map} from "rxjs";
import {RequestUrlScheme} from "../../core/models/RequestUrlScheme";

@Component({
  selector: 'app-users',
  imports: [
    CdkDropList, CdkDrag, CardComponent, MatButton, CdkDragPlaceholder, MatIcon, NgIf, RouterLink
  ],
  templateUrl: './projects.component.html',
  standalone: true,
  styleUrl: './projects.component.sass'
})
export class ProjectsComponent implements OnInit {
  dialogUpdate?: MatDialogRef<ModalCreateItemComponent>
  constructor(
    readonly toastr: ToastrService,
    readonly service: CrudService,
    readonly spinner: NgxSpinnerService,
    readonly route: ActivatedRoute,
    readonly router: Router,
    readonly dialog: MatDialog,
  ) {}
  projectId = this.route.snapshot.paramMap.get('projectId');
  roleId = this.route.snapshot.paramMap.get('roleId');
  fields: FieldsFormGroup[] = [
    {name: "name", label: "Nombre", type: "input", validator: [Validators.required]},
    {name: "description", label: "Descripcion", type: "input", validator: [Validators.required]},
    {name: "endDate", label: "Fecha de vencimiento", type: "date", validator: [Validators.required]},
    {name: "status", label: "Estatus", type: "select", validator: [Validators.required], optionsChild: [
        {label: "Por hacer", value: "toDo"},
        {label: "En Progreso", value: "inProgress"},
        {label: "Finalizada", value: "done"}
      ]
    },
    {name: "userId", label: "Usuario", type: "select", validator: [Validators.required], optionsChildUrl: {
      url: TEAMS+"/"+this.projectId, keysOfValue: ["userId", "role"], idField: "userId"
    }}
  ]

  request: RequestUrlScheme = {
    urlGet: COMMENTS+"/"+this.projectId,
    urlGetAll: COMMENTS+"/"+this.projectId,
    urlUpdate: COMMENTS+"/"+this.projectId,
    urlDelete: COMMENTS+"/"+this.projectId,
    itemsPerPage: 20,
  }

  toDo: Task[] = [];
  inProgress: Task[] = [];
  done : Task[] = [];

  dateToday = new Date();

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
        this.projectId = params.projectId;
        this.roleId = params.roleId;
        this.getTasks().then()
    });
  }

  async getTasks() {
    this.toDo = []
    this.inProgress = []
    this.done = []
    this.spinner.show("get").then()
    return this.service.get(`${TASK}/${this.projectId}?limit=200&page=1&relations=project&project=name,description`).subscribe((response: any) => {
      const data = response.data.forEach((item: Task) => {
        if (item.status == "toDo") {
          this.toDo.push(item)
        } else if (item.status == "inProgress") {
          this.inProgress.push(item)
        } else if (item.status == "done") {
          this.done.push(item)
        }
      })
      this.spinner.hide('get').then()
    }, (error: HttpErrorResponse) => {
      this.spinner.hide('get').then()
    });
  }

  drop(event: CdkDragDrop<any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      this.statusTask(
        event.container.data[event.currentIndex].id,
        event.container.id
      ).then()
    }
  }

  removeProject() {
    this.delete(PROJECT, String(this.roleId)).then()
  }

  addTask() {
    this.dialogUpdate = this.dialog.open(ModalCreateItemComponent, {
      width: '90%',
      data: this.fields
    })
    this.dialogUpdate.afterClosed().subscribe((result: FormGroup) => {
      if (result) {
        this.spinner.show("create").then()
        this.service.post(`${TASK}/${this.projectId}`, result.value).subscribe((response: any) => {
          this.spinner.hide("create").then()
          this.getTasks().then()
          this.toastr.success("Tarea Agregada");
        }, (error: HttpErrorResponse) => {
          this.spinner.hide("create").then()
        })
      }
    })
  }

  async statusTask(task: number, status: string) {
    await this.spinner.show("update")
    return this.service.patch(`${TASK}/${this.projectId}/${task}`, {status}).subscribe((response: any) => {
      this.toastr.success("Tarea Actualizada");
    }, (error: HttpErrorResponse) => {
      this.toastr.success("Error");
    }, () => {
      this.spinner.hide("update").then()
    })
  }

  async detail(id: number) {
    await this.spinner.show('create')
    this.service.get(`${TASK}/${this.projectId}/${id}`).subscribe((data: any) => {
      const fieldsValue: FieldsOptions[] = []
      const fieldsComments: FieldsComments[] = []
      Object.keys(data?.data).forEach((key:string)=>{
        if (key=="comment") {
          data?.data[key].forEach((item:any)=>{
            fieldsComments.push(item)
          })
        }
        fieldsValue.push({label:key,'value':data?.data[key]});
      });
      this.dialogUpdate = this.dialog.open(ModalCardComponent, {
        width: '90%',
        data: {
          fieldsForm: this.fields,
          fieldsValue, fieldsComments,
          urlDelete: `${TASK}/${this.projectId}/${id}`,
          urlComment: this.request,
          id
        }
      })
      this.dialogUpdate.afterClosed().subscribe((result: { form?: FormGroup, delete?: boolean }) => {
        if (result?.form) {
          this.spinner.show('update').then()
          this.service.patch(`${TASK}/${this.projectId}/${id}`, result.form.value).subscribe((data: any) => {
            this.getTasks().then()
            this.toastr.success("Tarea Actualizado!");
          }, (error: ErrorHttpCustom) => {
            this.toastr.error("Error!");
          }, ()=> {this.delay(500).then(() => {this.spinner.hide('update').then()})})
        } else if (result?.delete) {
          this.spinner.show("job-delete").then()
          this.delete(`${TASK}/${this.projectId}`, data?.data.id, false).then(() => {
            this.delay(500).then(() => {this.getTasks().then()})
          }).finally(() => this.delay(500).then(() => {this.spinner.hide("job-delete").then()}))
        }
      })
    }, (error: HttpErrorResponse) => {
    }, () => {this.spinner.hide('create').then()});
  }

  async delete(url: string, id: string, isProject: boolean = true) {
    return this.service.delete(`${url}/${id}`).subscribe((response: any) => {
      this.toastr.success("Proyecto Eliminado!");
      isProject ? this.router.navigate(['/']).then(() => window.location.reload()) : () => {};
    }, (error: HttpErrorResponse) => {
      this.toastr.error("Error intente de nuevo o revise los datos relacionados al proyecto!");
    });
  }

  async delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  validDate(date?: string) {
    if (date) {
      const d = new Date(date);
      if (d.getTime() < this.dateToday.getTime())
        return true
    }
    return false
  }
}
