import React, { FormEvent, useEffect, useState } from 'react';
import { CreateRecurringBillInput, RecurringBill, UpdateRecurringBillInput } from '../domain/recurring-bill.model';
import { getDbConnection } from '@/core/db/sqlite/connection';

interface Props {
  existing?: RecurringBill;
  onSave: (data: CreateRecurringBillInput | UpdateRecurringBillInput) => Promise<void>;
  onCancel: () => void;
}

interface SelectOption { id: string; name: string; }

export const RecurringBillForm: React.FC<Props> = ({ existing, onSave, onCancel }) => {
  const [name, setName]               = useState(existing?.name ?? '');
  const [amount, setAmount]           = useState(existing?.amount?.toString() ?? '');
  const [reminderDays, setReminderDays] = useState(existing?.reminder_days?.toString() ?? '3');
  const [nextDueDate, setNextDueDate] = useState(() => {
    const d = existing ? new Date(existing.next_due_date) : new Date();
    return d.toISOString().split('T')[0];
  });
  const [walletId, setWalletId]       = useState(existing?.wallet_id ?? '');
  const [categoryId, setCategoryId]   = useState(existing?.category_id ?? '');
  const [wallets, setWallets]         = useState<SelectOption[]>([]);
  const [categories, setCategories]   = useState<SelectOption[]>([]);
  const [submitting, setSubmitting]   = useState(false);
  const [error, setError]             = useState<string | null>(null);

  useEffect(() => {
    async function loadOptions() {
      const db = await getDbConnection();
      const { values: ws } = await db.query('SELECT id, name FROM wallets');
      const { values: cs } = await db.query("SELECT id, name FROM categories WHERE type = 'expense'");
      const loadedWallets = ws || [];
      const loadedCats   = cs || [];
      setWallets(loadedWallets);
      setCategories(loadedCats);
      if (!existing && loadedWallets.length > 0 && !walletId) setWalletId(loadedWallets[0].id);
      if (!existing && loadedCats.length > 0 && !categoryId) setCategoryId(loadedCats[0].id);
    }
    loadOptions();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsedAmount = parseFloat(amount);
    if (!name.trim())                          { setError('Tên hóa đơn không được để trống.'); return; }
    if (isNaN(parsedAmount) || parsedAmount <= 0) { setError('Số tiền phải lớn hơn 0.'); return; }
    if (!walletId)                             { setError('Vui lòng chọn ví.'); return; }
    if (!categoryId)                           { setError('Vui lòng chọn danh mục.'); return; }
    const dueDateMs = new Date(nextDueDate).getTime();
    if (isNaN(dueDateMs))                      { setError('Ngày đến hạn không hợp lệ.'); return; }

    setSubmitting(true);
    try {
      await onSave({
        name: name.trim(),
        amount: parsedAmount,
        frequency: 'monthly',
        next_due_date: dueDateMs,
        reminder_days: Math.max(0, parseInt(reminderDays) || 3),
        wallet_id: walletId,
        category_id: categoryId,
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Lưu thất bại.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Error banner */}
      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-[12px] text-[13px] text-red-600 font-medium">
          {error}
        </div>
      )}

      {/* Tên hóa đơn */}
      <div className="space-y-1.5">
        <p className="text-[13px] font-semibold text-gray-700">Tên hóa đơn *</p>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="VD: Netflix, Tiền điện..."
          required
          className="w-full h-[48px] bg-gray-50 border border-gray-200 rounded-[14px] px-4
            text-[14px] text-gray-900 outline-none focus:border-indigo-400 transition-colors"
        />
      </div>

      {/* Số tiền */}
      <div className="space-y-1.5">
        <p className="text-[13px] font-semibold text-gray-700">Số tiền</p>
        <div className="flex items-center h-[56px] bg-gray-50 border border-gray-200 rounded-[14px] px-4
          transition-colors focus-within:border-indigo-400">
          <span className="text-[14px] font-semibold text-gray-400 mr-2">VND</span>
          <input
            type="number"
            inputMode="decimal"
            step="1"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            required
            placeholder="0"
            className="flex-1 bg-transparent text-[26px] font-bold text-gray-900 outline-none tabular-nums"
          />
        </div>
      </div>

      {/* Ngày đến hạn */}
      <div className="space-y-1.5">
        <p className="text-[13px] font-semibold text-gray-700">Ngày đến hạn</p>
        <input
          type="date"
          value={nextDueDate}
          onChange={e => setNextDueDate(e.target.value)}
          required
          className="w-full h-[48px] bg-gray-50 border border-gray-200 rounded-[12px] px-4
            text-[14px] text-gray-800 font-medium focus:outline-none focus:border-indigo-400"
        />
      </div>

      {/* Nhắc trước (ngày) */}
      <div className="space-y-1.5">
        <p className="text-[13px] font-semibold text-gray-700">Nhắc trước (ngày)</p>
        <input
          type="number"
          min="0"
          max="30"
          value={reminderDays}
          onChange={e => setReminderDays(e.target.value)}
          className="w-full h-[48px] bg-gray-50 border border-gray-200 rounded-[12px] px-4
            text-[14px] text-gray-900 outline-none focus:border-indigo-400"
        />
      </div>

      {/* Ví */}
      <div className="space-y-1.5">
        <p className="text-[13px] font-semibold text-gray-700">Ví</p>
        <div className="relative">
          <select
            value={walletId}
            onChange={e => setWalletId(e.target.value)}
            required
            className="w-full h-[48px] px-4 pr-8 bg-gray-50 border border-gray-200 rounded-[12px]
              text-[14px] text-gray-800 font-medium appearance-none focus:outline-none focus:border-indigo-400"
          >
            <option value="" disabled>Chọn ví</option>
            {wallets.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
          </select>
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-[10px]">▼</span>
        </div>
      </div>

      {/* Danh mục */}
      <div className="space-y-1.5">
        <p className="text-[13px] font-semibold text-gray-700">Danh mục</p>
        <div className="relative">
          <select
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            required
            className="w-full h-[48px] px-4 pr-8 bg-gray-50 border border-gray-200 rounded-[12px]
              text-[14px] text-gray-800 font-medium appearance-none focus:outline-none focus:border-indigo-400"
          >
            <option value="" disabled>Chọn danh mục</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-[10px]">▼</span>
        </div>
      </div>

      {/* Info note */}
      <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-[12px] text-[12px] text-gray-500 italic">
        ℹ️ Tần suất mặc định là hàng tháng. Nhắc nhở chỉ hiển thị trong ứng dụng, không tự tạo giao dịch.
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 h-[54px] rounded-[14px] border border-gray-200 text-gray-600 text-[15px] font-semibold
            transition-all active:scale-[0.98]"
        >
          Huỷ
        </button>
        <button
          type="submit"
          disabled={submitting}
          className={`flex-[2] h-[54px] rounded-[14px] bg-indigo-500 text-white text-[16px] font-bold
            transition-all active:scale-[0.98] ${
            submitting ? 'opacity-50' : 'shadow-lg shadow-indigo-500/20'
          }`}
        >
          {submitting ? 'Đang lưu...' : existing ? 'Lưu thay đổi' : 'Thêm hóa đơn'}
        </button>
      </div>
    </form>
  );
};
