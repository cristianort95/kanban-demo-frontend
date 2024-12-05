import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  input,
  OnInit,
  Output,
  signal,
  ViewChild
} from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormBuilder, FormControl, FormGroup, NgForm, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault} from "@angular/common";
import {FieldsFormGroup, FieldsOptions} from "../../../core/models/FieldsFormGroup";
import {CrudService} from "../../../core/services/CrudService";
import {lastValueFrom} from "rxjs";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatChip} from "@angular/material/chips";
import {InputsComponent} from "../inputs/inputs.component";

@Component({
    selector: 'app-form',
    imports: [MatFormFieldModule, MatInputModule, MatSelectModule, ReactiveFormsModule, NgForOf, NgSwitch, NgSwitchCase, InputsComponent, NgSwitchDefault],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './form.component.html',
    styleUrl: './form.component.sass'
})
export class FormComponent implements OnInit {
  @Input() set fieldsDataValue(value: FieldsOptions[]) {this.fieldsValue.set(value ?? []);}
  @Input() set fieldsData(value: FieldsFormGroup[]) { this.loadDataOptions(value).then()}
  @Output() onSubmitParent = new EventEmitter<FormGroup>();
  fields= signal<FieldsFormGroup[]>([])
  fieldsValue= signal<FieldsOptions[]>([])
  form: FormGroup

  constructor(
    readonly formBuilder: FormBuilder,
    readonly crud: CrudService
  ) {
    this.form = this.formBuilder.group({})
  }

  async loadDataOptions(d: FieldsFormGroup[]): Promise<void> {
    const fieldsOptions: FieldsFormGroup[] = []
    for (let i = 0; i < d.length; i++) {
      const optionsChildUrl = d[i].optionsChildUrl
      if (optionsChildUrl) {

        const result$: any = this.crud.get(optionsChildUrl.url);
        const result: any = await lastValueFrom(result$);
        if (result.data) {
          const optionsChild: FieldsOptions[] = result.data.map((data: any) => {
            let label = ""
            optionsChildUrl.keysOfValue.forEach((keys: any) => {
              label += (data[keys] + " -")
            })
            return { value: data[optionsChildUrl.idField ?? "id"], label: label }
          });
          fieldsOptions.push({...d[i], optionsChild})
        } else fieldsOptions.push(d[i])
      } else fieldsOptions.push(d[i])
    }

    this.fields.set(fieldsOptions)
    this.initForm()
  }

  ngOnInit(): void {
    //this.initForm()
  }

  initForm() {
    this.fields().forEach((field) => {
      if (field.type == "formGroup" && field.optionsFormGroup) {
        const formGroup = this.formBuilder.group({});
        field.optionsFormGroup.forEach(option => {
          formGroup.addControl(option.name, new FormControl('', option.validator || []));
        });
        this.form.addControl(field.name, formGroup);
      } else this.form.addControl(field.name, new FormControl('', field.validator))
    })
    this.fieldsValue().forEach((field) => {
      try {
        this.form.controls[String(field.label)].setValue(field.value)
      } catch (e) {}
    })
  }

  onSubmit() {
    this.onSubmitParent.emit(this.form)
  }

  onFileSelected(id: string, event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.form.get(id)?.setValue(file);
    }
  }

  handleKeyUp(data: { event: any, fieldName: string }): void {
    const target = data.event.target as HTMLInputElement;
    if (target) {
      const newTipo = target.value.trim();
      if (newTipo) {
        this.addCustomTypeCafe(data.fieldName, newTipo);
        target.value = '';
      }
    }
  }

  addCustomTypeCafe(fieldName: string, newTipo: string): void {
    if (newTipo) {
      const field = this.fields().find(f => f.name === fieldName);

      if (field && !field.optionsChild?.some(option => option.value === newTipo)) {
        field.optionsChild?.push({ value: newTipo, label: newTipo });
        const selectedValues = this.form.get(fieldName)?.value || [];
        this.form.get(fieldName)?.setValue([...selectedValues, newTipo]);
      }
    }
  }

  getFormGroup(name: string): FormGroup {
    return this.form.get(name) as FormGroup;
  }
}
