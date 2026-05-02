import { useState, useRef, type KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type Size = "sm" | "md" | "lg";
type Variant = "default" | "filled" | "ghost";

interface SearchInputProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  onPressEnter?: (value: string) => void;
  placeholder?: string;
  className?: string;
  size?: Size;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  allowClear?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  enterButton?: React.ReactNode | boolean;
}

// ─── Size tokens ──────────────────────────────────────────────────────────────

const sizeTokens: Record<Size, {
  input: string;
  icon: string;
  pl: string;   // left padding for prefix slot
  pr: string;   // right padding for suffix + button slot
  slotLeft: string;
  slotRight: string;
  btnClass: string;
}> = {
  sm: {
    input:     "h-8 text-xs rounded-md",
    icon:      "size-3.5",
    pl:        "pl-8",
    pr:        "pr-16",   // room for clear + search btn
    slotLeft:  "left-2",
    slotRight: "right-1",
    btnClass:  "h-6 w-6 rounded-sm",
  },
  md: {
    input:     "h-10 text-sm rounded-lg",
    icon:      "size-4",
    pl:        "pl-9",
    pr:        "pr-20",
    slotLeft:  "left-2.5",
    slotRight: "right-1.5",
    btnClass:  "h-7 w-7 rounded-md",
  },
  lg: {
    input:     "h-12 text-base rounded-xl",
    icon:      "size-5",
    pl:        "pl-11",
    pr:        "pr-24",
    slotLeft:  "left-3",
    slotRight: "right-2",
    btnClass:  "h-8 w-8 rounded-lg",
  },
};

// ─── Variant tokens ───────────────────────────────────────────────────────────

const variantTokens: Record<Variant, string> = {
  default: "",
  filled:  "border-transparent bg-muted hover:bg-muted/80 focus-visible:bg-background",
  ghost:   "border-transparent bg-transparent hover:bg-muted/50 focus-visible:bg-background",
};

// ─── Component ────────────────────────────────────────────────────────────────

export function SearchInput({
  value: valueProp,
  defaultValue = "",
  onChange,
  onSearch,
  onPressEnter,
  placeholder = "Search…",
  className,
  size = "md",
  variant = "default",
  disabled = false,
  loading = false,
  allowClear = true,
  prefix,
  suffix,
  enterButton = true,
}: SearchInputProps) {

  // ── Controlled / uncontrolled ──────────────────────────────────────────────
  const isControlled = valueProp !== undefined;
  const [internal, setInternal] = useState(defaultValue);
  const value = isControlled ? valueProp! : internal;

  const inputRef = useRef<HTMLInputElement>(null);
  const s = sizeTokens[size];

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setInternal(e.target.value);
    onChange?.(e.target.value);
  };

  const handleSearch = () => {
    if (disabled || loading) return;
    onSearch?.(value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onPressEnter?.(value);
      handleSearch();
    }
  };

  const handleClear = () => {
    if (!isControlled) setInternal("");
    onChange?.("");
    onSearch?.("");
    inputRef.current?.focus();
  };

  // ── Derived ───────────────────────────────────────────────────────────────
  const showButton = enterButton !== false;
  const showClear  = allowClear && !!value && !loading;
  const hasPrefix  = prefix !== undefined;

  // Left slot — custom prefix OR search icon (when no button) OR nothing
  const leftSlot = hasPrefix ? prefix : (
    !showButton
      ? (loading
          ? <Loader2 className={cn(s.icon, "animate-spin text-muted-foreground")} />
          : <Search  className={cn(s.icon, "text-muted-foreground")} />
        )
      : null
  );

  // Enter button icon content
  const btnIcon =
    loading ? <Loader2 className={cn(s.icon, "animate-spin")} />
             : enterButton === true || enterButton === undefined
               ? <Search className={s.icon} />
               : enterButton;

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className={cn("relative flex w-full items-center", className)}>

      {/* Left slot (prefix or icon) */}
      {leftSlot && (
        <span className={cn(
          "absolute z-10 flex items-center pointer-events-none",
          s.slotLeft,
        )}>
          {leftSlot}
        </span>
      )}

      {/* shadcn Input */}
      <Input
        ref={inputRef}
        type="search"
        value={value}
        disabled={disabled}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        className={cn(
          "[appearance:textfield] [&::-webkit-search-cancel-button]:hidden",
          "w-full transition-[border-color,box-shadow,background-color]",
          "placeholder:text-muted-foreground/60",
          s.input,
          variantTokens[variant],
          leftSlot  && s.pl,
          (showClear || showButton || suffix) && s.pr,
        )}
      />

      {/* Right slot — suffix + clear + search button — all inside the input */}
      <span className={cn(
        "absolute z-10 flex items-center gap-1",
        s.slotRight,
      )}>
        {/* Custom suffix */}
        {suffix && (
          <span className="text-muted-foreground">{suffix}</span>
        )}

        {/* Clear button */}
        {showClear && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            tabIndex={-1}
            onClick={handleClear}
            disabled={disabled}
            aria-label="Clear"
            className={cn(
              s.icon,
              "rounded-full p-0 text-muted-foreground hover:text-foreground hover:bg-muted/60",
            )}
          >
            <X className="size-full p-px" />
          </Button>
        )}

        {/* Search button — inside the input on the right */}
        {showButton && (
          <Button
            type="button"
            size="icon"
            tabIndex={0}
            onClick={handleSearch}
            disabled={disabled || loading}
            aria-label="Search"
            className={cn(s.btnClass, "shrink-0")}
          >
            {btnIcon}
          </Button>
        )}
      </span>

    </div>
  );
}

export default SearchInput;


// ─── Usage examples ───────────────────────────────────────────────────────────
//
// 1. Default — search button inside right edge, clear on type
//    <SearchInput onSearch={(q) => console.log(q)} />
//
// 2. No button — just icon prefix + clear
//    <SearchInput enterButton={false} />
//
// 3. Custom prefix + kbd suffix
//    <SearchInput
//      prefix={<Globe className="size-4 text-muted-foreground" />}
//      suffix={<kbd className="text-xs text-muted-foreground border rounded px-1">⌘K</kbd>}
//    />
//
// 4. Variants
//    <SearchInput variant="filled" />
//    <SearchInput variant="ghost" />
//
// 5. Sizes
//    <SearchInput size="sm" />
//    <SearchInput size="md" />   ← default
//    <SearchInput size="lg" />
//
// 6. Loading
//    <SearchInput loading />
//
// 7. Controlled
//    const [q, setQ] = useState("")
//    <SearchInput value={q} onChange={setQ} onSearch={handleSearch} />