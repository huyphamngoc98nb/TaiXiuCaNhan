import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useWallets } from '../hooks/useWallets';
import { WalletList } from '../components/WalletList';
import { WalletForm } from '../components/WalletForm';
import { BottomSheet } from '@/shared/components/BottomSheet';
import { Wallet, CreateWalletInput, UpdateWalletInput } from '../repositories/sqlite-wallet.repository';
import { useConfirm } from '@/shared/components/ConfirmDialog/ConfirmContext';
import { useToast } from '@/shared/components/Toast/ToastContext';
import { useLanguage } from '@/shared/context/LanguageContext';
import { ROUTES } from '@/shared/constants/routes';

export function WalletsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { wallets, totalBalance, loading, error, createWallet, updateWallet, deleteWallet } =
    useWallets();
  const { confirm } = useConfirm();
  const toast = useToast();
  const { t } = useLanguage();

  const [sheetOpen, setSheetOpen]         = useState(false);
  const [editTarget, setEditTarget]       = useState<Wallet | undefined>(undefined);
  const isCreateRoute = location.pathname === ROUTES.WALLETS_NEW;

  const openCreate = useCallback(() => {
    setEditTarget(undefined);
    setSheetOpen(true);
  }, []);

  const closeSheet = useCallback(() => {
    if (isCreateRoute) {
      navigate(ROUTES.WALLETS, { replace: true });
    }
    setSheetOpen(false);
  }, [isCreateRoute, navigate]);

  useEffect(() => {
    if (isCreateRoute && !sheetOpen) {
      openCreate();
    }
  }, [isCreateRoute, openCreate, sheetOpen]);

  function openEdit(wallet: Wallet) {
    setEditTarget(wallet);
    setSheetOpen(true);
  }

  async function handleSave(data: CreateWalletInput | UpdateWalletInput) {
    if (editTarget) {
      await updateWallet(editTarget.id, data as UpdateWalletInput);
    } else {
      await createWallet(data as CreateWalletInput);
    }
  }

  async function handleDelete(): Promise<boolean> {
    if (!editTarget) return false;

    const ok = await confirm({
      title: t('wallets.delete_confirm_title'),
      message: `${t('wallets.delete_confirm_msg')} ${editTarget.name}`,
      confirmText: t('common.delete'),
      cancelText: t('common.cancel'),
    });
    if (!ok) return false;

    await deleteWallet(editTarget.id);
    toast.success(t('wallets.delete_success'));
    return true;
  }

  return (
    <>
      <WalletList
        wallets={wallets}
        totalBalance={totalBalance}
        loading={loading}
        error={error}
        onWalletClick={openEdit}
        onCreateWallet={() => navigate(ROUTES.WALLETS_NEW)}
      />

      <BottomSheet
        isOpen={sheetOpen}
        onClose={closeSheet}
        fullScreenOnAndroid
        transitionKey={editTarget?.id ?? 'new-wallet'}
      >
        <WalletForm
          existing={editTarget}
          onSave={handleSave}
          onClose={closeSheet}
          onDelete={editTarget ? handleDelete : undefined}
        />
      </BottomSheet>
    </>
  );
}
