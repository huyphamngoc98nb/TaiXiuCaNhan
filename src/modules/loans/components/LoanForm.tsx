import { FormEvent, useEffect, useMemo, useState } from 'react';
import { CurrencyAmountInput } from '@/shared/components/CurrencyAmountInput';
import { DropdownList } from '@/shared/components/DropdownList';
import { useWallets } from '@/modules/wallets/hooks/useWallets';
import type { CreateLoanInput, LoanType } from '../domain/loan.model';

interface LoanFormProps {
  onSubmit: (input: CreateLoanInput) => Promise<void>;
  loading: boolean;
}

const TYPE_OPTIONS: Array<{ id: LoanType; label: string; activeClass: string }> = [
  { id: 'lend', label: 'Cho vay', activeClass: 'bg-amber-500 text-white' },
  { id: 'borrow', label: 'Vay nợ', activeClass: 'bg-blue-500 text-white' },
];

export function LoanForm({ onSubmit, loading }: LoanFormProps) {
  const { wallets, loading: walletsLoading } = useWallets();
  const [type, setType] = useState<LoanType>('lend');
  const [contactName, setContactName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [walletId, setWalletId] = useState('');
  const [principal, setPrincipal] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!walletId && wallets[0]) {
      setWalletId(wallets[0].id);
    }
  }, [walletId, wallets]);

  const walletOptions = useMemo(
    () => wallets.map((wallet) => ({ value: wallet.id, label: wallet.name })),
    [wallets],
  );

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!walletId) {
      setError('Vui lòng chọn ví.');
      return;
    }

    try {
      await onSubmit({
        wallet_id: walletId,
        type,
        contact_name: contactName.trim(),
        contact_info: contactInfo.trim() || undefined,
        principal: Number(principal),
        due_date: dueDate || undefined,
        note: note.trim() || undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể lưu khoản vay.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h3 className="text-[18px] font-bold text-gray-900">Thêm khoản</h3>
        <p className="mt-1 text-[12px] text-gray-500">Cho vay hoặc vay nợ cá nhân.</p>
      </div>

      {error && (
        <div className="rounded-[12px] border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] font-medium text-rose-600">
          {error}
        </div>
      )}

      <div className="flex h-[48px] rounded-[12px] bg-gray-100 p-1">
        {TYPE_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setType(option.id)}
            className={`flex-1 rounded-[9px] text-[14px] font-semibold transition-all ${
              type === option.id ? `${option.activeClass} shadow-sm` : 'text-gray-500'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="space-y-1.5">
        <p className="text-[13px] font-semibold text-gray-700">Người liên hệ *</p>
        <input
          value={contactName}
          onChange={(event) => setContactName(event.target.value)}
          required
          className="h-[48px] w-full rounded-[12px] border border-gray-200 bg-gray-50 px-4 text-[14px] text-gray-900 outline-none focus:border-indigo-400"
        />
      </div>

      <div className="space-y-1.5">
        <p className="text-[13px] font-semibold text-gray-700">Thông tin liên hệ</p>
        <input
          value={contactInfo}
          onChange={(event) => setContactInfo(event.target.value)}
          placeholder="SĐT, địa chỉ..."
          className="h-[48px] w-full rounded-[12px] border border-gray-200 bg-gray-50 px-4 text-[14px] text-gray-900 outline-none focus:border-indigo-400"
        />
      </div>

      <div className="space-y-1.5">
        <p className="text-[13px] font-semibold text-gray-700">Ví *</p>
        <DropdownList
          value={walletId}
          onChange={setWalletId}
          ariaLabel="Ví"
          placeholder={walletsLoading ? 'Đang tải ví...' : 'Chọn ví'}
          disabled={walletsLoading || walletOptions.length === 0}
          openOnInputBlurPointerDown
          options={[
            { value: '', label: 'Chọn ví', disabled: true },
            ...walletOptions,
          ]}
        />
      </div>

      <div className="space-y-1.5">
        <p className="text-[13px] font-semibold text-gray-700">Số tiền *</p>
        <CurrencyAmountInput
          currency="VND"
          value={principal}
          onValueChange={setPrincipal}
          required
          className={type === 'lend' ? 'border-amber-200' : 'border-blue-200'}
        />
      </div>

      <div className="space-y-1.5">
        <p className="text-[13px] font-semibold text-gray-700">Hạn trả</p>
        <input
          type="date"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
          className="h-[48px] w-full rounded-[12px] border border-gray-200 bg-gray-50 px-4 text-[14px] font-medium text-gray-900 outline-none focus:border-indigo-400"
        />
      </div>

      <div className="space-y-1.5">
        <p className="text-[13px] font-semibold text-gray-700">Ghi chú</p>
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          rows={3}
          className="w-full resize-none rounded-[12px] border border-gray-200 bg-gray-50 px-4 py-3 text-[14px] text-gray-900 outline-none focus:border-indigo-400"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`h-[52px] w-full rounded-[14px] text-[15px] font-bold text-white transition-all active:scale-[0.98] ${
          type === 'lend'
            ? 'bg-amber-500 shadow-lg shadow-amber-300/40'
            : 'bg-blue-500 shadow-lg shadow-blue-300/40'
        } ${loading ? 'opacity-50' : ''}`}
      >
        {loading ? 'Đang lưu...' : 'Lưu khoản'}
      </button>
    </form>
  );
}
