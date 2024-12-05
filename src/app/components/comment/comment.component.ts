import {Component, Input, OnDestroy, OnInit, signal} from '@angular/core';
import {Editor, marks, NgxEditorModule, nodes as basicNodes, Toolbar, TOOLBAR_MINIMAL} from "ngx-editor";
import {AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {FieldsComments, FieldsFormGroup, FieldsOptions} from "../../core/models/FieldsFormGroup";
import { CodeMirrorView, node as codeMirrorNode } from 'prosemirror-codemirror-6';
import { minimalSetup } from 'codemirror';
import { EditorView } from 'prosemirror-view';
import { javascript } from '@codemirror/lang-javascript';
import { Schema, Node as ProseMirrorNode } from 'prosemirror-model';
import {CustomMenuComponent} from "./custom-menu";


@Component({
  selector: 'app-comment',
  imports: [NgxEditorModule, FormsModule, CustomMenuComponent, ReactiveFormsModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.sass'
})
export class CommentComponent implements OnDestroy {
  @Input() set itemValue(value: FieldsComments | undefined) {
    this.item.set(value)

  }
  @Input() set urlRequest(value: string) { this.url.set(value)}
  item = signal<FieldsComments | undefined>(undefined)
  url = signal<string>("")
  editor: Editor;
  toolbar: Toolbar = TOOLBAR_MINIMAL;
  form = new FormGroup({
    editorContent: new FormControl('', [Validators.required]),
  });

  constructor() {
    const nodes = {...basicNodes, code_mirror: codeMirrorNode,};
    const schema = new Schema({nodes, marks,});

    this.editor = new Editor({
      schema,
      nodeViews: {
        code_mirror: (
          node: ProseMirrorNode,
          view: EditorView,
          getPos: () => number | undefined,
        ) => {
          return new CodeMirrorView({
            node,
            view,
            getPos,
            cmOptions: {
              extensions: [minimalSetup, javascript()],
            },
          });
        },
      },
    });
  }

  get doc(): AbstractControl {
    return this.form.get("editorContent") as AbstractControl;
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }
}
