import { useWallets } from '@/modules/wallets/hooks/useWallets';

export function useWalletBalances() {
  const { wallets, loading, error, refresh } = useWallets();
  const valuedWallets = wallets.filter((wallet) => Number(wallet.balance || 0) !== 0);
  const totalBalance = valuedWallets.reduce(
    (total, wallet) => total + Number(wallet.balance || 0),
    0
  );

  return {
    wallets: valuedWallets,
    totalBalance,
    loading,
    error,
    refresh,
  };
}
