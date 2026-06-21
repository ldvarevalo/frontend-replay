import {
  useEffect,
  useRef,
  useState,
  type FunctionComponent,
  type ReactNode,
} from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import type { LookupResult } from '#/repositories/types';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './command';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

/** Types */

interface SearchableSelectProps {
  value: string;
  placeholder: string;
  results: LookupResult[];
  isSearching: boolean;
  onSearch: (query: string) => void;
  onChange: (value: string) => void;
  onSelect?: (item: LookupResult) => void;
  emptyMessage?: ReactNode;
  disabled?: boolean;
}

interface ResultRowProps {
  item: LookupResult;
}

/** SearchableSelect */

const usePopoverWidth = (): [
  React.RefObject<HTMLDivElement | null>,
  number | undefined,
] => {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (ref.current) {
      setWidth(ref.current.offsetWidth);
    }
  }, []);

  return [ref, width];
};

const ResultRow: FunctionComponent<ResultRowProps> = ({ item }) => {
  if (!item.thumbnail && !item.subtitle) {
    return <span>{item.name}</span>;
  }

  return (
    <div className="flex items-center gap-2">
      {item.thumbnail && (
        <img
          src={item.thumbnail}
          alt={item.name}
          className="size-10 shrink-0 object-cover"
        />
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate">{item.name}</span>
        {item.subtitle && (
          <span className="truncate text-xs text-on-surface-variant">
            {item.subtitle}
          </span>
        )}
      </div>
    </div>
  );
};

export const SearchableSelect: FunctionComponent<SearchableSelectProps> = ({
  value,
  placeholder,
  results,
  isSearching,
  onSearch,
  onChange,
  onSelect,
  emptyMessage,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [wrapperRef, popupWidth] = usePopoverWidth();

  const handleSelect = (item: LookupResult): void => {
    onChange(item.name);
    onSelect?.(item);
    setOpen(false);
    setInputValue('');
  };

  const handleCreateSelect = (): void => {
    handleSelect({
      id: `__create__${inputValue}`,
      name: inputValue,
    });
  };

  const shouldShowCreate = (): boolean =>
    !isSearching &&
    results.length === 0 &&
    inputValue.length >= 2 &&
    !emptyMessage;

  const shouldShowEmpty = (): boolean =>
    !isSearching && results.length === 0 && inputValue.length < 2;

  const shouldShowEmptyMessage = (): boolean =>
    !isSearching &&
    results.length === 0 &&
    inputValue.length >= 2 &&
    emptyMessage !== undefined;

  const renderResultItem = (result: LookupResult): ReactNode => {
    const isSelected = value === result.name;
    return (
      <CommandItem
        key={result.id}
        value={result.name}
        onSelect={() => handleSelect(result)}
        className="border-b border-outline/15 last:border-b-0"
      >
        <Check
          className={`mr-2 h-4 w-4 ${isSelected ? 'opacity-100' : 'opacity-0'}`}
        />
        <ResultRow item={result} />
      </CommandItem>
    );
  };

  return (
    <div ref={wrapperRef}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
        >
          <span className={value ? 'text-on-surface' : 'text-gray-500'}>
            {value || placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </PopoverTrigger>
        <PopoverContent
          className="p-0"
          style={popupWidth ? { width: popupWidth } : undefined}
        >
          <Command shouldFilter={false}>
            <CommandInput
              autoFocus
              placeholder={placeholder}
              value={inputValue}
              onValueChange={q => {
                setInputValue(q);
                onSearch(q);
              }}
            />
            <CommandList>
              {isSearching && <CommandItem disabled>Searching...</CommandItem>}
              {shouldShowEmpty() && (
                <CommandEmpty>Type at least 2 characters</CommandEmpty>
              )}
              {shouldShowCreate() && (
                <CommandItem onSelect={handleCreateSelect}>
                  Create &ldquo;{inputValue}&rdquo;
                </CommandItem>
              )}
              {shouldShowEmptyMessage() && (
                <CommandEmpty>{emptyMessage}</CommandEmpty>
              )}
              <CommandGroup>{results.map(renderResultItem)}</CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
