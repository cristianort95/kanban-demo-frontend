import {Component, computed, signal} from '@angular/core';
import {CustomSidenavComponent} from "../../shared/components/custom-sidenav/custom-sidenav.component";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatToolbar} from "@angular/material/toolbar";
import {RouterOutlet} from "@angular/router";
import {AuthServiceService} from "../../core/services/AuthService";

@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [RouterOutlet, MatToolbar, MatIcon, MatSidenavModule, MatIconButton, CustomSidenavComponent],
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.sass'
})
export class MainMenuComponent {
  constructor(readonly authService: AuthServiceService) {}
  collapsed = signal(false)
  sidenavWidth = computed(() => this.collapsed() ? '65px' : '225px')

  closedSession = () => {
    this.authService.logout()
  }
}
