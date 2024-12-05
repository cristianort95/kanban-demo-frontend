import { Component, Input, OnInit } from '@angular/core';
import { EditorState, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { setBlockType } from 'prosemirror-commands';
import { CommonModule } from '@angular/common';

import { Editor } from 'ngx-editor';
import { isNodeActive } from 'ngx-editor/helpers';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-custom-menu',
  standalone: true,
  imports: [CommonModule, MatButton, MatIcon, MatIconButton],
  template: `
  <div class="NgxEditor__Seperator"></div>
  <div class="NgxEditor__MenuItem NgxEditor__MenuItem--Text" (mousedown)="onClick($event)"
    [ngClass]="{'NgxEditor__MenuItem--Active': isActive, 'NgxEditor--Disabled': isDisabled}">
    CodeMirror
  </div>
  <button color="primary" mat-icon-button aria-label="Example icon button with a vertical three dot icon" ><mat-icon>delete_forever</mat-icon></button>
  `,
  styles: [`
    :host
      display: flex
  `],
})
export class CustomMenuComponent implements OnInit {
  constructor() {}

  @Input() editor!: Editor;
  isActive = false;
  isDisabled = false;

  onClick(e: MouseEvent): void {
    e.preventDefault();
    const { state, dispatch } = this.editor.view;
    this.execute(state, dispatch);
  }

  execute(state: EditorState, dispatch?: (tr: Transaction) => void): boolean {
    const schema: any = state.schema;

    if (this.isActive) {
      return setBlockType(schema.nodes.paragraph)(state, dispatch);
    }

    return setBlockType(schema.nodes.code_mirror)(state, dispatch);
  }

  update = (view: EditorView) => {
    const state: any = view.state;
    const { schema } = state;
    this.isActive = isNodeActive(state, schema.nodes.code_mirror);
    this.isDisabled = !this.execute(state, undefined); // returns true if executable
  };

  ngOnInit(): void {
    this.editor.update.subscribe((view: EditorView) => this.update(view));
  }
}
