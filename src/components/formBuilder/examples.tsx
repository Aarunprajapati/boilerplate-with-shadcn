"use client";

// ─────────────────────────────────────────────────────────────────────────────
// examples.tsx — real-world usage of AppFormBuilder
//
// Copy any example into your page/component.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import { AppFormBuilder } from "./AppFormBuilder";
import type { FormSchema, FormValues } from "./types";

// ═════════════════════════════════════════════════════════════════════════════
// EXAMPLE 1 — Static schema (hardcoded JSON)
// ═════════════════════════════════════════════════════════════════════════════

const staticSchema: FormSchema = {
  title: "User Registration",
  description: "Fill out the form to create your account.",
  columns: 2,              // 2-column grid layout
  submitLabel: "Register",
  showReset: true,

  fields: [
    // ── Structural ────────────────────────────────────────────────
    { type: "heading", label: "Personal Info", level: 3 },

    // ── Text inputs ───────────────────────────────────────────────
    {
      type: "text",
      name: "firstName",
      label: "First Name",
      placeholder: "John",
      validation: [{ type: "required" }, { type: "minLength", value: 2 }],
    },
    {
      type: "text",
      name: "lastName",
      label: "Last Name",
      placeholder: "Doe",
      validation: [{ type: "required" }],
    },
    {
      type: "email",
      name: "email",
      label: "Email Address",
      placeholder: "john@example.com",
      colSpan: 2,           // stretches across both columns
      validation: [{ type: "required" }, { type: "email" }],
    },

    // ── Custom Select (single) ────────────────────────────────────
    {
      type: "select",
      name: "country",
      label: "Country",
      placeholder: "Select your country…",
      searchable: true,
      clearable: true,
      validation: [{ type: "required" }],
      options: [
        { group: "Asia",   items: [{ label: "India", value: "IN" }, { label: "Japan", value: "JP" }] },
        { group: "Europe", items: [{ label: "Germany", value: "DE" }, { label: "France", value: "FR" }] },
        { group: "Americas", items: [{ label: "USA", value: "US" }, { label: "Canada", value: "CA" }] },
      ],
    },

    // ── MultiSelect ───────────────────────────────────────────────
    {
      type: "multiselect",
      name: "skills",
      label: "Skills",
      placeholder: "Pick your skills…",
      searchable: true,
      maxSelections: 5,
      options: [
        { label: "React",       value: "react" },
        { label: "TypeScript",  value: "ts" },
        { label: "Node.js",     value: "node" },
        { label: "Python",      value: "python" },
        { label: "GraphQL",     value: "graphql" },
      ],
    },

    // ── Divider ───────────────────────────────────────────────────
    { type: "divider", label: "Preferences" },

    // ── Radio group ───────────────────────────────────────────────
    {
      type: "radio",
      name: "plan",
      label: "Plan",
      inline: true,
      defaultValue: "free",
      options: [
        { label: "Free",    value: "free" },
        { label: "Pro",     value: "pro" },
        { label: "Enterprise", value: "enterprise" },
      ],
    },

    // ── Conditional field (shown only when plan = "pro") ──────────
    {
      type: "text",
      name: "promoCode",
      label: "Promo Code",
      placeholder: "Enter promo code",
      showWhen: { field: "plan", value: "pro" },
    },

    // ── Checkbox group ────────────────────────────────────────────
    {
      type: "checkbox",
      name: "notifications",
      label: "Notification preferences",
      colSpan: 2,
      options: [
        { label: "Email updates",    value: "email" },
        { label: "SMS alerts",       value: "sms" },
        { label: "Push notifications", value: "push" },
      ],
    },

    // ── Switch ────────────────────────────────────────────────────
    {
      type: "switch",
      name: "agreeTerms",
      label: "I agree to the Terms & Conditions",
      colSpan: 2,
      validation: [{ type: "required", message: "You must accept the terms." }],
    },

    // ── Hidden field ──────────────────────────────────────────────
    { type: "hidden", name: "source", defaultValue: "web" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Example 1 — All event handler props shown
// ─────────────────────────────────────────────────────────────────────────────

export function Example1_StaticSchema() {
  return (
    <AppFormBuilder
      schema={staticSchema}

      // ── defaultValues: pre-populate fields (uncontrolled) ────────
      defaultValues={{ plan: "free", country: "IN" }}

      // ── onChange: fires on every field change ────────────────────
      // name       = field's `name` key
      // value      = new raw value (string | string[] | boolean | null)
      // allValues  = full snapshot of the form at that moment
      onChange={(name, value, allValues) => {
        console.log("onChange →", name, value);
        console.log("full form state →", allValues);
      }}

      // ── onSelect: fires only for `select` and `multiselect` ──────
      // option = FlatOption ({ label, value }) | FlatOption[] | null
      onSelect={(name, option) => {
        console.log("onSelect →", name, option);
        // e.g. option = { label: "India", value: "IN" }
      }}

      // ── onCheck: fires for `checkbox`, `radio`, `switch` ─────────
      // checked = boolean (switch/single-checkbox) | string[] (checkbox group / radio)
      onCheck={(name, checked) => {
        console.log("onCheck →", name, checked);
      }}

      // ── onSubmit: fires with validated values ────────────────────
      onSubmit={async (values) => {
        console.log("Submitting →", values);
        await fetch("/api/register", {
          method: "POST",
          body: JSON.stringify(values),
        });
      }}

      // ── onValidationError: fires when submit fails validation ────
      onValidationError={(errors) => {
        console.warn("Validation errors →", errors);
      }}

      // ── onReset: fires when Reset button is clicked ──────────────
      onReset={() => console.log("Form reset")}

      // ── UX flags ─────────────────────────────────────────────────
      showErrors={true}   // show inline error messages (default: true)
      disabled={false}    // disable entire form
      loading={false}     // show spinner on submit button
    />
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// EXAMPLE 2 — Schema from API  (async load)
// ═════════════════════════════════════════════════════════════════════════════

export function Example2_SchemaFromAPI() {
  const [schema, setSchema] = useState<FormSchema | null>(null);

  React.useEffect(() => {
    // Schema comes from your backend — same shape as FormSchema
    fetch("/api/form-schema?id=onboarding")
      .then((r) => r.json())
      .then(setSchema);
  }, []);

  if (!schema) return <p>Loading form…</p>;

  return (
    <AppFormBuilder
      schema={schema}
      onSubmit={async (values) => {
        await fetch("/api/submit", {
          method: "POST",
          body: JSON.stringify(values),
        });
      }}
    />
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// EXAMPLE 3 — Fully controlled form (you manage state)
// ═════════════════════════════════════════════════════════════════════════════

const controlledSchema: FormSchema = {
  fields: [
    { type: "text",  name: "username", label: "Username", validation: [{ type: "required" }] },
    { type: "email", name: "email",    label: "Email",    validation: [{ type: "required" }, { type: "email" }] },
    {
      type: "select",
      name: "role",
      label: "Role",
      options: [
        { label: "Admin",  value: "admin" },
        { label: "Editor", value: "editor" },
        { label: "Viewer", value: "viewer" },
      ],
    },
  ],
};

export function Example3_ControlledForm() {
  const [formValues, setFormValues] = useState<FormValues>({
    username: "",
    email: "",
    role: null,
  });

  return (
    <div>
      {/* Live preview panel */}
      <pre className="mb-4 rounded bg-muted p-3 text-xs">
        {JSON.stringify(formValues, null, 2)}
      </pre>

      <AppFormBuilder
        schema={controlledSchema}
        // Pass controlled values
        values={formValues}
        // Update state on every change
        onChange={(name, value) =>
          setFormValues((prev) => ({ ...prev, [name]: value }))
        }
        onSubmit={async (values) => {
          console.log("Final values →", values);
        }}
      />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// EXAMPLE 4 — Minimal one-liner (just pass schema + onSubmit)
// ═════════════════════════════════════════════════════════════════════════════

export function Example4_Minimal() {
  const schema: FormSchema = {
    title: "Contact Us",
    fields: [
      { type: "text",     name: "name",    label: "Name",    validation: [{ type: "required" }] },
      { type: "email",    name: "email",   label: "Email",   validation: [{ type: "required" }, { type: "email" }] },
      { type: "textarea", name: "message", label: "Message", validation: [{ type: "required" }] },
    ],
  };

  return (
    <AppFormBuilder
      schema={schema}
      onSubmit={(values) => console.log(values)}
    />
  );
}
