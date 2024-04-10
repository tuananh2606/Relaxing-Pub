import * as React from 'react';

import { cn } from '~/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

interface IInput {
  radius?: 'sm' | 'md' | 'lg' | 'xl';
  endContent?: JSX.Element;
}

const Input = React.forwardRef<HTMLInputElement, InputProps & IInput>(
  ({ className, endContent, radius, type, ...props }, ref) => {
    const radiusStyle = (radius?: string) => {
      switch (radius) {
        case 'sm':
          return 'rounded-sm';
        case 'md':
          return 'rounded-md';
        case 'lg':
          return 'rounded-lg';
        case 'xl':
          return 'rounded-xl';
      }
    };
    return (
      <div
        className={cn(
          'flex border-1 bg-default-100 px-3 py-2 focus-within:ring-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
          radiusStyle(radius),
        )}
      >
        <input
          type={type}
          className={cn(
            'flex h-9 w-full flex-1 border-none bg-transparent px-3 py-1 text-sm shadow-sm outline-none transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          ref={ref}
          {...props}
        />
        {endContent}
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input };
