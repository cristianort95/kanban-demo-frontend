import {Component, computed, Input, OnInit, signal} from '@angular/core';
import {
  MatListItem,
  MatListItemAvatar,
  MatListItemIcon,
  MatListItemLine, MatListItemMeta,
  MatListItemTitle,
  MatNavList
} from "@angular/material/list";
import {NgForOf, NgIf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {AuthServiceService} from "../../../core/services/AuthService";
import {jwtDecode} from "jwt-decode";
import {CrudService} from "../../../core/services/CrudService";
import {HttpErrorResponse} from "@angular/common/http";
import {NgxSpinnerService} from "ngx-spinner";
import {PROJECT} from "../../../core/endpoints";
import {ToastrService} from "ngx-toastr";
import {ModalCreateItemComponent} from "../modal-create-item/modal-create-item.component";
import {FormGroup, Validators} from "@angular/forms";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FieldsFormGroup} from "../../../core/models/FieldsFormGroup";

export type MenuItem = {
  icon: string;
  label: string;
  route: string;
  id: number;
}

@Component({
    selector: 'app-custom-sidenav',
    imports: [
        MatNavList,
        MatListItem,
        NgForOf,
        MatIcon,
        MatListItemTitle,
        MatListItemIcon,
        NgIf,
        RouterLink,
        RouterLinkActive,
    ],
    template: `
    <div class="sidenav-container">
      <div class="sidenav-header">
        <img [width]="profilePicSize()" [height]="profilePicSize()" src="images/logo.png"  alt="icon"/>
        <div class="header-text" [class.hide-header-text]="sideNavCollapsed()">
          <h2>{{ name }}</h2>
          <p>{{ lastName }}</p>
        </div>
      </div>
      <div class="sidenav-new-project" [class.hide-sidenav]="sideNavCollapsed()">
        <mat-nav-list [class.hide-sidenav]="sideNavCollapsed()">
          <a
            (click)="createModal()"
            mat-list-item
            routerLinkActive
            #rla="routerLinkActive"
            [activated]="rla.isActive"
          >
            <mat-icon
              class="menu-items"
              [fontSet]="rla.isActive ? 'material-icons' : 'material-icons-outlined'"
              [class.selected-menu-item]="rla.isActive"
              matListItemIcon
            >add</mat-icon>
            <span matListItemTitle *ngIf="!sideNavCollapsed()">Crear Proyecto</span>
          </a>
        </mat-nav-list>
      </div>
      <mat-nav-list class="sidenav-body" [class.hide-sidenav]="sideNavCollapsed()">
        <div *ngFor="let item of menuItems()">
          <a
            mat-list-item
            routerLinkActive
            #rla="routerLinkActive"
            [activated]="rla.isActive"
            [routerLink]="item.route"
          >
            <mat-icon
              class="menu-items"
              [fontSet]="rla.isActive ? 'material-icons' : 'material-icons-outlined'"
              [class.selected-menu-item]="rla.isActive"
              matListItemIcon
            >{{item.icon}}</mat-icon>
            <span matListItemTitle *ngIf="!sideNavCollapsed()">
                {{item.label}}
            </span>
          </a>
        </div>
      </mat-nav-list>

      <!-- Menú inferior -->
      <div class="bottom-menu">
        <mat-nav-list [class.hide-sidenav]="sideNavCollapsed()">
          <a
            (click)="closedSession()"
            mat-list-item
            routerLinkActive
            #rla="routerLinkActive"
            [activated]="rla.isActive"
          >
            <mat-icon
              class="menu-items"
              [fontSet]="rla.isActive ? 'material-icons' : 'material-icons-outlined'"
              [class.selected-menu-item]="rla.isActive"
              matListItemIcon
            >logout</mat-icon>
            <span matListItemTitle *ngIf="!sideNavCollapsed()">Cerrar session</span>
          </a>
        </mat-nav-list>
      </div>
    </div>

  `,
    styles: [
        `
    :host *
      transition: all 500ms ease-in-out

    .sidenav-container
      display: flex
      flex-direction: column
      height: 100%
      justify-content: space-between

    .sidenav-new-project
      text-align: center

    .sidenav-header
      padding-top: 24px
      text-align: center
      > img
        border-radius: 100%
        object-fit: cover
        margin-bottom: 10px

      .header-text
        height: 3rem
        > h2
          margin: 0
          font-size: 1rem
          line-height: 1.5rem

        > p
          margin-top: 0
          font-size: 0.8rem
  .hide-header-text
    transition: all 200ms ease-in-out!important
    opacity: 0
    height: 0!important
    overflow: hidden
  .sidenav-body
    height: 100%
    overflow-x: auto
    &::-webkit-scrollbar
      width: 5px
    &::-webkit-scrollbar-thumb
      background: gray
      border-radius: 50px
    &::-webkit-scrollbar-track
      background-color: black
      border-radius: 50px

  .hide-sidenav
    a
      width: 56px
      margin-left: 5px
      margin-right: 5px
    .menu-items
      border-left: 0px solid
    .selected-menu-item
      border-left: 4px solid

  .menu-items
    border-left: 4px solid
    border-color: rgb(0,0,0,0)
  .selected-menu-item
    border-color: var(--primary-color)
    `
    ]
})
export class CustomSidenavComponent implements OnInit {
  name = ''
  lastName = ''

  constructor(
    readonly authService: AuthServiceService,
    readonly service: CrudService,
    readonly spinner: NgxSpinnerService,
    readonly toastr: ToastrService,
    readonly dialog: MatDialog,
  ) {
    const isAuthenticated = localStorage.getItem('authToken');
    if (isAuthenticated) {
      const decoded: any = jwtDecode(isAuthenticated);
      this.name = decoded.name
      this.lastName = decoded.lastName
    }
  }

  dialogUpdate?: MatDialogRef<ModalCreateItemComponent>
  sideNavCollapsed = signal(false)
  @Input() set collapsed(value: boolean) {
    this.sideNavCollapsed.set(value)
  }
  menuItems = signal<MenuItem[]>([])
  profilePicSize = computed(()=>this.sideNavCollapsed() ? '50' : '100')
  fields: FieldsFormGroup[] = [
    {name: "name", label: "Nombre", type: "input", validator: [Validators.required]},
    {name: "description", label: "Descripcion", type: "input", validator: [Validators.required]},
  ]

  closedSession = () => {
    this.authService.logout()
  }

  ngOnInit(): void {
    this.getProjects().then()
  }

  async getProjects() {
    this.spinner.show("get").then()
    this.service.get(PROJECT+"?limit=200&page=1&relations=project&project=name,description").subscribe((response: any) => {
      const data = response.data.map((item: any) => {
        return {
          icon:"work",
          label:item.project.name,
          route: item.role === "admin" ? `project/${item.projectId}/${item.id}` : "project/"+item.projectId,
          id:item.projectId,
        }
      })
      this.menuItems.set(data)
      this.spinner.hide('get').then()
    }, (error: HttpErrorResponse) => {
      this.spinner.hide('get').then()
    });
  }

  async createModal() {
    this.dialogUpdate = this.dialog.open(ModalCreateItemComponent, {
      width: '90%',
      data: this.fields
    })
    this.dialogUpdate.afterClosed().subscribe((result: FormGroup) => {
      if (result) {
        this.spinner.show("create").then()
        this.service.post(PROJECT, result.value).subscribe((response: any) => {
          this.spinner.hide("create").then()
          this.getProjects().then()
          this.toastr.success("Proyecto Creado!");
        }, (error: HttpErrorResponse) => {
          this.spinner.hide("create").then()
        })
      }
    })
  }
}
