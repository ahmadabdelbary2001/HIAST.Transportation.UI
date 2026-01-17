import { Toaster } from 'sonner';
import { useLanguage } from '@/hooks/useLanguage';

export function GlobalToaster() {
  const { isRTL } = useLanguage();
  return (
    <Toaster 
      dir={isRTL ? 'rtl' : 'ltr'} 
      position="top-center" 
      richColors 
      closeButton
      theme="system"
      className="toaster-group"
    />
  );
}
