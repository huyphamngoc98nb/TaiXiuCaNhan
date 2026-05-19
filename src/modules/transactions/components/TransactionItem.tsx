import { Transaction } from '../domain/transaction.model';
import { ArrowLeftRight, Edit2, Trash2, Paperclip } from 'lucide-react';
import { useLanguage } from '@/shared/context/LanguageContext';
import { useCurrency } from '@/shared/context/CurrencyContext';
import { CategoryIcon } from '@/modules/categories/components/CategoryIcon';

interface Props {
  transaction: Transaction;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  showDate?: boolean;
}

export function TransactionItem({ transaction, onEdit, onDelete, showDate = false }: Props) {
  const { language } = useLanguage();
  const { formatAmount } = useCurrency();
  const locale = language === 'vi' ? 'vi-VN' : 'en-US';
  const isExpense = transaction.type === 'expense';
  const isTransfer = transaction.type === 'transfer';
  const amountColor = isTransfer ? '#4f46e5' : isExpense ? '#e11d48' : '#059669';
  const amountPrefix = isTransfer ? '' : isExpense ? '-' : '+';
  const categoryColor = transaction.category_color ?? (isExpense ? '#e11d48' : '#059669');
  const title = isTransfer
    ? `${transaction.wallet_name ?? transaction.wallet_id} -> ${transaction.to_wallet_name ?? transaction.to_wallet_id ?? ''}`
    : transaction.category_name ?? transaction.category_id;

  const formatTime = (timestamp: number) =>
    new Date(timestamp).toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: language !== 'vi',
    });

  const formatDateShort = (timestamp: number) =>
    new Date(timestamp).toLocaleDateString(locale, {
      month: 'short',
      day: 'numeric',
    });

  return (
    <div style={{
      padding: '16px',
      background: 'var(--surface)',
      borderRadius: '12px',
      border: '1px solid var(--border)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: isTransfer
            ? 'rgba(79, 70, 229, 0.1)'
            : `${categoryColor}1A`,
          color: isTransfer ? '#4f46e5' : categoryColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.2rem',
        }}>
          {isTransfer ? (
            <ArrowLeftRight size={20} color="#4f46e5" />
          ) : (
            <CategoryIcon
              icon={transaction.category_icon}
              name={transaction.category_name ?? transaction.category_id}
              type={isExpense ? 'expense' : 'income'}
              size={20}
            />
          )}
        </div>
        <div>
          <div style={{ fontWeight: '600', fontSize: '1rem', color: 'var(--text)' }}>
            {title}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            {showDate ? formatDateShort(transaction.transaction_date) : formatTime(transaction.transaction_date)}
            {transaction.receipt_path && <><span style={{ opacity: 0.5 }}>-</span> <Paperclip size={12} /></>}
          </div>
          {transaction.note && (
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px', fontStyle: 'italic' }}>
              "{transaction.note}"
            </div>
          )}
        </div>
      </div>

      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
        <div style={{
          fontWeight: '700',
          fontSize: '1.1rem',
          color: amountColor,
        }}>
          {amountPrefix}{formatAmount(transaction.amount, locale)}
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={() => onEdit(transaction.id)}
            style={{
              padding: '6px',
              borderRadius: '6px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex',
            }}
            title="Edit"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(transaction.id)}
            style={{
              padding: '6px',
              borderRadius: '6px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: '#f43f5e',
              display: 'flex',
            }}
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
