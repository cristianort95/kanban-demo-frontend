import {Component} from '@angular/core';
import {CardComponent} from "../../shared/components/card/card.component";
import {MatButton, MatIconButton} from "@angular/material/button";
import {PROJECT, TASK} from "../../core/endpoints";
import {CrudService} from "../../core/services/CrudService";
import {NgxSpinnerService} from "ngx-spinner";
import {HttpErrorResponse} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Router} from "@angular/router";
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
import {FieldsFormGroup} from "../../core/models/FieldsFormGroup";
import { Task } from '../../core/models/Task';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CdkDropList, CdkDrag, CardComponent, MatButton, CdkDragPlaceholder, MatIcon, MatIconButton
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.sass'
})
export class ProjectsComponent {
  dialogUpdate?: MatDialogRef<ModalCreateItemComponent>
  constructor(
    readonly toastr: ToastrService,
    readonly service: CrudService,
    readonly spinner: NgxSpinnerService,
    readonly route: ActivatedRoute,
    readonly router: Router,
    readonly dialog: MatDialog,
  ) {}
  id = this.route.snapshot.paramMap.get('projectId');
  fields: FieldsFormGroup[] = [
    {name: "name", label: "Nombre", type: "input", validator: [Validators.required]},
    {name: "description", label: "Descripcion", type: "input", validator: [Validators.required]},
    {name: "status", label: "Estatus", type: "select", validator: [Validators.required], optionsChild: [
        {label: "Por hacer", value: "toDo"},
        {label: "En Progreso", value: "inProgress"},
        {label: "Finalizada", value: "done"}
      ]},
  ]

  toDo: Task[] = [];
  inProgress: Task[] = [];
  done : Task[] = [];

  ngOnInit(): void {
    this.getTasks().then()
  }

  async getTasks() {
    this.spinner.show("getProject").then()
    this.service.get(`${TASK}/${this.id}?limit=200&page=1&relations=project&project=name,description`).subscribe((response: any) => {
      const data = response.data.forEach((item: Task) => {
        if (item.status == "toDo") {
          this.toDo.push(item)
        } else if (item.status == "inProgress") {
          this.inProgress.push(item)
        } else if (item.status == "done") {
          this.done.push(item)
        }
      })
      this.spinner.hide('getProject').then()
    }, (error: HttpErrorResponse) => {
      this.spinner.hide('getProject').then()
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
      console.log("DATA", event.container.data[event.currentIndex]);
      console.log("DATA", event.container.id);
      this.statusTask(
        event.container.data[event.currentIndex].id,
        event.container.id
      ).then()
    }
  }

  removeProject() {
    this.spinner.show("deleteProject").then()
    this.service.delete(`${PROJECT}/${this.id}`).subscribe((response: any) => {

      this.spinner.hide('deleteProject').then()
      this.toastr.success("Proyecto Eliminado!");
      this.router.navigate(['/']).then();
    }, (error: HttpErrorResponse) => {
      this.toastr.error("Error intente de nuevo o revise los datos relacionados al proyecto!");
      this.spinner.hide('deleteProject').then()
    });
  }

  addTask() {
    this.dialogUpdate = this.dialog.open(ModalCreateItemComponent, {
      width: '90%',
      data: this.fields
    })
    this.dialogUpdate.afterClosed().subscribe((result: FormGroup) => {
      if (result) {
        this.spinner.show("create")
        this.service.post(`${TASK}/${this.id}`, result.value).subscribe((response: any) => {
          this.spinner.hide("create")
          this.getTasks().then()
          this.toastr.success("Tarea Agregada");
        }, (error: HttpErrorResponse) => {
          this.spinner.hide("create")
        })
      }
    })
  }

  async statusTask(task: number, status: string) {
    this.spinner.show("update").then()
    this.service.patch(`${TASK}/${this.id}/${task}`, {status}).subscribe((response: any) => {
      this.spinner.hide("update").then()
      this.toastr.success("Tarea Actualizada");
    }, (error: HttpErrorResponse) => {
      this.toastr.success("Error");
      this.spinner.hide("update").then()
    })
  }

  addTeam() {

  }
}
