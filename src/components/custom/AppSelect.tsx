import * as React from "react";
import { Check, ChevronsUpDown, X, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

type SelectSize = "sm" | "md" | "lg";

interface BaseProps {
  options: SelectOption[];
  placeholder?: string;
  allowClear?: boolean;
  disabled?: boolean;
  loading?: boolean;
  size?: SelectSize;
  maxTagCount?: number;
  notFoundContent?: React.ReactNode;
  className?: string;
}

interface SingleProps extends BaseProps {
  mode?: "single";
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (value: string | number | undefined) => void;
}

interface MultipleProps extends BaseProps {
  mode: "multiple";
  value?: (string | number)[];
  defaultValue?: (string | number)[];
  onChange?: (value: (string | number)[]) => void;
}

export type AppSelectProps = SingleProps | MultipleProps;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const sizeClass: Record<SelectSize, string> = {
  sm: "h-7 text-xs px-2",
  md: "h-9 text-sm px-3",
  lg: "h-11 text-base px-4",
};

function normalise(
  val: string | number | (string | number)[] | undefined
): (string | number)[] {
  if (val == null) return [];
  return Array.isArray(val) ? val : [val];
}

// ─── Component ────────────────────────────────────────────────────────────────

export const AppSelect: React.FC<AppSelectProps> = (props) => {
  const {
    options = [],
    placeholder = "Select...",
    allowClear = false,
    disabled = false,
    loading = false,
    size = "md",
    maxTagCount,
    notFoundContent = "No results found.",
    className,
  } = props;

  const isMultiple = props.mode === "multiple";

  // ── Controlled vs Uncontrolled ────────────────────────────────────────────
  // - `value` prop provided  → controlled (external state drives UI)
  // - only `defaultValue`    → uncontrolled (internal state, fires onChange)
  // - neither                → uncontrolled, empty initial state

  const isControlled = props.value !== undefined;

  const [internalValues, setInternalValues] = React.useState<
    (string | number)[]
  >(() => {
    if (isMultiple) return normalise((props as MultipleProps).defaultValue);
    return normalise((props as SingleProps).defaultValue);
  });

  const selectedValues: (string | number)[] = isControlled
    ? normalise(
      props.value as SingleProps["value"] | MultipleProps["value"]
    )
    : internalValues;

  const [open, setOpen] = React.useState(false);

  // ── Search state — we manage it ourselves so we can filter by label ───────
  const [search, setSearch] = React.useState("");

  const filteredOptions = React.useMemo(() => {
    if (!search.trim()) return options;
    const q = search.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, search]);

  const isSelected = (val: string | number) => selectedValues.includes(val);
  const selectedOptions = options.filter((o) =>
    selectedValues.includes(o.value)
  );

  // ── Core select handler ───────────────────────────────────────────────────

  const commit = (next: (string | number)[]) => {
    if (!isControlled) setInternalValues(next);

    if (isMultiple) {
      (props as MultipleProps).onChange?.(next);
    } else {
      (props as SingleProps).onChange?.(next[0]);
    }
  };

  const handleSelect = (opt: SelectOption) => {
    if (opt.disabled) return;

    let next: (string | number)[];

    if (isMultiple) {
      next = isSelected(opt.value)
        ? selectedValues.filter((v) => v !== opt.value)
        : [...selectedValues, opt.value];
    } else {
      next = isSelected(opt.value) ? [] : [opt.value];
      setOpen(false);
    }

    commit(next);
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    commit([]);
  };

  const handleRemoveTag = (val: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    commit(selectedValues.filter((v) => v !== val));
  };

  const handleOpenChange = (next: boolean) => {
    if (disabled || loading) return;
    setOpen(next);
    // reset search when closing
    if (!next) setSearch("");
  };

  // ── Tag overflow ──────────────────────────────────────────────────────────

  let visibleTags = selectedOptions;
  let overflowCount = 0;
  if (
    isMultiple &&
    maxTagCount != null &&
    selectedOptions.length > maxTagCount
  ) {
    visibleTags = selectedOptions.slice(0, maxTagCount);
    overflowCount = selectedOptions.length - maxTagCount;
  }

  const hasClear = allowClear && selectedValues.length > 0 && !disabled;
  const singleLabel = !isMultiple ? selectedOptions[0]?.label : undefined;

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between font-normal",
            isMultiple && selectedValues.length > 0
              ? "h-auto min-h-9 py-1.5"
              : "",
            sizeClass[size],
            className
          )}
        >
          {/* Trigger content */}
          <span className="flex flex-wrap gap-1 flex-1 min-w-0 items-center">
            {isMultiple ? (
              visibleTags.length > 0 ? (
                <>
                  {visibleTags.map((o) => (
                    <Badge
                      key={o.value}
                      variant="secondary"
                      className="text-xs gap-1 pr-1"
                    >
                      {o.label}
                      {!disabled && (
                        <span
                          className="hover:text-destructive cursor-pointer"
                          onMouseDown={(e) => handleRemoveTag(o.value, e)}
                        >
                          <X className="h-3 w-3" />
                        </span>
                      )}
                    </Badge>
                  ))}
                  {overflowCount > 0 && (
                    <Badge variant="outline" className="text-xs">
                      +{overflowCount}
                    </Badge>
                  )}
                </>
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )
            ) : (
              <span
                className={cn(
                  "truncate",
                  !singleLabel && "text-muted-foreground"
                )}
              >
                {singleLabel ?? placeholder}
              </span>
            )}
          </span>

          {/* Suffix icons */}
          <span className="flex items-center gap-1 ml-2 shrink-0 text-muted-foreground">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                {hasClear && (
                  <span
                    className="hover:text-foreground transition-colors"
                    onMouseDown={handleClearAll}
                  >
                    <X className="h-3.5 w-3.5" />
                  </span>
                )}
                <ChevronsUpDown className="h-4 w-4 opacity-50" />
              </>
            )}
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-(--radix-popover-trigger-width) p-0"
        align="start"
      >
        <Command
          // Disable cmdk's built-in filtering — we handle it ourselves
          // so searching "Next.js" matches the label, not the numeric value
          shouldFilter={false}
        >
          <CommandInput
            placeholder="Search..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {filteredOptions.length === 0 ? (
              <CommandEmpty>{notFoundContent}</CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredOptions.map((opt) => (
                  <CommandItem
                    key={opt.value}
                    // Use label as the cmdk value so keyboard nav works by label
                    value={opt.label}
                    disabled={opt.disabled}
                    onSelect={() => handleSelect(opt)}
                    className={cn(
                      "cursor-pointer rounded-sm",
                      "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground",
                      "hover:bg-accent hover:text-accent-foreground",
                      "transition-colors"
                    )}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isSelected(opt.value) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {opt.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default AppSelect;


// ─── Usage examples ───────────────────────────────────────────────────────────
//
// CONTROLLED (single)
//   const [val, setVal] = useState<string | number>();
//   <AppSelect options={opts} value={val} onChange={setVal} />
//
// CONTROLLED (multiple)
//   const [vals, setVals] = useState<(string | number)[]>([]);
//   <AppSelect options={opts} mode="multiple" value={vals} onChange={setVals} allowClear />
//
// UNCONTROLLED (single) — internal state, fires onChange for side-effects
//   <AppSelect options={opts} defaultValue={1} onChange={(v) => console.log(v)} />
//
// UNCONTROLLED (multiple)
//   <AppSelect options={opts} mode="multiple" defaultValue={[1, 2]} />
//
// With maxTagCount overflow badge
//   <AppSelect options={opts} mode="multiple" value={vals} onChange={setVals} maxTagCount={2} />
//
// Loading / disabled
//   <AppSelect options={opts} loading />
//   <AppSelect options={opts} disabled />