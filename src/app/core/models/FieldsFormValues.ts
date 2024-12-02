import {FieldsFormGroup} from "./FieldsFormGroup";

export type FieldsFormValuesChildren = {
  label: string; value: string, children?: FieldsFormValuesChildren[];
}

export type FieldsFormValues = {
  field: string;
  name: string;
  type: string;
  children?: FieldsFormGroup[]
  value?: string
  fields?: string[]
  data?: FieldsFormValuesChildren[]
}
