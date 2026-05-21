import { useWallets } from '@/modules/wallets/hooks/useWallets';

export function useWalletBalances() {
  const { wallets, loading, error, refresh } = useWallets();
  const totalAssets = wallets.reduce((total, wallet) => {
    if (wallet.exclude_from_total === 1 || wallet.account_type === 'credit_card') return total;
    return total + Math.max(0, Number(wallet.balance || 0));
  }, 0);
  const totalCreditCardLiability = wallets.reduce((total, wallet) => {
    if (wallet.exclude_from_total === 1 || wallet.account_type !== 'credit_card') return total;
    return total + Math.max(0, -Number(wallet.balance || 0));
  }, 0);
  const totalBalance = totalAssets - totalCreditCardLiability;

  return {
    wallets,
    totalBalance,
    totalAssets,
    totalCreditCardLiability,
    loading,
    error,
    refresh,
  };
}
