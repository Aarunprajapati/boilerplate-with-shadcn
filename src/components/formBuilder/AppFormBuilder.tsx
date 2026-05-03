"use client";

// ─────────────────────────────────────────────────────────────────────────────
// AppFormBuilder.tsx
//
// Usage: <AppFormBuilder schema={schema} onSubmit={handleSubmit} onChange={...} />
//
// The `schema` JSON drives the entire form — no per-field JSX needed.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// shadcn/ui
import { Input }     from "@/components/ui/input";
import { Label }     from "@/components/ui/label";
import { Textarea }  from "@/components/ui/textarea";
import { Switch }    from "@/components/ui/switch";
import { Button }    from "@/components/ui/button";
import { Checkbox }  from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

// Local
import { AppSelect, AppMultiSelect } from "./AppSelect";
import { validateForm } from "./validate";
import type {
  AppFormBuilderProps,
  FormField,
  FormValues,
  FlatOption,
  SelectField,
  MultiSelectField,
  CheckboxField,
  RadioField,
} from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function buildInitialValues(
  fields: FormField[],
  overrides: FormValues = {}
): FormValues {
  const values: FormValues = {};
  for (const field of fields) {
    if (field.type === "divider" || field.type === "heading") continue;
    const name = (field as { name: string }).name;
    if (name in overrides) {
      values[name] = overrides[name];
    } else if ("defaultValue" in field && field.defaultValue !== undefined) {
      values[name] = field.defaultValue as string | string[] | boolean;
    } else if (field.type === "multiselect" || (field.type === "checkbox" && (field as CheckboxField).options)) {
      values[name] = [];
    } else if (field.type === "switch" || field.type === "checkbox") {
      values[name] = false;
    } else {
      values[name] = "";
    }
  }
  return values;
}

function isVisible(field: FormField, values: FormValues): boolean {
  if (field.type === "divider" || field.type === "heading") return true;
  const f = field as FormField & { showWhen?: { field: string; value: string | string[] | boolean } };
  if (!f.showWhen) return true;
  const { field: watchField, value: watchValue } = f.showWhen;
  const actual = values[watchField];
  if (Array.isArray(watchValue)) return watchValue.includes(actual as string);
  return actual === watchValue;
}

// ─────────────────────────────────────────────────────────────────────────────
// AppFormBuilder
// ─────────────────────────────────────────────────────────────────────────────

export function AppFormBuilder({
  schema,
  values: controlledValues,
  defaultValues,
  onChange,
  onSelect,
  onCheck,
  onSubmit,
  onValidationError,
  onReset,
  showErrors = true,
  disabled = false,
  loading = false,
  className,
}: AppFormBuilderProps) {
  // ── State ──────────────────────────────────────────────────────────────────

  const [internalValues, setInternalValues] = useState<FormValues>(() =>
    buildInitialValues(schema.fields, defaultValues)
  );

  // Support both controlled (values prop) and uncontrolled modes
  const values: FormValues = controlledValues ?? internalValues;

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);

  // Re-initialise when schema changes
  useEffect(() => {
    setInternalValues(buildInitialValues(schema.fields, defaultValues));
    setErrors({});
    setTouched({});
  }, [schema]);

  // ── Core updater ───────────────────────────────────────────────────────────

  const updateValue = useCallback(
    (
      name: string,
      value: string | string[] | boolean | null,
      raw?: { option?: FlatOption | FlatOption[] | null; checked?: boolean | string[] }
    ) => {
      const next = controlledValues
        ? { ...controlledValues, [name]: value }
        : { ...internalValues, [name]: value };

      if (!controlledValues) setInternalValues(next);

      // Mark touched
      setTouched((t) => ({ ...t, [name]: true }));

      // Clear error on change
      setErrors((e) => {
        const { [name]: _, ...rest } = e;
        return rest;
      });

      // Fire generic onChange
      onChange?.(name, value, next);

      // Fire onSelect if an option object is available
      if (raw?.option !== undefined) {
        onSelect?.(name, raw.option, next);
      }

      // Fire onCheck if checkbox/radio
      if (raw?.checked !== undefined) {
        onCheck?.(name, raw.checked, next);
      }
    },
    [controlledValues, internalValues, onChange, onSelect, onCheck]
  );

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Only validate visible, non-structural fields
    const activeFields = schema.fields.filter(
      (f) =>
        f.type !== "divider" &&
        f.type !== "heading" &&
        f.type !== "hidden" &&
        isVisible(f, values)
    ) as Parameters<typeof validateForm>[0];

    const errs = validateForm(activeFields, values);

    // Mark all as touched
    const allTouched: Record<string, boolean> = {};
    activeFields.forEach((f) => (allTouched[f.name] = true));
    setTouched(allTouched);

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      onValidationError?.(errs);
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit?.(values);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Reset ──────────────────────────────────────────────────────────────────

  const handleReset = () => {
    const fresh = buildInitialValues(schema.fields, defaultValues);
    setInternalValues(fresh);
    setErrors({});
    setTouched({});
    onReset?.();
  };

  // ── Column layout ──────────────────────────────────────────────────────────

  const columns = schema.columns ?? 1;

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <form
      onSubmit={handleSubmit}
      onReset={(e) => { e.preventDefault(); handleReset(); }}
      noValidate
      className={cn("w-full space-y-1", className)}
    >
      {/* Form title / description */}
      {schema.title && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold tracking-tight">{schema.title}</h2>
          {schema.description && (
            <p className="mt-1 text-sm text-muted-foreground">{schema.description}</p>
          )}
        </div>
      )}

      {/* Fields grid */}
      <div
        className={cn(
          "grid gap-4",
          columns === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"
        )}
      >
        {schema.fields.map((field, index) => (
          <FieldWrapper
            key={"name" in field ? field.name : `${field.type}_${index}`}
            field={field}
            values={values}
            errors={showErrors ? errors : {}}
            touched={touched}
            disabled={disabled}
            onUpdate={updateValue}
            columns={columns}
          />
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <Button
          type="submit"
          disabled={disabled || loading || submitting}
          className="min-w-[100px]"
        >
          {(loading || submitting) && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {schema.submitLabel ?? "Submit"}
        </Button>

        {schema.showReset && (
          <Button type="reset" variant="outline" disabled={disabled || submitting}>
            Reset
          </Button>
        )}
      </div>
    </form>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FieldWrapper — decides visibility + col-span, then delegates to FieldControl
// ─────────────────────────────────────────────────────────────────────────────

interface FieldWrapperProps {
  field: FormField;
  values: FormValues;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  disabled: boolean;
  columns: 1 | 2;
  onUpdate: (
    name: string,
    value: string | string[] | boolean | null,
    raw?: { option?: FlatOption | FlatOption[] | null; checked?: boolean | string[] }
  ) => void;
}

function FieldWrapper({ field, values, errors, touched, disabled, columns, onUpdate }: FieldWrapperProps) {
  if (!isVisible(field, values)) return null;

  // Structural fields
  if (field.type === "divider") {
    return (
      <div className={cn(columns === 2 && "sm:col-span-2")}>
        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          {field.label && (
            <span className="shrink-0 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {field.label}
            </span>
          )}
          <Separator className="flex-1" />
        </div>
      </div>
    );
  }

  if (field.type === "heading") {
    const Tag = (`h${field.level ?? 3}`) as React.ElementType;
    const sizes: Record<number, string> = { 2: "text-lg", 3: "text-base", 4: "text-sm" };
    return (
      <div className={cn(columns === 2 && "sm:col-span-2")}>
        <Tag className={cn("font-semibold", sizes[field.level ?? 3])}>{field.label}</Tag>
      </div>
    );
  }

  if (field.type === "hidden") {
    return <input type="hidden" name={field.name} value={String(field.defaultValue ?? "")} />;
  }

  const name = (field as { name: string }).name;
  const error = touched[name] ? errors[name] : undefined;
  const colSpanClass =
    columns === 2 && (field as { colSpan?: number }).colSpan === 2
      ? "sm:col-span-2"
      : "";

  return (
    <div className={cn("flex flex-col gap-1.5", colSpanClass)}>
      {/* Label (not for switch which has its own inline label) */}
      {field.type !== "switch" && field.type !== "checkbox" && (
        <Label htmlFor={name} className={cn(error && "text-destructive")}>
          {field.label}
          {"validation" in field &&
            field.validation?.some((v) => v.type === "required") && (
              <span className="ml-1 text-destructive">*</span>
            )}
        </Label>
      )}

      {/* Description */}
      {"description" in field && field.description && (
        <p className="text-xs text-muted-foreground">{field.description}</p>
      )}

      {/* Control */}
      <FieldControl
        field={field}
        value={values[name]}
        error={error}
        disabled={disabled || ("disabled" in field ? !!field.disabled : false)}
        onUpdate={onUpdate}
      />

      {/* Error message */}
      {error && (
        <p className="text-xs font-medium text-destructive">{error}</p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FieldControl — renders the correct shadcn/ui control per field type
// ─────────────────────────────────────────────────────────────────────────────

interface FieldControlProps {
  field: FormField;
  value: FormValues[string];
  error?: string;
  disabled: boolean;
  onUpdate: FieldWrapperProps["onUpdate"];
}

function FieldControl({ field, value, error, disabled, onUpdate }: FieldControlProps) {
  const name = (field as { name: string }).name;
  const hasError = !!error;

  // ── Text variants ──────────────────────────────────────────────────────────
  if (
    field.type === "text" ||
    field.type === "email" ||
    field.type === "password" ||
    field.type === "url" ||
    field.type === "tel"
  ) {
    return (
      <Input
        id={name}
        type={field.type}
        value={(value as string) ?? ""}
        placeholder={field.placeholder}
        disabled={disabled}
        onChange={(e) => onUpdate(name, e.target.value)}
        className={cn(hasError && "border-destructive focus-visible:ring-destructive")}
      />
    );
  }

  // ── Number ─────────────────────────────────────────────────────────────────
  if (field.type === "number") {
    return (
      <Input
        id={name}
        type="number"
        value={(value as string) ?? ""}
        placeholder={field.placeholder}
        disabled={disabled}
        min={field.min}
        max={field.max}
        step={field.step}
        onChange={(e) => onUpdate(name, e.target.value)}
        className={cn(hasError && "border-destructive focus-visible:ring-destructive")}
      />
    );
  }

  // ── Textarea ───────────────────────────────────────────────────────────────
  if (field.type === "textarea") {
    return (
      <Textarea
        id={name}
        value={(value as string) ?? ""}
        placeholder={field.placeholder}
        disabled={disabled}
        rows={field.rows ?? 3}
        onChange={(e) => onUpdate(name, e.target.value)}
        className={cn("resize-y", hasError && "border-destructive focus-visible:ring-destructive")}
      />
    );
  }

  // ── Date / time ────────────────────────────────────────────────────────────
  if (field.type === "date" || field.type === "datetime-local" || field.type === "time") {
    return (
      <Input
        id={name}
        type={field.type}
        value={(value as string) ?? ""}
        disabled={disabled}
        onChange={(e) => onUpdate(name, e.target.value)}
        className={cn(hasError && "border-destructive focus-visible:ring-destructive")}
      />
    );
  }

  // ── Select (single) ────────────────────────────────────────────────────────
  if (field.type === "select") {
    const f = field as SelectField;
    return (
      <AppSelect
        options={f.options}
        value={(value as string) ?? null}
        placeholder={f.placeholder}
        searchable={f.searchable}
        clearable={f.clearable}
        disabled={disabled}
        hasError={hasError}
        onSelect={(opt) => onUpdate(name, opt?.value ?? null, { option: opt })}
        onChange={(val) => onUpdate(name, val)}
      />
    );
  }

  // ── MultiSelect ────────────────────────────────────────────────────────────
  if (field.type === "multiselect") {
    const f = field as MultiSelectField;
    return (
      <AppMultiSelect
        options={f.options}
        value={(value as string[]) ?? []}
        placeholder={f.placeholder}
        searchable={f.searchable}
        disabled={disabled}
        maxSelections={f.maxSelections}
        hasError={hasError}
        onSelect={(opts) => onUpdate(name, opts.map((o) => o.value), { option: opts })}
        onChange={(vals) => onUpdate(name, vals)}
      />
    );
  }

  // ── Switch ─────────────────────────────────────────────────────────────────
  if (field.type === "switch") {
    return (
      <div className="flex items-center gap-3">
        <Switch
          id={name}
          checked={Boolean(value)}
          disabled={disabled}
          onCheckedChange={(checked) =>
            onUpdate(name, checked, { checked })
          }
        />
        <Label htmlFor={name} className="cursor-pointer font-normal">
          {field.label}
          {"validation" in field &&
            (field as { validation?: { type: string }[] }).validation?.some(
              (v) => v.type === "required"
            ) && <span className="ml-1 text-destructive">*</span>}
        </Label>
      </div>
    );
  }

  // ── Checkbox (single boolean OR group) ────────────────────────────────────
  if (field.type === "checkbox") {
    const f = field as CheckboxField;

    // Group of checkboxes
    if (f.options && f.options.length > 0) {
      const selected = (value as string[]) ?? [];
      return (
        <div className="space-y-2">
          {f.options.map((opt) => {
            const checked = selected.includes(opt.value);
            return (
              <div key={opt.value} className="flex items-center gap-2">
                <Checkbox
                  id={`${name}_${opt.value}`}
                  checked={checked}
                  disabled={disabled}
                  onCheckedChange={(c) => {
                    const next = c
                      ? [...selected, opt.value]
                      : selected.filter((v) => v !== opt.value);
                    onUpdate(name, next, { checked: next });
                  }}
                />
                <Label
                  htmlFor={`${name}_${opt.value}`}
                  className="cursor-pointer font-normal"
                >
                  {opt.label}
                </Label>
              </div>
            );
          })}
        </div>
      );
    }

    // Single boolean checkbox
    return (
      <div className="flex items-center gap-2">
        <Checkbox
          id={name}
          checked={Boolean(value)}
          disabled={disabled}
          onCheckedChange={(checked) =>
            onUpdate(name, Boolean(checked), { checked: Boolean(checked) })
          }
        />
        <Label htmlFor={name} className="cursor-pointer font-normal">
          {field.label}
        </Label>
      </div>
    );
  }

  // ── Radio group ────────────────────────────────────────────────────────────
  if (field.type === "radio") {
    const f = field as RadioField;
    return (
      <RadioGroup
        value={(value as string) ?? ""}
        disabled={disabled}
        onValueChange={(val) => {
          const opt = f.options.find((o) => o.value === val) ?? null;
          onUpdate(name, val, { checked: val });
          // also fires onSelect via raw.option pathway — pass opt
          // (onUpdate internally fires onSelect when raw.option provided)
        }}
        className={cn("space-y-2", f.inline && "flex flex-row flex-wrap gap-4 space-y-0")}
      >
        {f.options.map((opt) => (
          <div key={opt.value} className="flex items-center gap-2">
            <RadioGroupItem value={opt.value} id={`${name}_${opt.value}`} />
            <Label htmlFor={`${name}_${opt.value}`} className="cursor-pointer font-normal">
              {opt.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    );
  }

  return null;
}

export default AppFormBuilder;
