import { useNavigate } from 'react-router-dom';
import { TransactionForm } from '../components/TransactionForm';
import { useLanguage } from '@/shared/context/LanguageContext';

export function AddTransactionPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div style={{ padding: '16px', paddingBottom: '80px' }}>
      <h2 style={{ marginBottom: '16px' }}>{t('transactions.add_title')}</h2>
      <TransactionForm onSuccess={() => navigate('/')} />
    </div>
  );
}
