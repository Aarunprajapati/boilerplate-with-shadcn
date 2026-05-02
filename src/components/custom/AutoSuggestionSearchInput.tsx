import { useState, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Search, X, Clock, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

/* ───────────────── TYPES ───────────────── */

export type SuggestionType = "recent" | "trending" | "result";

export interface SearchItem {
  label: string;
  type?: SuggestionType;
}

export interface SearchInputProps {
  placeholder?: string;
  recent?: SearchItem[];
  suggestions?: SearchItem[];
  onSearch?: (query: string) => void;
  onClear?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "ghost";
  disabled?: boolean;
}

/* ───────────────── COMPONENT ───────────────── */

export function AutoSuggestionSearchInput({
  placeholder = "Search…",
  recent = [],
  suggestions = [],
  onSearch,
  onClear,
  className,
  size = "md",
  variant = "default",
  disabled = false,
}: SearchInputProps) {
  const [query, setQuery] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const sizeMap = {
    sm: {
      input: "py-2 text-xs pl-9 pr-16",
      icon: "w-3.5 h-3.5 left-3",
      btn: "h-6 px-2 text-[11px]",
    },
    md: {
      input: "py-5 text-sm pl-10 pr-20",
      icon: "w-4 h-4 left-3.5",
      btn: "h-7 px-3 text-xs",
    },
    lg: {
      input: "py-6 text-base pl-12 pr-24",
      icon: "w-5 h-5 left-4",
      btn: "h-8 px-4 text-sm",
    },
  };

  const s = sizeMap[size];

  const filtered: SearchItem[] | null = query.trim()
    ? [...recent, ...suggestions].filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase())
      )
    : null;

  const handleSelect = useCallback(
    (value: string) => {
      setQuery(value);
      setOpen(false);
      onSearch?.(value);
    },
    [onSearch]
  );

  const handleSubmit = useCallback(() => {
    if (!query.trim()) return;
    handleSelect(query.trim());
  }, [query, handleSelect]);

  const handleClear = useCallback(() => {
    setQuery("");
    onClear?.();
    inputRef.current?.focus();
  }, [onClear]);


  const shouldRenderContent =
  !disabled &&
  (filtered
    ? filtered.length > 0
    : recent.length > 0 || suggestions.length > 0);


  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className={cn("relative flex items-center group w-full", className)}>
          {/* Glow */}
          <div className="absolute inset-0 rounded-xl bg-indigo-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-lg pointer-events-none" />

          {/* Icon */}
          <Search
            className={cn(
              "absolute z-10 text-muted-foreground group-focus-within:text-indigo-400 transition-colors",
              s.icon
            )}
          />

          <Input
            ref={inputRef}
            value={query}
            disabled={disabled}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter") handleSubmit();
              if (e.key === "Escape") setOpen(false);
            }}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className={cn(
              "w-full rounded-xl transition-all",
              variant === "ghost"
                ? "bg-transparent border-transparent focus-visible:border-indigo-400 focus-visible:bg-muted/30"
                : "bg-background border-border focus-visible:ring-1 focus-visible:ring-indigo-400 focus-visible:border-indigo-400/60",
              s.input
            )}
          />

          {/* Actions */}
          <div className="absolute right-2 flex items-center gap-1 z-10">
            {query && (
              <Button
                size="icon"
                variant="ghost"
                onClick={handleClear}
                disabled={disabled}
                className="h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <X className="w-3 h-3" />
              </Button>
            )}

            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={disabled || !query.trim()}
              className={cn(
                "bg-indigo-500 hover:bg-indigo-400 text-white font-semibold rounded-lg transition-all disabled:opacity-40",
                s.btn
              )}
            >
              Search
            </Button>
          </div>
        </div>
      </PopoverTrigger>

    { shouldRenderContent && <PopoverContent
        className="w-(--radix-popover-trigger-width) p-0 rounded-xl shadow-xl border-border bg-popover"
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <Command className="bg-transparent">
          <CommandList className="max-h-64">
            {filtered ? (
              <>
                {filtered.length === 0 && (
                  <CommandEmpty className="py-8 text-center text-sm text-muted-foreground">
                    No results for &ldquo;{query}&rdquo;
                  </CommandEmpty>
                )}

                {filtered.length > 0 && (
                  <CommandGroup heading={<GroupLabel>Results</GroupLabel>}>
                    {filtered.map((item, i) => (
                      <SuggestionItem
                        key={i}
                        item={{ ...item, type: item.type ?? "result" }}
                        onSelect={handleSelect}
                        showBadge
                      />
                    ))}
                  </CommandGroup>
                )}
              </>
            ) : (
              <>
                {recent.length > 0 && (
                  <CommandGroup heading={<GroupLabel>Recent</GroupLabel>}>
                    {recent.map((item, i) => (
                      <SuggestionItem
                        key={i}
                        item={{ ...item, type: "recent" }}
                        onSelect={handleSelect}
                      />
                    ))}
                  </CommandGroup>
                )}

                {recent.length > 0 && suggestions.length > 0 && (
                  <div className="h-px bg-border mx-3" />
                )}

                {suggestions.length > 0 && (
                  <CommandGroup heading={<GroupLabel>Trending</GroupLabel>}>
                    {suggestions.map((item, i) => (
                      <SuggestionItem
                        key={i}
                        item={{ ...item, type: "trending" }}
                        onSelect={handleSelect}
                      />
                    ))}
                  </CommandGroup>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>}
    </Popover>
  );
}

/* ───────────────── SUB COMPONENTS ───────────────── */

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-semibold">
      {children}
    </span>
  );
}

interface SuggestionItemProps {
  item: SearchItem;
  onSelect: (value: string) => void;
  showBadge?: boolean;
}

function SuggestionItem({
  item,
  onSelect,
  showBadge = false,
}: SuggestionItemProps) {
  const isRecent = item.type === "recent";

  return (
    <CommandItem
      onSelect={() => onSelect(item.label)}
      className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground cursor-pointer aria-selected:bg-muted rounded-lg mx-1 my-0.5"
    >
      {isRecent ? (
        <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
      ) : (
        <TrendingUp className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
      )}

      <span className="flex-1 truncate">{item.label}</span>

      {showBadge && (
        <Badge
          variant="secondary"
          className="text-[10px] px-1.5 py-0 h-4 font-normal"
        >
          {item.type ?? "result"}
        </Badge>
      )}
    </CommandItem>
  );
}