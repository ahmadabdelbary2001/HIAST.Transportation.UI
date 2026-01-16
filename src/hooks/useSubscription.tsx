import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { employeeApiService } from '@/services/employeeApiService';
import { lineSubscriptionApiService } from '@/services/lineSubscriptionApiService';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
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

export const useSubscription = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  
  // State for current subscription
  const [activeLineId, setActiveLineId] = useState<number | null>(null);
  const [activeSubscriptionId, setActiveSubscriptionId] = useState<number | null>(null);

  // Dialog State
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingSubscription, setPendingSubscription] = useState<{ lineId: number, lineName: string, onSuccess?: () => void } | null>(null);
  const [oldLineName, setOldLineName] = useState<string>('');
  const [oldSubscriptionId, setOldSubscriptionId] = useState<number | null>(null);
  
  // New state for Unsubscribe confirmation
  const [showUnsubscribeConfirm, setShowUnsubscribeConfirm] = useState(false);
  const [pendingUnsubscribeSuccess, setPendingUnsubscribeSuccess] = useState<(() => void) | undefined>(undefined);

  // Check subscription status
  const checkSubscriptionStatus = useCallback(async () => {
      if (!user || !user.id) return;
      try {
          const employee = await employeeApiService.getById(user.id);
          if (employee.isSubscriptionActive && employee.lineSubscriptionId && employee.subscribedLineId) {
              setActiveLineId(employee.subscribedLineId);
              setActiveSubscriptionId(employee.lineSubscriptionId);
              setOldLineName(employee.subscribedLineName || '');
          } else {
              setActiveLineId(null);
              setActiveSubscriptionId(null);
              setOldLineName('');
          }
      } catch (error) {
          console.error("Failed to check subscription status", error);
      }
  }, [user]);

  // Initial check
  useState(() => {
      checkSubscriptionStatus();
  });


  const performSubscription = useCallback(async (lineId: number, lineName: string, userId: string, onSuccess?: () => void) => {
      try {
        setLoading(true);
        await lineSubscriptionApiService.create({
            employeeId: userId,
            lineId: lineId,
            startDate: new Date().toISOString(),
            isActive: true
        });

        toast.success(t('subscription.subscribeSuccess', { lineName }));
        await checkSubscriptionStatus(); // Refresh status
        if (onSuccess) onSuccess();
      } catch(error) {
        console.error('Subscription creation error:', error);
        toast.error(t('common.messages.error'));
      } finally {
        setLoading(false);
      }
  }, [t, checkSubscriptionStatus]);

  const subscribeToLine = useCallback(async (lineId: number, lineName: string, onSuccess?: () => void) => {
    if (!user || !user.id) return;

    try {
      setLoading(true);
      // 1. Fetch latest employee data to check for existing subscriptions
      const employee = await employeeApiService.getById(user.id);

      // 2. Check if already subscribed
      if (employee.isSubscriptionActive && employee.lineSubscriptionId) {
          // If trying to subscribe to the SAME line, do nothing (or show message)
          if (employee.subscribedLineId === lineId) {
              setLoading(false);
              return;
          }

        // Trigger Switch Dialog
        setOldLineName(employee.subscribedLineName || '');
        setOldSubscriptionId(employee.lineSubscriptionId);
        setPendingSubscription({ lineId, lineName, onSuccess });
        setShowConfirm(true);
        setLoading(false); // Stop loading while waiting for user confirmation
        return;
      }

      // 4. Create new subscription (if no existing one)
      await performSubscription(lineId, lineName, user.id, onSuccess);

    } catch (error) {
      console.error('Subscription check error:', error);
      toast.error(t('common.messages.error'));
      setLoading(false);
    }
  }, [user, t, performSubscription]);

  const confirmSubscriptionSwitch = async () => {
      if (!pendingSubscription || !user || !user.id || !oldSubscriptionId) return;

      try {
          setLoading(true);
          setShowConfirm(false); // Close dialog immediately

          // 3. Delete old subscription
          await lineSubscriptionApiService.delete(oldSubscriptionId);
          
          // 4. Create new subscription
          await performSubscription(pendingSubscription.lineId, pendingSubscription.lineName, user.id, pendingSubscription.onSuccess);

      } catch (error: unknown) {
          console.error("Error switching subscription", error);
          const errorMessage = error instanceof Error ? error.message : String(error);
          
          if (errorMessage.includes('403')) {
               toast.error(t('common.messages.forbiddenAction'));
          } else {
               toast.error(t('subscription.errorCancellingOld'));
          }
          setLoading(false);
      } finally {
          setPendingSubscription(null);
          setOldSubscriptionId(null);
      }
  };

  const cancelSubscriptionSwitch = () => {
      setShowConfirm(false);
      setPendingSubscription(null);
      setOldSubscriptionId(null);
  }

  // Unsubscribe Logic
  const unsubscribe = async (onSuccess?: () => void) => {
      setPendingUnsubscribeSuccess(() => onSuccess);
      setShowUnsubscribeConfirm(true);
  };

  const confirmUnsubscribe = async () => {
      if (!activeSubscriptionId) return;
      try {
          setLoading(true);
          setShowUnsubscribeConfirm(false);
          await lineSubscriptionApiService.delete(activeSubscriptionId);
          toast.success(t('common.messages.deleteSuccess')); 
          await checkSubscriptionStatus(); // Refresh status
          
          if (pendingUnsubscribeSuccess) {
              pendingUnsubscribeSuccess();
          }

          setActiveLineId(null);
          setActiveSubscriptionId(null);
      } catch (error) {
           console.error("Error unsubscribing", error);
           toast.error(t('common.messages.error'));
      } finally {
          setLoading(false);
          setPendingUnsubscribeSuccess(undefined);
      }
  };

  const SubscriptionDialog = () => (
    <>
        {/* Switch Dialog */}
        <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>{t('subscription.confirmSwitchTitle', { defaultValue: 'Switch Subscription' })}</AlertDialogTitle>
            <AlertDialogDescription>
                {t('subscription.confirmSwitch', { 
                    oldLine: oldLineName, 
                    newLine: pendingSubscription?.lineName 
                })}
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelSubscriptionSwitch}>{t('common.actions.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={(e) => {
                e.preventDefault(); 
                confirmSubscriptionSwitch();
            }}>
                {t('common.actions.confirm')}
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialog>

        {/* Unsubscribe Confirmation Dialog */}
        <AlertDialog open={showUnsubscribeConfirm} onOpenChange={setShowUnsubscribeConfirm}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t('common.actions.cancelSubscription')}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('common.messages.confirmDeleteItem', { item: t('subscription.singular') })}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setShowUnsubscribeConfirm(false)}>{t('common.actions.cancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={(e) => {
                        e.preventDefault();
                        confirmUnsubscribe();
                    }} className="bg-destructive hover:bg-destructive/90">
                        {t('common.actions.confirm')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </>
  );

  return {
    subscribeToLine,
    unsubscribe,
    activeLineId,
    loading,
    SubscriptionDialog,
    checkSubscriptionStatus,
    activeSubscriptionId
  };
};
