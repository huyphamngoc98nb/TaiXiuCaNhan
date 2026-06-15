import { useEffect, useState } from 'react';

export const AMOUNT_VISIBILITY_STORAGE_KEY = 'dashboard_show_amounts';
export const HIDDEN_AMOUNT = '••••••';

function readStoredVisibility() {
  return localStorage.getItem(AMOUNT_VISIBILITY_STORAGE_KEY) !== 'false';
}

export function useAmountVisibility() {
  const [showAmounts, setShowAmountsState] = useState(readStoredVisibility);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === AMOUNT_VISIBILITY_STORAGE_KEY) {
        setShowAmountsState(readStoredVisibility());
      }
    };

    const handleLocalChange = () => {
      setShowAmountsState(readStoredVisibility());
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('amount-visibility-change', handleLocalChange);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('amount-visibility-change', handleLocalChange);
    };
  }, []);

  const setShowAmounts = (next: boolean) => {
    localStorage.setItem(AMOUNT_VISIBILITY_STORAGE_KEY, String(next));
    setShowAmountsState(next);
    window.dispatchEvent(new Event('amount-visibility-change'));
  };

  return { showAmounts, setShowAmounts };
}

export function maskAmount<T>(showAmounts: boolean, value: T): T | string {
  return showAmounts ? value : HIDDEN_AMOUNT;
}
