import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { TransactionList } from '../components/TransactionList';
import { useConfirm } from '@/shared/components/ConfirmDialog/ConfirmContext';
import { useLanguage } from '@/shared/context/LanguageContext';

export type ViewType = 'day' | 'month' | 'year';

export function TransactionsPage() {
  const navigate = useNavigate();
  const { transactions, loading, filter, setFilter, remove } = useTransactions();
  const { confirm } = useConfirm();
  const { t } = useLanguage();
  const [viewType, setViewType] = useState<ViewType>('day');

  const handleEdit = (id: string) => navigate(`/transactions/${id}/edit`);

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: t('transactions.delete_confirm_title'),
      message: t('transactions.delete_confirm_msg'),
      confirmText: t('transactions.delete_confirm_btn'),
      cancelText: t('common.cancel'),
    });

    if (ok) {
      await remove(id);
    }
  };

  const viewLabels: Record<ViewType, string> = {
    day: t('transactions.view_day'),
    month: t('transactions.view_month'),
    year: t('transactions.view_year'),
  };

  return (
    <div style={{ padding: '16px', paddingBottom: '80px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{t('transactions.history_title')}</h2>
        <button
          onClick={() => navigate('/transactions/new')}
          style={{
            padding: '10px 20px',
            background: 'var(--primary)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontWeight: '600',
            boxShadow: '0 4px 6px -1px rgba(14, 165, 233, 0.2)',
          }}
        >
          {t('transactions.new_button')}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          <select
            value={filter.type || ''}
            onChange={e => setFilter({ ...filter, type: e.target.value as any || undefined })}
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              fontSize: '0.9rem',
              color: 'var(--text)',
            }}
          >
            <option value="">{t('transactions.all_types')}</option>
            <option value="expense">{t('transactions.filter_expenses')}</option>
            <option value="income">{t('transactions.filter_income')}</option>
          </select>

          <div style={{
            display: 'flex',
            background: 'var(--border)',
            padding: '2px',
            borderRadius: '10px',
            flex: 1,
          }}>
            {(['day', 'month', 'year'] as ViewType[]).map((type) => (
              <button
                key={type}
                onClick={() => setViewType(type)}
                style={{
                  flex: 1,
                  padding: '8px',
                  border: 'none',
                  borderRadius: '8px',
                  background: viewType === type ? 'var(--surface)' : 'transparent',
                  color: viewType === type ? 'var(--primary)' : 'var(--text-muted)',
                  fontSize: '0.85rem',
                  fontWeight: viewType === type ? '600' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {viewLabels[type]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <TransactionList
        transactions={transactions}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        viewType={viewType}
      />
    </div>
  );
}
