import {Component, EventEmitter, Input, OnInit, Output, signal} from '@angular/core';
import { EditorState, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { setBlockType } from 'prosemirror-commands';
import { CommonModule } from '@angular/common';

import { Editor } from 'ngx-editor';
import { isNodeActive } from 'ngx-editor/helpers';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {FormGroup} from "@angular/forms";
import {FieldsComments} from "../../core/models/FieldsFormGroup";

@Component({
  selector: 'app-custom-menu',
  standalone: true,
  imports: [CommonModule, MatIcon, MatIconButton],
  template: `
    <div class="NgxEditor__Seperator"></div>
    <div
      class="NgxEditor__MenuItem NgxEditor__MenuItem--Text"
      (mousedown)="onClick($event)"
      [ngClass]="{'NgxEditor__MenuItem--Active': isActive, 'NgxEditor--Disabled': isDisabled}"
    >
      CodeMirror
    </div>

    <div *ngIf="item()" class="NgxEditor__Seperator"></div>
    <button *ngIf="item()" color="primary" mat-icon-button aria-label="Delete" (click)="updateItem(item()!.id)" ><mat-icon>save</mat-icon></button>

    <div *ngIf="!item()" class="NgxEditor__Seperator"></div>
    <button *ngIf="!item()" color="primary" mat-icon-button aria-label="Delete" (click)="createItem()" ><mat-icon>save</mat-icon></button>
  `,
  styles: [`
    :host
      display: flex
  `],
})
export class CustomMenuComponent implements OnInit {
  constructor() {}
  @Input() editor!: Editor;
  @Output() onButtonDisable = new EventEmitter<boolean>();
  @Output() onUpdate = new EventEmitter<number>();
  @Output() onCreate = new EventEmitter<boolean>();
  @Input() isButtonDisable: boolean = false;
  @Input() set itemValue(value: FieldsComments | undefined) {this.item.set(value)}
  item = signal<FieldsComments | undefined>(undefined)
  isActive = false;
  isDisabled = false;

  onClick(e: MouseEvent): void {
    e.preventDefault();
    const { state, dispatch } = this.editor.view;
    this.execute(state, dispatch);
    this.editor.view.editable = false
  }

  createItem() {
    this.onCreate.emit(true);
  }

  updateItem(id: number) {
    this.onUpdate.emit(id);
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
