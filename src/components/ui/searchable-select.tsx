import { useEffect, useRef, useState, type FunctionComponent } from 'react';
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
  disabled?: boolean;
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

export const SearchableSelect: FunctionComponent<SearchableSelectProps> = ({
  value,
  placeholder,
  results,
  isSearching,
  onSearch,
  onChange,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [wrapperRef, popupWidth] = usePopoverWidth();

  const handleSelect = (selectedValue: string): void => {
    onChange(selectedValue);
    setOpen(false);
    setInputValue('');
  };

  const textColor = value ? 'text-on-surface' : 'text-gray-500';

  const shouldShowCreate =
    !isSearching && results.length === 0 && inputValue.length >= 2;

  const shouldShowEmpty =
    !isSearching && results.length === 0 && inputValue.length < 2;

  return (
    <div ref={wrapperRef}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
        >
          <span className={textColor}>{value || placeholder}</span>
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
              {shouldShowEmpty && (
                <CommandEmpty>Type at least 2 characters</CommandEmpty>
              )}
              {shouldShowCreate && (
                <CommandItem onSelect={() => handleSelect(inputValue)}>
                  Create &ldquo;{inputValue}&rdquo;
                </CommandItem>
              )}
              <CommandGroup>
                {results.map(result => (
                  <CommandItem
                    key={result.id}
                    value={result.name}
                    onSelect={() => handleSelect(result.name)}
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        value === result.name ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                    {result.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
