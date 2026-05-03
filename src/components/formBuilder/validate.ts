// ─────────────────────────────────────────────────────────────────────────────
// validate.ts — runs ValidationRule[] against a single field value
// ─────────────────────────────────────────────────────────────────────────────

import type { ValidationRule } from "./types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateField(
  value: string | string[] | boolean | null | undefined,
  rules: ValidationRule[] = []
): string | null {
  for (const rule of rules) {
    switch (rule.type) {
      case "required": {
        const empty =
          value === null ||
          value === undefined ||
          value === "" ||
          (Array.isArray(value) && value.length === 0) ||
          value === false;
        if (empty) return rule.message ?? "This field is required.";
        break;
      }
      case "email": {
        if (value && !EMAIL_RE.test(String(value)))
          return rule.message ?? "Enter a valid email address.";
        break;
      }
      case "minLength": {
        if (value && String(value).length < rule.value)
          return rule.message ?? `Minimum ${rule.value} characters.`;
        break;
      }
      case "maxLength": {
        if (value && String(value).length > rule.value)
          return rule.message ?? `Maximum ${rule.value} characters.`;
        break;
      }
      case "min": {
        if (value !== null && value !== undefined && Number(value) < rule.value)
          return rule.message ?? `Minimum value is ${rule.value}.`;
        break;
      }
      case "max": {
        if (value !== null && value !== undefined && Number(value) > rule.value)
          return rule.message ?? `Maximum value is ${rule.value}.`;
        break;
      }
      case "pattern": {
        if (value && !new RegExp(rule.value).test(String(value)))
          return rule.message ?? "Invalid format.";
        break;
      }
    }
  }
  return null;
}

export function validateForm(
  fields: { name: string; validation?: ValidationRule[] }[],
  values: Record<string, string | string[] | boolean | null>
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const field of fields) {
    const err = validateField(values[field.name], field.validation);
    if (err) errors[field.name] = err;
  }
  return errors;
}
