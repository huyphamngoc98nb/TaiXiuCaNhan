import { useEffect, useState } from 'react';
import { Fingerprint } from 'lucide-react';
import { authService } from '@/core/auth/auth.service';
import { useToast } from '@/shared/components/Toast/ToastContext';

export function BiometricUnlockSettings() {
  const toast = useToast();
  const [available, setAvailable] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const [nextAvailable, nextEnabled] = await Promise.all([
          authService.isBiometricUnlockAvailable(),
          authService.isBiometricUnlockEnabled(),
        ]);
        if (!mounted) return;
        setAvailable(nextAvailable);
        setEnabled(nextEnabled);
      } catch {
        if (!mounted) return;
        setAvailable(false);
        setEnabled(false);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void load();

    return () => {
      mounted = false;
    };
  }, []);

  async function toggle() {
    if (!available || saving) return;

    const nextEnabled = !enabled;
    setSaving(true);
    try {
      await authService.setBiometricUnlockEnabled(nextEnabled);
      setEnabled(nextEnabled);
      toast.success(nextEnabled ? 'Đã bật mở khóa sinh trắc học.' : 'Đã tắt mở khóa sinh trắc học.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không thể cập nhật cài đặt sinh trắc học.');
    } finally {
      setSaving(false);
    }
  }

  const disabled = loading || saving || !available;

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={disabled}
      className="w-full flex items-center gap-3 text-left disabled:opacity-60"
    >
      <div className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 bg-indigo-50 text-indigo-500">
        <Fingerprint size={20} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-gray-900">Mở khóa bằng sinh trắc học</p>
        <p className="text-[11px] text-gray-500 truncate">
          {available
            ? 'Dùng vân tay hoặc khuôn mặt thay cho PIN khi mở ứng dụng'
            : 'Chỉ khả dụng trên thiết bị Android/iOS có sinh trắc học'}
        </p>
      </div>

      <span
        className={`w-12 h-6 rounded-full transition-colors flex items-center px-1 ${
          enabled ? 'bg-indigo-500' : 'bg-gray-300'
        }`}
        aria-hidden="true"
      >
        <span
          className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-0'
          }`}
        />
      </span>
    </button>
  );
}
