import {Component, computed, Input, OnInit, signal} from '@angular/core';
import {MatListItem, MatListItemIcon, MatListItemTitle, MatNavList} from "@angular/material/list";
import {NgForOf, NgIf} from "@angular/common";
import {MatIcon, MatIconRegistry} from "@angular/material/icon";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {AuthServiceService} from "../../../core/services/AuthService";
import {validateRules} from "../../../core/guards/auth.guard";
import {jwtDecode} from "jwt-decode";

export type MenuItem = {
  icon: string;
  label: string;
  route?: string;
}

@Component({
  selector: 'app-custom-sidenav',
  standalone: true,
  imports: [
    MatNavList,
    MatListItem,
    NgForOf,
    MatIcon,
    MatListItemTitle,
    MatListItemIcon,
    NgIf,
    RouterLink,
    RouterLinkActive
  ],
  template: `
    <div class="sidenav-container">
      <div>
        <div class="sidenav-header">
          <img [width]="profilePicSize()" [height]="profilePicSize()" src="images/logo.png"  alt="icon"/>
          <div class="header-text" [class.hide-header-text]="sideNavCollapsed()">
            <h2>{{ name }}</h2>
            <p>{{ lastName }}</p>
          </div>
        </div>
        <mat-nav-list [class.hide-sidenav]="sideNavCollapsed()">
          <a
            mat-list-item
            *ngFor="let item of menuItems()"
            [routerLink]="item.route"
            routerLinkActive
            #rla="routerLinkActive"
            [activated]="rla.isActive"
          >
            <mat-icon
              class="menu-items"
              [fontSet]="
            rla.isActive ? 'material-icons' : 'material-icons-outlined'
            "
              [class.selected-menu-item]="rla.isActive"
              matListItemIcon
            >{{item.icon}}</mat-icon>
            <span matListItemTitle *ngIf="!sideNavCollapsed()" >
                {{item.label}}
            </span>
          </a>
        </mat-nav-list>
      </div>

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
export class CustomSidenavComponent {
  name = ''
  lastName = ''

  constructor(readonly authService: AuthServiceService) {
    const isAuthenticated = localStorage.getItem('authToken');
    if (isAuthenticated) {
      const decoded: any = jwtDecode(isAuthenticated);
      this.name = decoded.name
      this.lastName = decoded.lastName
    }
  }

  sideNavCollapsed = signal(false)
  @Input() set collapsed(value: boolean) {
    this.sideNavCollapsed.set(value)
  }
  menuItems = signal<MenuItem[]>([
    {
      icon: 'account_balance',
      label: 'Asociaciones',
      route: 'association',
    },
    {
      icon: 'manage_accounts',
      label: 'Users',
      route: 'users',
    },
    {
      icon: 'contact_mail',
      label: 'Socios',
      route: 'partners',
    },
    {
      icon: 'forest',
      label: 'Parcelas',
      route: 'plots',
    }
  ])
  profilePicSize = computed(()=>this.sideNavCollapsed() ? '50' : '100')

  closedSession = () => {
    this.authService.logout()
  }
}
