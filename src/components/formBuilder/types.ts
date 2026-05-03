// ─────────────────────────────────────────────────────────────────────────────
// AppFormBuilder — Types
// ─────────────────────────────────────────────────────────────────────────────

// ── Select option shapes ──────────────────────────────────────────────────────

/** A flat string option: value === label */
export type FlatOption = {
  label: string;
  value: string;
};

/** A grouped option set (renders a group heading) */
export type GroupedOption = {
  group: string;
  items: FlatOption[];
};

export type SelectOption = FlatOption | GroupedOption;

// Type-guard
export const isGrouped = (opt: SelectOption): opt is GroupedOption =>
  "group" in opt;

// ── Validation ────────────────────────────────────────────────────────────────

export type ValidationRule =
  | { type: "required"; message?: string }
  | { type: "minLength"; value: number; message?: string }
  | { type: "maxLength"; value: number; message?: string }
  | { type: "min"; value: number; message?: string }
  | { type: "max"; value: number; message?: string }
  | { type: "pattern"; value: string; message?: string }
  | { type: "email"; message?: string };

// ── Field Definitions ─────────────────────────────────────────────────────────

interface BaseField {
  /** Unique field key — used as form data key */
  name: string;
  /** Display label */
  label: string;
  /** Helper text rendered below label */
  description?: string;
  /** Placeholder / hint inside control */
  placeholder?: string;
  /** Default value pre-populated into the field */
  defaultValue?: string | string[] | boolean;
  /** Marks field as read-only */
  disabled?: boolean;
  /** Validation rules */
  validation?: ValidationRule[];
  /** Grid column span (1 or 2, when using 2-col layout) */
  colSpan?: 1 | 2;
  /** Conditionally show this field based on another field's value */
  showWhen?: { field: string; value: string | string[] | boolean };
}

export interface TextField extends BaseField {
  type: "text" | "email" | "password" | "url" | "tel";
}

export interface NumberField extends BaseField {
  type: "number";
  min?: number;
  max?: number;
  step?: number;
}

export interface TextareaField extends BaseField {
  type: "textarea";
  rows?: number;
}

export interface DateField extends BaseField {
  type: "date" | "datetime-local" | "time";
}

export interface SelectField extends BaseField {
  type: "select";
  options: SelectOption[];
  /** Enable in-dropdown search input */
  searchable?: boolean;
  /** Allow clearing the selection */
  clearable?: boolean;
}

export interface MultiSelectField extends BaseField {
  type: "multiselect";
  options: SelectOption[];
  searchable?: boolean;
  /** Max selections allowed */
  maxSelections?: number;
}

export interface CheckboxField extends BaseField {
  type: "checkbox";
  /** If options provided → checkbox group; otherwise → single boolean checkbox */
  options?: FlatOption[];
}

export interface RadioField extends BaseField {
  type: "radio";
  options: FlatOption[];
  /** Render inline (horizontal) */
  inline?: boolean;
}

export interface SwitchField extends BaseField {
  type: "switch";
}

export interface HiddenField {
  type: "hidden";
  name: string;
  defaultValue: string;
}

export interface DividerField {
  type: "divider";
  label?: string;
}

export interface HeadingField {
  type: "heading";
  label: string;
  level?: 2 | 3 | 4;
}

export type FormField =
  | TextField
  | NumberField
  | TextareaField
  | DateField
  | SelectField
  | MultiSelectField
  | CheckboxField
  | RadioField
  | SwitchField
  | HiddenField
  | DividerField
  | HeadingField;

// ── Form Schema ───────────────────────────────────────────────────────────────

export interface FormSchema {
  /** Form title rendered at the top */
  title?: string;
  /** Form description */
  description?: string;
  /** All field definitions */
  fields: FormField[];
  /** Layout: 1-column (default) or 2-column grid */
  columns?: 1 | 2;
  /** Submit button label */
  submitLabel?: string;
  /** Show reset button */
  showReset?: boolean;
}

// ── Form Values ───────────────────────────────────────────────────────────────

export type FormValues = Record<string, string | string[] | boolean | null>;

// ── Event Handlers ────────────────────────────────────────────────────────────

/**
 * Fired when any field value changes.
 * @param name  — the field's `name` key
 * @param value — new value (typed per field)
 * @param allValues — snapshot of the full form state
 */
export type OnChangeFn = (
  name: string,
  value: string | string[] | boolean | null,
  allValues: FormValues
) => void;

/**
 * Fired specifically when a Select / MultiSelect option is chosen.
 * @param name   — field name
 * @param option — the selected FlatOption object (has both label + value)
 * @param allValues — full form state
 */
export type OnSelectFn = (
  name: string,
  option: FlatOption | FlatOption[] | null,
  allValues: FormValues
) => void;

/**
 * Fired when a Checkbox or Radio changes.
 */
export type OnCheckFn = (
  name: string,
  checked: boolean | string[],
  allValues: FormValues
) => void;

/**
 * Fired on final form submit with validated values.
 */
export type OnSubmitFn = (values: FormValues) => void | Promise<void>;

/**
 * Fired when validation fails.
 */
export type OnValidationErrorFn = (
  errors: Record<string, string>
) => void;

// ── AppFormBuilder Props ──────────────────────────────────────────────────────

export interface AppFormBuilderProps {
  /** The JSON schema that drives the entire form */
  schema: FormSchema;

  // ── Value control ──────────────────────────────────────────────────────────
  /** Controlled form values (pass + update to fully control the form) */
  values?: FormValues;
  /** Initial uncontrolled values */
  defaultValues?: FormValues;

  // ── Event handlers ─────────────────────────────────────────────────────────
  /** Called on every field change */
  onChange?: OnChangeFn;
  /** Called when a select/multiselect option is picked */
  onSelect?: OnSelectFn;
  /** Called when a checkbox / radio changes */
  onCheck?: OnCheckFn;
  /** Called with validated data on submit */
  onSubmit?: OnSubmitFn;
  /** Called when validation fails */
  onValidationError?: OnValidationErrorFn;
  /** Called when Reset is clicked */
  onReset?: () => void;

  // ── UX flags ──────────────────────────────────────────────────────────────
  /** Show inline field-level error messages */
  showErrors?: boolean;
  /** Disable the entire form */
  disabled?: boolean;
  /** Show a loading spinner on the submit button */
  loading?: boolean;

  /** Extra className on the root element */
  className?: string;
}
