import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { employeeApiService } from '@/services/employeeApiService';
import { lineSubscriptionApiService } from '@/services/lineSubscriptionApiService';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { SupervisorHandoverDialog } from '@/components/organisms/SupervisorHandoverDialog';
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

  // Handover State
  const [showHandover, setShowHandover] = useState(false);
  const [handoverCandidates, setHandoverCandidates] = useState<{ id: string, name: string }[]>([]);
  const [isOldLineSupervisor, setIsOldLineSupervisor] = useState(false);

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


  const performSubscription = useCallback(async (lineId: number, lineName: string, userId: string, onSuccess?: () => void, suppressToast: boolean = false) => {
      try {
        setLoading(true);
        await lineSubscriptionApiService.create({
            employeeId: userId,
            lineId: lineId,
            startDate: new Date().toISOString(),
            isActive: true
        });

        if (!suppressToast) {
            toast.success(t('subscription.subscribeSuccess', { lineName }));
        }
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
        
        // Check if user is supervisor of the line they are leaving
        try {
            const oldLine = await import('@/services/lineApiService').then(m => m.lineApiService.getById(employee.subscribedLineId!));
            setIsOldLineSupervisor(oldLine.supervisorId === user.id);
        } catch (e) {
            console.error("Failed to check old line supervisor status", e);
            setIsOldLineSupervisor(false);
        }

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
      if (!oldSubscriptionId || !pendingSubscription || !user?.id) return;

      try {
          setLoading(true);
          setShowConfirm(false);
          
          // Check if user is supervisor of the OLD line before switching
          if (activeLineId) {
              const oldLine = await import('@/services/lineApiService').then(m => m.lineApiService.getById(activeLineId));
              
              if (oldLine.supervisorId === user.id) {
                  // User IS supervisor of old line. Trigger Handover flow first.
                  const candidates = oldLine.subscriptions
                      .filter(s => s.isActive && s.employeeId !== user.id)
                      .map(s => ({ id: s.employeeId, name: s.employeeName }));
                  
                  if (candidates.length === 0) {
                      toast.error(t('supervisor.noCandidates'));
                      setLoading(false);
                      return;
                  }
                  
                  // Save the pending subscription for after handover
                  setHandoverCandidates(candidates);
                  setShowHandover(true);
                  setLoading(false);
                  return;
              }
          }
          
          // Normal switch (not a supervisor)
          await lineSubscriptionApiService.delete(oldSubscriptionId);
          await performSubscription(
              pendingSubscription.lineId, 
              pendingSubscription.lineName, 
              user.id, 
              pendingSubscription.onSuccess,
              true // Suppress generic "Subscribed" toast
          );
          toast.success(t('subscription.switchSuccess', { 
              lineName: pendingSubscription.lineName,
              oldLineName: oldLineName 
          }));
          
          // Cleanup state on success (non-handover case)
          setPendingSubscription(null);
          setOldSubscriptionId(null);
      } catch(error) {
          console.error('Switching subscription failed', error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          
          if (errorMessage.includes('403')) {
               toast.error(t('common.messages.forbiddenAction'));
          } else {
               toast.error(t('subscription.errorCancellingOld'));
          }
          setPendingSubscription(null);
          setOldSubscriptionId(null);
          setLoading(false);
      } finally {
          // Only stop loading here
          setLoading(false);
      }
  };

  const cancelSubscriptionSwitch = () => {
      setShowConfirm(false);
      setPendingSubscription(null);
      setOldSubscriptionId(null);
  }

  // Unsubscribe Logic
  const unsubscribe = async (onSuccess?: () => void) => {
      if (!activeLineId || !user?.id) return;
      
      setLoading(true);
      try {
          // Check if user is supervisor
          const line = await import('@/services/lineApiService').then(m => m.lineApiService.getById(activeLineId));
          
          if (line.supervisorId === user.id) {
               // User IS supervisor. Trigger Handover flow.
               const candidates = line.subscriptions
                   .filter(s => s.isActive && s.employeeId !== user.id)
                   .map(s => ({ id: s.employeeId, name: s.employeeName }));
               
               if (candidates.length === 0) {
                   toast.error(t('supervisor.noCandidates'));
                   // Should we allow force unsubscribe? For now, no.
               } else {
                   setHandoverCandidates(candidates);
                   setShowHandover(true);
                   setPendingUnsubscribeSuccess(() => onSuccess); 
               }
          } else {
               // Normal unsubscribe
               setPendingUnsubscribeSuccess(() => onSuccess);
               setShowUnsubscribeConfirm(true);
          }
      } catch (err) {
          console.error("Failed to check supervisor status", err);
          // Fallback to normal unsubscribe if check fails
          setPendingUnsubscribeSuccess(() => onSuccess);
          setShowUnsubscribeConfirm(true);
      } finally {
          setLoading(false);
      }
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
  
  const handleHandoverConfirm = async (newSupervisorId: string) => {
      if (!activeLineId || !user?.id) return;
      
      try {
          setLoading(true);
          setShowHandover(false);
          
          // Call the handover API
          await import('@/services/lineApiService').then(m => 
              m.lineApiService.handoverSupervisor(activeLineId, newSupervisorId)
          );
          
          toast.success(t('supervisor.handoverSuccess'));
          
          // Refresh subscription status
          await checkSubscriptionStatus();
          
          // If there's a pending subscription (user was switching lines), complete it now
          if (pendingSubscription) {
              await performSubscription(
                  pendingSubscription.lineId, 
                  pendingSubscription.lineName, 
                  user.id, 
                  pendingSubscription.onSuccess
              );
              setPendingSubscription(null);
          }
          
          // Call the success callback if provided
          if (pendingUnsubscribeSuccess) {
              pendingUnsubscribeSuccess();
              setPendingUnsubscribeSuccess(undefined);
          }
          
          setShowHandover(false);
      } catch (error) {
          console.error("Handover failed", error);
          toast.error(t('supervisor.handoverError'));
      } finally {
          setLoading(false);
      }
  };

  const SubscriptionDialog = () => (
    <>
        {/* Switch Dialog */}
        <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>
                {isOldLineSupervisor 
                    ? t('subscription.confirmSwitchSupervisorTitle') 
                    : t('subscription.confirmSwitchTitle', { defaultValue: 'Switch Subscription' })}
            </AlertDialogTitle>
            <AlertDialogDescription>
                {isOldLineSupervisor
                    ? t('subscription.confirmSwitchSupervisor', { 
                        oldLine: oldLineName, 
                        newLine: pendingSubscription?.lineName 
                      })
                    : t('subscription.confirmSwitch', { 
                        oldLine: oldLineName, 
                        newLine: pendingSubscription?.lineName 
                      })
                }
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
        
        {/* Handover Dialog */}
        {showHandover && (
            <SupervisorHandoverDialog 
                open={showHandover}
                onOpenChange={setShowHandover}
                onConfirm={handleHandoverConfirm}
                candidates={handoverCandidates}
            />
        )}
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
