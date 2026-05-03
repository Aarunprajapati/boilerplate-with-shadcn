// form-builder/index.ts  — single import point

export { AppFormBuilder }    from "./AppFormBuilder";
export { AppSelect, AppMultiSelect } from "./AppSelect";
export { validateField, validateForm } from "./validate";

export type {
  // Schema
  FormSchema,
  FormField,
  FormValues,

  // Field types
  TextField,
  NumberField,
  TextareaField,
  DateField,
  SelectField,
  MultiSelectField,
  CheckboxField,
  RadioField,
  SwitchField,
  HiddenField,
  DividerField,
  HeadingField,

  // Options
  FlatOption,
  GroupedOption,
  SelectOption,

  // Validation
  ValidationRule,

  // Event handlers  ← import these types when writing callbacks
  OnChangeFn,
  OnSelectFn,
  OnCheckFn,
  OnSubmitFn,
  OnValidationErrorFn,

  // Props
  AppFormBuilderProps,
} from "./types";
