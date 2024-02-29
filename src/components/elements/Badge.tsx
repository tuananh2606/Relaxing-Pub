import * as React from 'react';
// import { cva, type VariantProps } from 'class-variance-authority';
import { tv, type VariantProps } from 'tailwind-variants';
import { cn } from '~/utils/misc';

const badgeVariants = tv({
  base: 'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none cursor-pointer',
  variants: {
    variant: {
      default: 'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
      secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
      movie: 'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
      anime: 'border-transparent bg-anime text-secondary-foreground hover:bg-anime/80',
      destructive: 'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
      outline: 'text-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
Badge.displayName = 'Badge';

export { Badge, badgeVariants };