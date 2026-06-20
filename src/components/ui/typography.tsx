import type { FunctionComponent, ElementType, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '#/lib/utils';

/**
 * Types
 */

type TypographyAs =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'p'
  | 'span'
  | 'label';

interface TypographyProps extends VariantProps<typeof typographyVariants> {
  as?: TypographyAs;
  children: ReactNode;
  className?: string;
  role?: string;
  uppercase?: boolean;
}

/**
 * Constants
 */

const DEFAULT_ELEMENT: Record<string, TypographyAs> = {
  display: 'h1',
  heading: 'h2',
  label: 'label',
  body: 'p',
  'nav-link': 'span',
  'nav-tab': 'span',
  logo: 'span',
};

/**
 * Variants
 */

const typographyVariants = cva('', {
  variants: {
    family: {
      sans: 'font-sans',
      heading: 'font-heading italic',
    },
    size: {
      '2xs': 'text-[10px]',
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      md: 'text-[18px] leading-tight',
      lg: 'text-xl',
      xl: 'text-2xl',
      '2xl': 'text-4xl',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      black: 'font-black',
      bold: 'font-bold',
    },
    transform: {
      none: '',
      uppercase: 'uppercase',
    },
    tracking: {
      normal: '',
      tight: 'tracking-tight',
      tighter: 'tracking-tighter',
      wider: 'tracking-wider',
      widest: 'tracking-widest',
    },
  },
  defaultVariants: {
    family: 'sans',
    size: 'sm',
    weight: 'normal',
    transform: 'none',
    tracking: 'normal',
  },
});

/**
 * Typography
 */

export const Typography: FunctionComponent<TypographyProps> = ({
  as,
  family,
  size,
  weight,
  transform,
  tracking,
  uppercase,
  className,
  role,
  children,
}) => {
  const Component: ElementType = as ?? DEFAULT_ELEMENT[family ?? 'body'] ?? 'p';
  return (
    <Component
      role={role}
      className={cn(
        typographyVariants({
          family,
          size,
          weight,
          transform: uppercase ? 'uppercase' : transform,
          tracking,
          className,
        })
      )}
    >
      {children}
    </Component>
  );
};
