// src/components/atoms/Logo.tsx

import { Bus } from 'lucide-react';

export function Logo() {

  return (
    <div className={`flex items-center gap-2`}>
      <div className="rounded-lg bg-primary p-2">
        <Bus className="h-6 w-6 text-primary-foreground" />
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-bold leading-tight">HIAST Transportation</span>
        <span className="text-xs text-muted-foreground">HIAST</span>
      </div>
    </div>
  );
}