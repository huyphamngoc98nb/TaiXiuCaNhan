import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BackButton } from '@/shared/components/BackButton';
import { RecurringBillForm } from '../components/RecurringBillForm';
import type { RecurringBill, UpdateRecurringBillInput } from '../domain/recurring-bill.model';
import { recurringBillRepository } from '@/core/di/recurring-bills.di';
import { ROUTES } from '@/shared/constants/routes';
import { useLanguage } from '@/shared/context/LanguageContext';
import { useToast } from '@/shared/components/Toast/ToastContext';
import { FormTransition } from '@/shared/components/FormTransition';

export function EditRecurringBillPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const toast = useToast();
  const [bill, setBill] = useState<RecurringBill | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    if (!id) {
      setLoading(false);
      return;
    }

    recurringBillRepository.getById(id).then((result) => {
      if (!mounted) return;
      setBill(result);
      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, [id]);

  const handleSave = async (data: UpdateRecurringBillInput) => {
    if (!bill) return;

    try {
      await recurringBillRepository.update(bill.id, data);
      toast.success(t('recurring_bills.update_success'));
      navigate(ROUTES.RECURRING_BILLS);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t('recurring_bills.save_failed'));
      throw err;
    }
  };

  if (loading) {
    return <div style={{ padding: '16px' }}>{t('recurring_bills.loading_detail')}</div>;
  }

  if (!bill) {
    return <div style={{ padding: '16px' }}>{t('recurring_bills.not_found')}</div>;
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="flex items-center gap-3 px-4 pt-10 pb-4">
        <BackButton onClick={() => navigate(ROUTES.RECURRING_BILLS)} ariaLabel={t('common.back')} />
        <h2 className="text-[18px] font-bold text-text">{t('recurring_bills.edit')}</h2>
      </div>

      <div className="px-4 pb-24">
        <FormTransition className="rounded-[16px] border border-border bg-surface p-5 shadow-sm" transitionKey={bill.id}>
          <RecurringBillForm
            existing={bill}
            onSave={handleSave}
            onCancel={() => navigate(ROUTES.RECURRING_BILLS)}
          />
        </FormTransition>
      </div>
    </div>
  );
}
