import { useEffect, useMemo, useState } from 'react';
import {
  CalendarDays,
  Keyboard,
  ScanSearch,
  Settings2,
  WalletCards,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { getDbConnection } from '@/core/db/sqlite/connection';
import { DropdownList } from '@/shared/components/DropdownList';
import { useLanguage } from '@/shared/context/LanguageContext';
import {
  DefaultTransactionDateMode,
  DefaultTransactionType,
  TransactionInputSettings as TransactionInputSettingsValue,
  getTransactionInputSettings,
  updateTransactionInputSettings,
} from '../services/transaction-input-settings.service';

interface WalletOption {
  id: string;
  name: string;
}

interface ToggleSettingProps {
  checked: boolean;
  icon: LucideIcon;
  title: string;
  description: string;
  onChange: (checked: boolean) => void;
}

function ToggleSetting({
  checked,
  icon: Icon,
  title,
  description,
  onChange,
}: ToggleSettingProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center gap-3 rounded-[12px] bg-bg px-3 py-3 text-left transition-colors active:bg-bg-subtle"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-indigo-50 text-indigo-600">
        <Icon size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-text">{title}</p>
        <p className="text-[11px] leading-4 text-muted">{description}</p>
      </div>
      <span
        className={`flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors ${
          checked ? 'bg-primary' : 'bg-gray-300'
        }`}
      >
        <span
          className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
            checked ? 'translate-x-5' : ''
          }`}
        />
      </span>
    </button>
  );
}

export function TransactionInputSettings() {
  const { t } = useLanguage();
  const [settings, setSettings] = useState<TransactionInputSettingsValue>(() => (
    getTransactionInputSettings()
  ));
  const [wallets, setWallets] = useState<WalletOption[]>([]);
  const [walletLoadFailed, setWalletLoadFailed] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadWallets() {
      try {
        const db = await getDbConnection();
        const { values } = await db.query(
          `SELECT id, name
           FROM wallets
           WHERE is_active = 1
             AND balance <> 0
             AND TRIM(name) <> ''
           ORDER BY sort_order ASC, name ASC`
        );
        const loadedWallets = (values ?? [])
          .map((row) => ({
            id: String((row as Record<string, unknown>).id ?? ''),
            name: String((row as Record<string, unknown>).name ?? ''),
          }))
          .filter((wallet) => wallet.id && wallet.name);

        if (!mounted) return;

        setWallets(loadedWallets);
        setWalletLoadFailed(false);
        setSettings((current) => {
          if (
            !current.defaultWalletId ||
            loadedWallets.some((wallet) => wallet.id === current.defaultWalletId)
          ) {
            return current;
          }

          return updateTransactionInputSettings({ defaultWalletId: null });
        });
      } catch {
        if (mounted) {
          setWalletLoadFailed(true);
        }
      }
    }

    void loadWallets();

    return () => {
      mounted = false;
    };
  }, []);

  const walletOptions = useMemo(() => [
    { value: '', label: t('settings.transaction_input_no_default_wallet') },
    ...wallets.map((wallet) => ({
      value: wallet.id,
      label: wallet.name,
    })),
  ], [t, wallets]);

  const transactionTypeOptions = useMemo(() => [
    { value: 'expense' as const, label: t('form.type_expense') },
    { value: 'income' as const, label: t('form.type_income') },
    { value: 'transfer' as const, label: t('transactions.transfer') },
  ], [t]);

  const dateModeOptions = useMemo(() => [
    { value: 'today' as const, label: t('settings.transaction_input_date_today') },
    { value: 'last_used' as const, label: t('settings.transaction_input_date_last_used') },
  ], [t]);

  const updateSettings = (input: Partial<TransactionInputSettingsValue>) => {
    setSettings(updateTransactionInputSettings(input));
  };

  return (
    <div className="card">
      <div className="mb-4 flex items-center gap-2.5">
        <Settings2 size={20} className="text-primary" />
        <h3 className="m-0 text-[1.1rem] font-semibold">{t('settings.transaction_input_title')}</h3>
      </div>

      <p className="mb-4 text-[0.9rem] text-muted">{t('settings.transaction_input_desc')}</p>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[13px] font-semibold text-text">
            <WalletCards size={16} className="text-indigo-500" />
            <span>{t('settings.transaction_input_default_wallet')}</span>
          </div>
          <DropdownList
            value={settings.defaultWalletId ?? ''}
            onChange={(value) => updateSettings({ defaultWalletId: value || null })}
            ariaLabel={t('settings.transaction_input_default_wallet')}
            options={walletOptions}
          />
          {walletLoadFailed && (
            <p className="text-[11px] text-rose-500">
              {t('settings.transaction_input_wallets_load_failed')}
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[13px] font-semibold text-text">
              <Zap size={16} className="text-indigo-500" />
              <span>{t('settings.transaction_input_default_type')}</span>
            </div>
            <DropdownList<DefaultTransactionType>
              value={settings.defaultTransactionType}
              onChange={(value) => updateSettings({ defaultTransactionType: value })}
              ariaLabel={t('settings.transaction_input_default_type')}
              options={transactionTypeOptions}
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[13px] font-semibold text-text">
              <CalendarDays size={16} className="text-indigo-500" />
              <span>{t('settings.transaction_input_default_date')}</span>
            </div>
            <DropdownList<DefaultTransactionDateMode>
              value={settings.defaultDateMode}
              onChange={(value) => updateSettings({ defaultDateMode: value })}
              ariaLabel={t('settings.transaction_input_default_date')}
              options={dateModeOptions}
            />
          </div>
        </div>

        <div className="space-y-2">
          <ToggleSetting
            checked={settings.enableMoneyKeyboard}
            icon={Keyboard}
            title={t('settings.transaction_input_money_keyboard')}
            description={t('settings.transaction_input_money_keyboard_desc')}
            onChange={(checked) => updateSettings({ enableMoneyKeyboard: checked })}
          />
          <ToggleSetting
            checked={settings.autoFocusAmount}
            icon={Zap}
            title={t('settings.transaction_input_auto_focus_amount')}
            description={t('settings.transaction_input_auto_focus_amount_desc')}
            onChange={(checked) => updateSettings({ autoFocusAmount: checked })}
          />
          <ToggleSetting
            checked={settings.duplicateWarningEnabled}
            icon={ScanSearch}
            title={t('settings.transaction_input_duplicate_warning')}
            description={t('settings.transaction_input_duplicate_warning_desc')}
            onChange={(checked) => updateSettings({ duplicateWarningEnabled: checked })}
          />
        </div>
      </div>
    </div>
  );
}
