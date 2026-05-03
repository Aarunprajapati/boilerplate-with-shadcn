/* eslint-disable react-hooks/set-state-in-effect */
/**
 * AppFormBuilder — Reusable Form Builder with shadcn/ui + Custom Select Dropdown
 *
 * Dependencies:
 *   npm install @radix-ui/react-label @radix-ui/react-checkbox @radix-ui/react-radio-group
 *               @radix-ui/react-switch lucide-react class-variance-authority clsx tailwind-merge
 *
 * shadcn/ui components used:
 *   Input, Label, Textarea, Switch, Button, Badge, Separator
 *   + Custom AppSelect (grouped, searchable dropdown — built from scratch)
 */

"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ChevronDown,
  Check,
  Search,
  ArrowUp,
  ArrowDown,
  Trash2,
  Eye,
  FileJson,
  PlusCircle,
  Type,
  Mail,
  Hash,
  List,
  AlignLeft,
  Calendar,
  CheckSquare,
  Circle,
} from "lucide-react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type SelectOptionGroup = { group: string; items: string[] };
export type SelectOptionFlat = string;
export type SelectOption = SelectOptionGroup | SelectOptionFlat;

export type FieldType =
  | "text"
  | "email"
  | "number"
  | "select"
  | "textarea"
  | "date"
  | "checkbox"
  | "radio";

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  description?: string;
  required: boolean;
  // Select-specific
  options?: SelectOption[];
  searchable?: boolean;
  value?: string | null;
  // Checkbox/Radio
  items?: string[];
}

export interface FormSchema {
  fields: FormField[];
}

// ─────────────────────────────────────────────
// Custom AppSelect Dropdown
// ─────────────────────────────────────────────

interface AppSelectProps {
  options: SelectOption[];
  value?: string | null;
  placeholder?: string;
  searchable?: boolean;
  onChange?: (val: string) => void;
  className?: string;
}

export function AppSelect({
  options,
  value,
  placeholder = "Select an option...",
  searchable = true,
  onChange,
  className,
}: AppSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && searchable && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
    if (!open) setQuery("");
  }, [open, searchable]);

  const filteredOptions = options
    .map((opt) => {
      if (typeof opt === "string") {
        return query ? (opt.toLowerCase().includes(query.toLowerCase()) ? opt : null) : opt;
      }
      const filtered = opt.items.filter((item) =>
        query ? item.toLowerCase().includes(query.toLowerCase()) : true
      );
      return filtered.length > 0 ? { group: opt.group, items: filtered } : null;
    })
    .filter(Boolean) as SelectOption[];

  const handleSelect = (val: string) => {
    onChange?.(val);
    setOpen(false);
  };

  const hasResults = filteredOptions.some((opt) =>
    typeof opt === "string" ? true : (opt as SelectOptionGroup).items.length > 0
  );

  return (
    <div ref={ref} className={cn("relative w-full", className)}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm",
          "ring-offset-background placeholder:text-muted-foreground",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          open && "ring-2 ring-ring ring-offset-2",
          !value && "text-muted-foreground"
        )}
      >
        <span className="truncate">{value ?? placeholder}</span>
        <ChevronDown
          className={cn(
            "ml-2 h-4 w-4 shrink-0 opacity-50 transition-transform duration-150",
            open && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className={cn(
            "absolute z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md",
            "animate-in fade-in-0 zoom-in-95"
          )}
        >
          {/* Search */}
          {searchable && (
            <div className="flex items-center border-b px-3 py-2">
              <Search className="mr-2 h-3.5 w-3.5 shrink-0 opacity-50" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
          )}

          {/* Options */}
          <div className="max-h-52 overflow-y-auto p-1">
            {!hasResults && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No results found.
              </div>
            )}
            {filteredOptions.map((opt) =>
              typeof opt === "string" ? (
                <AppSelectItem
                  key={opt}
                  label={opt}
                  selected={value === opt}
                  onSelect={() => handleSelect(opt)}
                />
              ) : (
                <div key={(opt as SelectOptionGroup).group}>
                  <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                    {(opt as SelectOptionGroup).group}
                  </p>
                  {(opt as SelectOptionGroup).items.map((item) => (
                    <AppSelectItem
                      key={item}
                      label={item}
                      selected={value === item}
                      onSelect={() => handleSelect(item)}
                    />
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function AppSelectItem({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
        "hover:bg-accent hover:text-accent-foreground",
        selected && "bg-accent/60 font-medium"
      )}
    >
      {selected && (
        <Check className="absolute left-2 h-3.5 w-3.5 text-primary" />
      )}
      {label}
    </div>
  );
}

// ─────────────────────────────────────────────
// Field Renderer
// ─────────────────────────────────────────────

interface FieldRendererProps {
  field: FormField;
  onSelectChange?: (id: string, val: string) => void;
}

function FieldRenderer({ field, onSelectChange }: FieldRendererProps) {
  switch (field.type) {
    case "text":
    case "email":
    case "number":
      return (
        <Input
          type={field.type}
          placeholder={field.placeholder}
          className="w-full"
        />
      );

    case "select":
      return (
        <AppSelect
          options={field.options ?? []}
          value={field.value}
          placeholder={field.placeholder}
          searchable={field.searchable}
          onChange={(val) => onSelectChange?.(field.id, val)}
        />
      );

    case "textarea":
      return (
        <Textarea
          placeholder={field.placeholder}
          rows={3}
          className="w-full resize-y"
        />
      );

    case "date":
      return <Input type="date" className="w-full" />;

    case "checkbox":
      return (
        <div className="space-y-2">
          {(field.items ?? []).map((item) => (
            <label key={item} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="h-4 w-4 accent-primary" />
              <span className="text-sm">{item}</span>
            </label>
          ))}
        </div>
      );

    case "radio":
      return (
        <div className="space-y-2">
          {(field.items ?? []).map((item) => (
            <label key={item} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name={`radio_${field.id}`} className="h-4 w-4 accent-primary" />
              <span className="text-sm">{item}</span>
            </label>
          ))}
        </div>
      );

    default:
      return null;
  }
}

// ─────────────────────────────────────────────
// Field Type Sidebar Config
// ─────────────────────────────────────────────

const FIELD_TYPES: { type: FieldType; label: string; icon: React.ReactNode }[] = [
  { type: "text",     label: "Text Input",     icon: <Type className="h-4 w-4" /> },
  { type: "email",    label: "Email",          icon: <Mail className="h-4 w-4" /> },
  { type: "number",   label: "Number",         icon: <Hash className="h-4 w-4" /> },
  { type: "select",   label: "Custom Select",  icon: <List className="h-4 w-4" /> },
  { type: "textarea", label: "Textarea",       icon: <AlignLeft className="h-4 w-4" /> },
  { type: "date",     label: "Date",           icon: <Calendar className="h-4 w-4" /> },
  { type: "checkbox", label: "Checkboxes",     icon: <CheckSquare className="h-4 w-4" /> },
  { type: "radio",    label: "Radio Group",    icon: <Circle className="h-4 w-4" /> },
];

const FIELD_DEFAULTS: Record<FieldType, Partial<FormField>> = {
  text:     { label: "Full Name",      placeholder: "Enter your name",       required: false },
  email:    { label: "Email Address",  placeholder: "you@example.com",       required: true  },
  number:   { label: "Age",            placeholder: "25",                    required: false },
  select:   {
    label: "Category", placeholder: "Select an option...", required: false, value: null,
    searchable: true,
    options: [
      { group: "Fruits",      items: ["Apple", "Banana", "Cherry", "Mango"] },
      { group: "Vegetables",  items: ["Carrot", "Broccoli", "Spinach"] },
    ],
  },
  textarea: { label: "Message",        placeholder: "Write here...",          required: false },
  date:     { label: "Date of Birth",                                         required: false },
  checkbox: { label: "Preferences",    items: ["Option A","Option B","Option C"], required: false },
  radio:    { label: "Choose One",     items: ["Choice 1","Choice 2","Choice 3"], required: false },
};

// ─────────────────────────────────────────────
// AppFormBuilder — Main Component
// ─────────────────────────────────────────────

interface AppFormBuilderProps {
  initialFields?: FormField[];
  onSchemaChange?: (schema: FormSchema) => void;
}

let _idCounter = 0;
const genId = () => `field_${++_idCounter}_${Date.now()}`;

export function AppFormBuilder({ initialFields = [], onSchemaChange }: AppFormBuilderProps) {
  const [fields, setFields] = useState<FormField[]>(initialFields);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showJSON, setShowJSON] = useState(false);

  const updateFields = useCallback((updated: FormField[]) => {
    setFields(updated);
    onSchemaChange?.({ fields: updated });
  }, [onSchemaChange]);

  const addField = (type: FieldType) => {
    const id = genId();
    const defaults = FIELD_DEFAULTS[type];
    const newField: FormField = { id, type, label: "", required: false, ...defaults } as FormField;
    const updated = [...fields, newField];
    updateFields(updated);
    setSelectedId(id);
  };

  const removeField = (id: string) => {
    updateFields(fields.filter((f) => f.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const moveField = (id: string, dir: -1 | 1) => {
    const i = fields.findIndex((f) => f.id === id);
    if ((dir === -1 && i === 0) || (dir === 1 && i === fields.length - 1)) return;
    const arr = [...fields];
    [arr[i], arr[i + dir]] = [arr[i + dir], arr[i]];
    updateFields(arr);
  };

  const patchField = (id: string, patch: Partial<FormField>) => {
    updateFields(fields.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  };

  const handleSelectChange = (fieldId: string, val: string) => {
    patchField(fieldId, { value: val });
  };

  const exportSchema = (): FormSchema => ({
    fields: fields.map(({ value: _v, ...rest }) => rest as FormField),
  });

  return (
    <div className="flex h-full min-h-[600px] overflow-hidden rounded-xl border border-border bg-background shadow-sm">
      {/* ── Sidebar ── */}
      <aside className="flex w-56 shrink-0 flex-col gap-1 border-r border-border bg-muted/40 p-3">
        <p className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Field Types
        </p>
        {FIELD_TYPES.map(({ type, label, icon }) => (
          <button
            key={type}
            onClick={() => addField(type)}
            className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-foreground hover:bg-background hover:shadow-sm transition-all"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-background border border-border text-muted-foreground">
              {icon}
            </span>
            {label}
          </button>
        ))}
      </aside>

      {/* ── Canvas ── */}
      <main className="flex flex-1 flex-col overflow-y-auto p-5">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Form Builder</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowPreview((s) => !s)}>
              <Eye className="mr-1.5 h-3.5 w-3.5" />
              {showPreview ? "Close Preview" : "Preview"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => { setShowJSON((s) => !s); }}
            >
              <FileJson className="mr-1.5 h-3.5 w-3.5" />
              Export JSON
            </Button>
          </div>
        </div>

        {/* Preview Mode */}
        {showPreview && (
          <div className="mb-4 rounded-xl border border-border bg-muted/30 p-6">
            <p className="mb-4 text-sm font-medium text-muted-foreground">Form Preview</p>
            <div className="space-y-4">
              {fields.map((f) => (
                <div key={f.id} className="space-y-1.5">
                  <Label>
                    {f.label}
                    {f.required && <span className="ml-1 text-destructive">*</span>}
                  </Label>
                  {f.description && (
                    <p className="text-xs text-muted-foreground">{f.description}</p>
                  )}
                  <FieldRenderer field={f} onSelectChange={handleSelectChange} />
                </div>
              ))}
              {fields.length > 0 && (
                <Button className="mt-2" size="sm">Submit</Button>
              )}
            </div>
          </div>
        )}

        {/* JSON Export */}
        {showJSON && (
          <div className="mb-4 rounded-xl border border-border bg-muted/30 p-4">
            <p className="mb-2 text-xs font-medium text-muted-foreground">Form Schema (JSON)</p>
            <pre className="overflow-x-auto rounded-md bg-background p-3 text-xs font-mono text-foreground max-h-56 overflow-y-auto border border-border">
              {JSON.stringify(exportSchema(), null, 2)}
            </pre>
          </div>
        )}

        {/* Empty State */}
        {fields.length === 0 && !showPreview && (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-16 text-center text-muted-foreground">
            <PlusCircle className="h-8 w-8 opacity-30" />
            <p className="text-sm">Click a field type on the left to start building</p>
          </div>
        )}

        {/* Field Cards */}
        {!showPreview && (
          <div className="space-y-2">
            {fields.map((field) => {
              const isSelected = selectedId === field.id;
              return (
                <div
                  key={field.id}
                  onClick={() => setSelectedId(isSelected ? null : field.id)}
                  className={cn(
                    "rounded-lg border bg-background p-4 cursor-pointer transition-all",
                    isSelected
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border hover:border-border/80 hover:shadow-sm"
                  )}
                >
                  {/* Card Header */}
                  <div className="mb-3 flex items-center justify-between">
                    <Badge variant="secondary" className="text-[11px]">
                      {FIELD_TYPES.find((t) => t.type === field.type)?.label ?? field.type}
                    </Badge>
                    <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveField(field.id, -1)}>
                        <ArrowUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveField(field.id, 1)}>
                        <ArrowDown className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => removeField(field.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Field Preview */}
                  <div className="space-y-1.5">
                    <Label>
                      {field.label || <span className="italic text-muted-foreground">Untitled</span>}
                      {field.required && <span className="ml-1 text-destructive">*</span>}
                    </Label>
                    {field.description && (
                      <p className="text-xs text-muted-foreground">{field.description}</p>
                    )}
                    <FieldRenderer field={field} onSelectChange={handleSelectChange} />
                  </div>

                  {/* Config Panel */}
                  {isSelected && (
                    <div onClick={(e) => e.stopPropagation()}>
                      <Separator className="my-3" />
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Label</Label>
                          <Input
                            value={field.label}
                            onChange={(e) => patchField(field.id, { label: e.target.value })}
                            placeholder="Field label"
                            className="h-8 text-sm"
                          />
                        </div>
                        {["text","email","number","select","textarea"].includes(field.type) && (
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Placeholder</Label>
                            <Input
                              value={field.placeholder ?? ""}
                              onChange={(e) => patchField(field.id, { placeholder: e.target.value })}
                              placeholder="Hint text"
                              className="h-8 text-sm"
                            />
                          </div>
                        )}
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Description</Label>
                          <Input
                            value={field.description ?? ""}
                            onChange={(e) => patchField(field.id, { description: e.target.value })}
                            placeholder="Helper text"
                            className="h-8 text-sm"
                          />
                        </div>
                        <div className="flex items-end gap-2 pb-0.5">
                          <Label className="text-xs text-muted-foreground">Required</Label>
                          <Switch
                            checked={field.required}
                            onCheckedChange={(val) => patchField(field.id, { required: val })}
                          />
                        </div>
                        {field.type === "select" && (
                          <div className="col-span-2 flex items-center gap-2">
                            <Label className="text-xs text-muted-foreground">Searchable</Label>
                            <Switch
                              checked={field.searchable !== false}
                              onCheckedChange={(val) => patchField(field.id, { searchable: val })}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────
// Usage Example
// ─────────────────────────────────────────────
