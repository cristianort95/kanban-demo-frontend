import {AbstractControl, ValidationErrors} from "@angular/forms";

export type FieldsOptions = {
  label: string;
  value: any;
}

export type FieldsFormGroup = {
  label: string;
  name: string;
  type: string;
  optionsFormGroup?: FieldsFormGroup[]
  textInputOther?: string;
  validator: ((control: AbstractControl) => (ValidationErrors | null))[];
  optionsChild?: FieldsOptions[];
  multipleSelect?: boolean;
  optionsChildUrl?: {
    url: string,
    keysOfValue: string[]
  };
}
