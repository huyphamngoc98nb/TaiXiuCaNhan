import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Transaction } from '../domain/transaction.model';
import { SQLiteTransactionRepository } from '../repositories/sqlite-transaction.repository';
import { TransactionForm } from '../components/TransactionForm';
import { useLanguage } from '@/shared/context/LanguageContext';

const repo = new SQLiteTransactionRepository();

export function EditTransactionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      repo.getById(id).then(tx => {
        setTransaction(tx);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) return <div style={{ padding: '16px' }}>{t('transactions.loading_detail')}</div>;
  if (!transaction) return <div style={{ padding: '16px' }}>{t('transactions.not_found')}</div>;

  return (
    <div style={{ padding: '16px', paddingBottom: '80px' }}>
      <h2 style={{ marginBottom: '16px' }}>{t('transactions.edit')}</h2>
      <TransactionForm existing={transaction} onSuccess={() => navigate(-1)} />
    </div>
  );
}
