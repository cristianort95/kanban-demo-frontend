import { Component } from '@angular/core';
import {MatCard, MatCardContent} from "@angular/material/card";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    RouterOutlet
  ],
  template: `
    <mat-card appearance="outlined">
      <mat-card-content>
        <ng-content></ng-content>
      </mat-card-content>
    </mat-card>
  `,
  styles: `
    mat-card
      box-sizing: border-box
      overflow: hidden
      min-height: calc(100vh - (64px + 50px))
      max-height: calc(100vh - (64px + 50px))
    mat-card-content
      display: flex
      overflow-y: auto
      flex-direction: column
      max-height: 100vh
      min-height: 0

  `
})
export class CardComponent {

}
