import {Component, ViewChild} from '@angular/core';
import {CardComponent} from "../../shared/components/card/card.component";
import {DataTableCustomComponent} from "../../shared/components/data-table-custom/data-table-custom.component";
import {MatButton} from "@angular/material/button";
import {PROJECT} from "../../core/endpoints";
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

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CdkDropList, CdkDrag, CardComponent, MatButton, CdkDragPlaceholder
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.sass'
})
export class ProjectsComponent {
  @ViewChild(DataTableCustomComponent) childDataTable!: DataTableCustomComponent
  constructor(
    readonly toastr: ToastrService,
    readonly service: CrudService,
    readonly spinner: NgxSpinnerService,
    readonly route: ActivatedRoute,
    readonly router: Router
  ) {}

  todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];

  qa = ['one', 'two'];

  done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

  drop(event: CdkDragDrop<string[]>) {
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
      console.log("DATA", event.container);
    }
  }

  removeProject() {
    const id = this.route.snapshot.paramMap.get('projectId');
    this.spinner.show("deleteProject").then()
    this.service.delete(`${PROJECT}/${id}`).subscribe((response: any) => {

      this.spinner.hide('deleteProject').then()
      this.toastr.success("Proyecto Eliminado!");
      this.router.navigate(['/']).then();
    }, (error: HttpErrorResponse) => {
      this.toastr.error("Error intente de nuevo o revise los datos relacionados al proyecto!");
      this.spinner.hide('deleteProject').then()
    });
  }
}
