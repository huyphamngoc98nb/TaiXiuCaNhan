import { useNavigate } from 'react-router-dom';
import { BackButton } from '@/shared/components/BackButton';
import { TransactionForm } from '../components/TransactionForm';
import { useLanguage } from '@/shared/context/LanguageContext';
import { ROUTES } from '@/shared/constants/routes';

export function AddTransactionPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Header */}
      <div className="sticky top-0 z-30 flex items-center gap-3 bg-[#F5F7FA] px-4 pt-10 pb-4">
        <BackButton onClick={() => navigate(ROUTES.TRANSACTIONS)} ariaLabel={t('common.back')} />
        <h2 className="text-[18px] font-bold text-gray-900">{t('transactions.add_title')}</h2>
      </div>

      {/* Form */}
      <div className="px-4 pb-24">
        <TransactionForm pinTypeSelector onSuccess={() => navigate(ROUTES.TRANSACTIONS)} />
      </div>
    </div>
  );
}
