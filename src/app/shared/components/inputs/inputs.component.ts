import {Component, EventEmitter, Input, Output, signal} from '@angular/core';
import {MatCheckbox} from "@angular/material/checkbox";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/core";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {MatSelect} from "@angular/material/select";
import {NgForOf, NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {FieldsFormGroup, FieldsOptions} from "../../../core/models/FieldsFormGroup";

@Component({
  selector: 'app-inputs',
  standalone: true,
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
    NgIf
  ],
  templateUrl: './inputs.component.html',
  styleUrl: './inputs.component.sass'
})
export class InputsComponent {
  @Input() i!: number;
  @Input() form!: FormGroup;
  @Input() set fieldData(value: FieldsFormGroup) {
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
