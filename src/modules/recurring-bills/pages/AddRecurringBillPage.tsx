import { useNavigate } from 'react-router-dom';
import { BackButton } from '@/shared/components/BackButton';
import { RecurringBillForm } from '../components/RecurringBillForm';
import type {
  CreateRecurringBillInput,
  UpdateRecurringBillInput,
} from '../domain/recurring-bill.model';
import { recurringBillRepository } from '@/core/di/recurring-bills.di';
import { ROUTES } from '@/shared/constants/routes';
import { useLanguage } from '@/shared/context/LanguageContext';
import { useToast } from '@/shared/components/Toast/ToastContext';

export function AddRecurringBillPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const toast = useToast();

  const handleSave = async (data: CreateRecurringBillInput | UpdateRecurringBillInput) => {
    try {
      await recurringBillRepository.create(data as CreateRecurringBillInput);
      toast.success(t('recurring_bills.add_success'));
      navigate(ROUTES.RECURRING_BILLS);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t('recurring_bills.save_failed'));
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <div className="flex items-center gap-3 px-4 pt-4 pb-4">
        <BackButton onClick={() => navigate(ROUTES.RECURRING_BILLS)} ariaLabel={t('common.back')} />
        <h2 className="text-[18px] font-bold text-text">{t('recurring_bills.new')}</h2>
      </div>

      <div className="px-4 pb-24">
        <div className="rounded-[16px] border border-border bg-surface p-5 shadow-sm">
          <RecurringBillForm
            onSave={handleSave}
            onCancel={() => navigate(ROUTES.RECURRING_BILLS)}
          />
        </div>
      </div>
    </div>
  );
}
