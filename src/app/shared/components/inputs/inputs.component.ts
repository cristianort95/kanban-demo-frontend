import {Component, EventEmitter, Input, Output, signal} from '@angular/core';
import {MatCheckbox} from "@angular/material/checkbox";
import {MatFormField, MatFormFieldModule, MatHint, MatLabel} from "@angular/material/form-field";
import {MatInput, MatInputModule} from "@angular/material/input";
import {DateAdapter, MatOption, provideNativeDateAdapter} from "@angular/material/core";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {MatSelect} from "@angular/material/select";
import {NgForOf, NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {FieldsFormGroup, FieldsOptions} from "../../../core/models/FieldsFormGroup";
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from "@angular/material/datepicker";

@Component({
    selector: 'app-inputs',
  imports: [
    MatCheckbox,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatRadioButton,
    MatRadioGroup,
    MatSelect,
    NgForOf,
    NgSwitchCase,
    ReactiveFormsModule,
    NgSwitch,
    NgIf,
    MatFormFieldModule, MatInputModule, MatDatepickerModule
  ],
    templateUrl: './inputs.component.html',
    styleUrl: './inputs.component.sass',
  providers: [provideNativeDateAdapter()],
})
export class InputsComponent {
  @Input() i!: number;
  @Input() form!: FormGroup;
  @Input() set fieldData(value: FieldsFormGroup) {
    if (value.type === "date") {
      console.log("date", value)
    }
    this.field.set(value)
  }
  field= signal<FieldsFormGroup>({ label: '', name: '', type: 'input', validator: [Validators.required] })

  @Output() handleKeyUpNextField = new EventEmitter<{ event: any, fieldName: string }>();

  handleKeyUp(event: any, fieldName: string): void {
    this.handleKeyUpNextField.emit({
      event, fieldName
    })
  }
}
