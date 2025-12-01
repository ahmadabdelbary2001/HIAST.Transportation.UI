// src/components/atoms/ValidationError.tsx

import { TriangleAlert } from 'lucide-react';

interface ValidationErrorProps {
  message: string;
}

export function ValidationError({ message }: ValidationErrorProps) {
  if (!message) return null;

  return (
    <div className="flex items-center gap-2 text-sm font-medium text-destructive animate-in fade-in-0 slide-in-from-top-2">
      <TriangleAlert className="h-4 w-4" />
      <span>{message}</span>
    </div>
  );
}
