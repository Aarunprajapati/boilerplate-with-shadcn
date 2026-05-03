"use client";

// ─────────────────────────────────────────────────────────────────────────────
// AppSelect — Custom shadcn-style Select with grouped options + search
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { type FlatOption, type SelectOption, isGrouped } from "./types";

// ── Shared helpers ────────────────────────────────────────────────────────────

function useClickOutside(ref: React.RefObject<HTMLElement>, cb: () => void) {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) cb();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, cb]);
}

// ═════════════════════════════════════════════════════════════════════════════
// AppSelect  (single value)
// ═════════════════════════════════════════════════════════════════════════════

interface AppSelectProps {
  options: SelectOption[];
  value?: string | null;
  placeholder?: string;
  searchable?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  /** Returns the selected FlatOption so parent gets both label + value */
  onSelect?: (option: FlatOption | null) => void;
  /** Simple string shortcut — fires with option.value */
  onChange?: (value: string | null) => void;
  className?: string;
  hasError?: boolean;
}

export function AppSelect({
  options,
  value,
  placeholder = "Select an option…",
  searchable = true,
  clearable = false,
  disabled = false,
  onSelect,
  onChange,
  className,
  hasError,
}: AppSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useClickOutside(rootRef, () => setOpen(false));

  useEffect(() => {
    if (open && searchable) setTimeout(() => searchRef.current?.focus(), 40);
    if (!open) setQuery("");
  }, [open, searchable]);

  // Flatten all options to find the selected label
  const allFlat = options.flatMap((o) =>
    isGrouped(o) ? o.items : [o as FlatOption]
  );
  const selectedOption = allFlat.find((o) => o.value === value) ?? null;

  // Filter logic
  const filtered: SelectOption[] = options
    .map((o) => {
      if (!query) return o;
      if (isGrouped(o)) {
        const items = o.items.filter((i) =>
          i.label.toLowerCase().includes(query.toLowerCase())
        );
        return items.length ? { ...o, items } : null;
      }
      return (o as FlatOption).label.toLowerCase().includes(query.toLowerCase())
        ? o
        : null;
    })
    .filter(Boolean) as SelectOption[];

  const handleSelect = (opt: FlatOption) => {
    onSelect?.(opt);
    onChange?.(opt.value);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.(null);
    onChange?.(null);
  };

  return (
    <div ref={rootRef} className={cn("relative w-full", className)}>
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex h-10 w-full items-center justify-between gap-2 rounded-md border bg-background px-3 py-2 text-sm",
          "transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          hasError ? "border-destructive" : "border-input",
          open && "ring-2 ring-ring ring-offset-2"
        )}
      >
        <span className={cn("flex-1 truncate text-left", !selectedOption && "text-muted-foreground")}>
          {selectedOption?.label ?? placeholder}
        </span>
        <span className="flex shrink-0 items-center gap-1">
          {clearable && selectedOption && (
            <X
              className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground"
              onClick={handleClear}
            />
          )}
          <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")} />
        </span>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border bg-popover shadow-lg animate-in fade-in-0 zoom-in-95 slide-in-from-top-1">
          {searchable && (
            <div className="flex items-center gap-2 border-b px-3 py-2">
              <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search…"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
          )}

          <div className="max-h-56 overflow-y-auto p-1">
            {filtered.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">No results found.</p>
            )}
            {filtered.map((opt, i) =>
              isGrouped(opt) ? (
                <div key={opt.group}>
                  <p className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {opt.group}
                  </p>
                  {opt.items.map((item) => (
                    <SelectOption key={item.value} item={item} selected={value === item.value} onSelect={handleSelect} />
                  ))}
                </div>
              ) : (
                <SelectOption
                  key={(opt as FlatOption).value}
                  item={opt as FlatOption}
                  selected={value === (opt as FlatOption).value}
                  onSelect={handleSelect}
                />
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SelectOption({
  item,
  selected,
  onSelect,
}: {
  item: FlatOption;
  selected: boolean;
  onSelect: (o: FlatOption) => void;
}) {
  return (
    <div
      onClick={() => onSelect(item)}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-3 text-sm",
        "hover:bg-accent hover:text-accent-foreground",
        selected && "bg-accent/50 font-medium"
      )}
    >
      {selected && <Check className="absolute left-2 h-3.5 w-3.5 text-primary" />}
      {item.label}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// AppMultiSelect  (multiple values)
// ═════════════════════════════════════════════════════════════════════════════

interface AppMultiSelectProps {
  options: SelectOption[];
  value?: string[];
  placeholder?: string;
  searchable?: boolean;
  disabled?: boolean;
  maxSelections?: number;
  onSelect?: (options: FlatOption[]) => void;
  onChange?: (values: string[]) => void;
  className?: string;
  hasError?: boolean;
}

export function AppMultiSelect({
  options,
  value = [],
  placeholder = "Select options…",
  searchable = true,
  disabled = false,
  maxSelections,
  onSelect,
  onChange,
  className,
  hasError,
}: AppMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useClickOutside(rootRef, () => setOpen(false));

  useEffect(() => {
    if (open && searchable) setTimeout(() => searchRef.current?.focus(), 40);
    if (!open) setQuery("");
  }, [open, searchable]);

  const allFlat = options.flatMap((o) =>
    isGrouped(o) ? o.items : [o as FlatOption]
  );

  const selectedOptions = allFlat.filter((o) => value.includes(o.value));

  const filtered: SelectOption[] = options
    .map((o) => {
      if (!query) return o;
      if (isGrouped(o)) {
        const items = o.items.filter((i) =>
          i.label.toLowerCase().includes(query.toLowerCase())
        );
        return items.length ? { ...o, items } : null;
      }
      return (o as FlatOption).label.toLowerCase().includes(query.toLowerCase()) ? o : null;
    })
    .filter(Boolean) as SelectOption[];

  const toggle = (opt: FlatOption) => {
    let next: string[];
    if (value.includes(opt.value)) {
      next = value.filter((v) => v !== opt.value);
    } else {
      if (maxSelections && value.length >= maxSelections) return;
      next = [...value, opt.value];
    }
    const nextOptions = allFlat.filter((o) => next.includes(o.value));
    onSelect?.(nextOptions);
    onChange?.(next);
  };

  const removeTag = (v: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = value.filter((x) => x !== v);
    const nextOptions = allFlat.filter((o) => next.includes(o.value));
    onSelect?.(nextOptions);
    onChange?.(next);
  };

  return (
    <div ref={rootRef} className={cn("relative w-full", className)}>
      <div
        onClick={() => !disabled && setOpen((o) => !o)}
        className={cn(
          "flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-md border bg-background px-3 py-2 text-sm",
          "cursor-pointer transition-colors",
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          disabled && "cursor-not-allowed opacity-50",
          hasError ? "border-destructive" : "border-input",
          open && "ring-2 ring-ring ring-offset-2"
        )}
      >
        {selectedOptions.length === 0 && (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
        {selectedOptions.map((opt) => (
          <Badge key={opt.value} variant="secondary" className="gap-1 pr-1">
            {opt.label}
            <X
              className="h-3 w-3 cursor-pointer opacity-60 hover:opacity-100"
              onClick={(e) => removeTag(opt.value, e)}
            />
          </Badge>
        ))}
        <ChevronDown className={cn("ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
      </div>

      {open && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border bg-popover shadow-lg animate-in fade-in-0 zoom-in-95">
          {searchable && (
            <div className="flex items-center gap-2 border-b px-3 py-2">
              <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search…"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
          )}
          {maxSelections && (
            <p className="border-b px-3 py-1.5 text-xs text-muted-foreground">
              {value.length}/{maxSelections} selected
            </p>
          )}
          <div className="max-h-56 overflow-y-auto p-1">
            {filtered.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">No results found.</p>
            )}
            {filtered.map((opt) =>
              isGrouped(opt) ? (
                <div key={opt.group}>
                  <p className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {opt.group}
                  </p>
                  {opt.items.map((item) => {
                    const checked = value.includes(item.value);
                    return (
                      <MultiOption key={item.value} item={item} checked={checked} onToggle={toggle} />
                    );
                  })}
                </div>
              ) : (
                <MultiOption
                  key={(opt as FlatOption).value}
                  item={opt as FlatOption}
                  checked={value.includes((opt as FlatOption).value)}
                  onToggle={toggle}
                />
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function MultiOption({
  item,
  checked,
  onToggle,
}: {
  item: FlatOption;
  checked: boolean;
  onToggle: (o: FlatOption) => void;
}) {
  return (
    <div
      onClick={() => onToggle(item)}
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-2 rounded-sm py-1.5 px-3 text-sm",
        "hover:bg-accent hover:text-accent-foreground",
        checked && "bg-accent/50 font-medium"
      )}
    >
      <div
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
          checked ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40"
        )}
      >
        {checked && <Check className="h-3 w-3" />}
      </div>
      {item.label}
    </div>
  );
}
