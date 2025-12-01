// src/components/ui/input.tsx

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { ValidationError } from '@/components/atoms/ValidationError';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  forceLtr?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, required, forceLtr = false, ...props }, ref) => {
    const { t } = useTranslation();
    const [errorMessage, setErrorMessage] = React.useState('');

    const handleInvalid = (e: React.FormEvent<HTMLInputElement>) => {
      e.preventDefault();
      const target = e.target as HTMLInputElement;
      if (required && target.validity.valueMissing) {
        setErrorMessage(t('common.validation.required'));
      }
    };

    const handleInput = () => {
      if (errorMessage) {
        setErrorMessage('');
      }
    };

    return (
      <div className="space-y-2">
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-md px-3 py-2 text-base md:text-sm',
            forceLtr ? 'text-left' : 'text-start',
            'border border-muted bg-transparent ring-offset-background',
            'transition-colors duration-200 ease-in-out',
            'placeholder:text-muted-foreground/60',
            errorMessage ? 'border-destructive' : 'focus-visible:border-primary',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
            className
          )}
          ref={ref}
          required={required}
          onInvalid={handleInvalid}
          onInput={handleInput}
          dir={forceLtr ? 'ltr' : undefined}
          {...props}
        />
        <ValidationError message={errorMessage} />
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
