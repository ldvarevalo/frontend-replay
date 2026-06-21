import * as React from 'react';
import { Select as SelectPrimitive } from '@base-ui/react/select';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

import { cn } from '#/lib/utils';

/**
 * SelectValue
 */

const SelectValue = ({
  className,
  ...props
}: SelectPrimitive.Value.Props): React.JSX.Element => (
  <SelectPrimitive.Value
    data-slot="select-value"
    className={cn('flex flex-1 text-left', className)}
    {...props}
  />
);

/**
 * SelectScrollUpButton
 */

const SelectScrollUpButton = ({
  className,
  ...props
}: React.ComponentProps<
  typeof SelectPrimitive.ScrollUpArrow
>): React.JSX.Element => (
  <SelectPrimitive.ScrollUpArrow
    data-slot="select-scroll-up-button"
    className={cn(
      "top-0 z-10 flex w-full cursor-default items-center justify-center bg-surface-container-high py-1 [&_svg:not([class*='size-'])]:size-4",
      className
    )}
    {...props}
  >
    <ChevronUpIcon />
  </SelectPrimitive.ScrollUpArrow>
);

/**
 * SelectScrollDownButton
 */

const SelectScrollDownButton = ({
  className,
  ...props
}: React.ComponentProps<
  typeof SelectPrimitive.ScrollDownArrow
>): React.JSX.Element => (
  <SelectPrimitive.ScrollDownArrow
    data-slot="select-scroll-down-button"
    className={cn(
      "bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-surface-container-high py-1 [&_svg:not([class*='size-'])]:size-4",
      className
    )}
    {...props}
  >
    <ChevronDownIcon />
  </SelectPrimitive.ScrollDownArrow>
);

/**
 * SelectTrigger
 */

const SelectTrigger = ({
  className,
  size = 'default',
  children,
  ...props
}: SelectPrimitive.Trigger.Props & {
  size?: 'sm' | 'default';
}): React.JSX.Element => (
  <SelectPrimitive.Trigger
    data-slot="select-trigger"
    data-size={size}
    className={cn(
      "flex h-16 w-full items-center justify-between border-none border-b-2 border-transparent bg-surface-container-lowest px-8 text-on-surface font-label uppercase tracking-widest text-sm transition-all outline-none select-none focus:border-primary focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 data-placeholder:text-gray-500 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon
      render={
        <ChevronDownIcon className="pointer-events-none size-4 text-muted-foreground" />
      }
    />
  </SelectPrimitive.Trigger>
);

/**
 * SelectContent
 */

const SelectContent = ({
  className,
  children,
  side = 'bottom',
  sideOffset = 4,
  align = 'center',
  alignOffset = 0,
  alignItemWithTrigger = true,
  ...props
}: SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    'align' | 'alignOffset' | 'side' | 'sideOffset' | 'alignItemWithTrigger'
  >): React.JSX.Element => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Positioner
      side={side}
      sideOffset={sideOffset}
      align={align}
      alignOffset={alignOffset}
      alignItemWithTrigger={alignItemWithTrigger}
      className="isolate z-50"
    >
      <SelectPrimitive.Popup
        data-slot="select-content"
        data-align-trigger={alignItemWithTrigger}
        className={cn(
          'relative isolate z-50 max-h-(--available-height) w-(--anchor-width) min-w-36 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-surface-container-high text-on-surface shadow-md duration-100 data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
          className
        )}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.List>{children}</SelectPrimitive.List>
        <SelectScrollDownButton />
      </SelectPrimitive.Popup>
    </SelectPrimitive.Positioner>
  </SelectPrimitive.Portal>
);

/**
 * SelectLabel
 */

const SelectLabel = ({
  className,
  ...props
}: SelectPrimitive.GroupLabel.Props): React.JSX.Element => (
  <SelectPrimitive.GroupLabel
    data-slot="select-label"
    className={cn('px-1.5 py-1 text-xs text-muted-foreground', className)}
    {...props}
  />
);

/**
 * SelectItem
 */

const SelectItem = ({
  className,
  children,
  ...props
}: SelectPrimitive.Item.Props): React.JSX.Element => (
  <SelectPrimitive.Item
    data-slot="select-item"
    className={cn(
      "relative flex w-full cursor-default items-center gap-1.5 rounded-md py-3 pr-8 pl-1.5 text-sm outline-hidden select-none not-data-[selected]:hover:bg-accent not-data-[selected]:hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-[selected]:bg-primary-container data-[selected]:text-on-primary-container data-[selected]:focus:bg-primary-container/90 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg]:text-on-primary-container *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
      className
    )}
    {...props}
  >
    <SelectPrimitive.ItemText className="flex flex-1 shrink-0 gap-2 whitespace-nowrap">
      {children}
    </SelectPrimitive.ItemText>
    <SelectPrimitive.ItemIndicator
      render={
        <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center" />
      }
    >
      <CheckIcon className="pointer-events-none" />
    </SelectPrimitive.ItemIndicator>
  </SelectPrimitive.Item>
);

/**
 * SelectSeparator
 */

const SelectSeparator = ({
  className,
  ...props
}: SelectPrimitive.Separator.Props): React.JSX.Element => (
  <SelectPrimitive.Separator
    data-slot="select-separator"
    className={cn('pointer-events-none -mx-1 my-1 h-px bg-border', className)}
    {...props}
  />
);

/**
 * SelectGroup
 */

const SelectGroup = ({
  className,
  ...props
}: SelectPrimitive.Group.Props): React.JSX.Element => (
  <SelectPrimitive.Group
    data-slot="select-group"
    className={cn('scroll-my-1 p-1', className)}
    {...props}
  />
);

const Select = SelectPrimitive.Root;

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
