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
import {TASK} from "../../core/endpoints";
import {HttpErrorResponse} from "@angular/common/http";
import {AuthServiceService} from "../../core/services/AuthService";
import {NgxSpinnerService} from "ngx-spinner";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {CrudService} from "../../core/services/CrudService";
import {NgIf} from "@angular/common";


@Component({
  selector: 'app-comment',
  imports: [NgxEditorModule, FormsModule, CustomMenuComponent, ReactiveFormsModule, NgIf],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.sass'
})
export class CommentComponent implements OnDestroy {
  @Input() set itemValue(value: FieldsComments | undefined) {
    this.item.set(value)
    if (value && value.id) {
      this.form.controls.editorContent.setValue(value!.comment)
      this.form.controls['editorContent'].disable();
    }
  }
  @Input() set urlRequest(value: string) { this.url.set(value)}
  @Input() set disabledC(val: boolean) {this.disabledComponent.set(val)}
  disabledComponent = signal<boolean>(false)

  item = signal<FieldsComments | undefined>(undefined)
  url = signal<string>("")
  form = new FormGroup({
    editorContent: new FormControl('', [Validators.required]),
  });
  editor: Editor;
  toolbar: Toolbar = TOOLBAR_MINIMAL;
  disabled = false;

  constructor(
    readonly service: CrudService,
    readonly spinner: NgxSpinnerService,
    readonly toastr: ToastrService,
  ) {
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

  onDisable(status: boolean): void {
    this.disabled = status;
  }
  onUpdate(id: number): void {
    console.log("id", id)
  }
  async onCreate(status: boolean) {
    if (this.form.get("editorContent")!.value) {
      this.spinner.show("create").then()
      this.service.post(`${this.url()}`, {comment:  this.form.get("editorContent")!.value}).subscribe((response: any) => {
        this.spinner.hide("create").then()
        this.toastr.success("Tarea Agregada");
        window.location.reload()
      }, (error: HttpErrorResponse) => {
        this.spinner.hide("create").then()
      })
    }
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }
}
