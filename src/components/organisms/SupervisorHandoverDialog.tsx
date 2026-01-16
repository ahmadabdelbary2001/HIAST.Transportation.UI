import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UserCog, AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SupervisorHandoverDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (newSupervisorId: string) => void;
  candidates: { id: string; name: string }[];
}

export function SupervisorHandoverDialog({
  open,
  onOpenChange,
  onConfirm,
  candidates,
}: SupervisorHandoverDialogProps) {
  const { t } = useTranslation();
  const [selectedId, setSelectedId] = useState<string>('');

  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    if (selectedId) {
      onConfirm(selectedId);
      setSelectedId(''); // Reset selection after confirm
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedId(''); // Reset selection when closing
    }
    onOpenChange(open);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
              <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-500" />
            </div>
            <div className="flex-1 space-y-1">
              <AlertDialogTitle className="text-xl">
                {t('supervisor.handoverTitle')}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-base leading-relaxed">
                {t('supervisor.handoverDescription')}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <div className="space-y-4 pt-2">
          {candidates.length === 0 ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {t('supervisor.noCandidates')}
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-3">
              <Label htmlFor="supervisor-select" className="text-base font-medium">
                {t('supervisor.selectNewSupervisor')}
              </Label>
              <Select value={selectedId} onValueChange={setSelectedId}>
                <SelectTrigger id="supervisor-select" className="h-11">
                  <SelectValue placeholder={t('supervisor.selectPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {candidates.map((candidate) => (
                    <SelectItem key={candidate.id} value={candidate.id} className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          <UserCog className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium">{candidate.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <AlertDialogFooter className="gap-2 sm:gap-2">
          <AlertDialogCancel>
            {t('common.actions.cancel')}
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            disabled={!selectedId || candidates.length === 0}
            className="min-w-[120px]"
          >
            {t('common.actions.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
