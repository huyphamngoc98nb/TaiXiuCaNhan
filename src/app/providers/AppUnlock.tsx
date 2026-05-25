// REDESIGN: PIN screen - see prompt 20260522
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { Delete, Fingerprint, LockKeyhole } from 'lucide-react';
import { authService } from '@/core/auth/auth.service';
import { useLanguage } from '@/shared/context/LanguageContext';

interface AppUnlockProps {
  onUnlocked: () => void;
}

const PIN_MIN_LENGTH = 6;
const PIN_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const PIN_ERROR_MESSAGE = 'Mã PIN không đúng. Thử lại.';
type UnlockMode = 'loading' | 'setup' | 'confirm' | 'unlock';

export function AppUnlock({ onUnlocked }: AppUnlockProps) {
  const { t } = useLanguage();
  const [pin, setPin] = useState('');
  const [firstPin, setFirstPin] = useState('');
  const [mode, setMode] = useState<UnlockMode>('loading');
  const [error, setError] = useState<string | null>(null);
  const [shakeDots, setShakeDots] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = pin.trim().length >= PIN_MIN_LENGTH;

  const appendPinDigit = useCallback((digit: string) => {
    if (submitting) return;
    setError(null);
    setPin((currentPin) => {
      if (currentPin.length >= PIN_MIN_LENGTH) return currentPin;
      return `${currentPin}${digit}`;
    });
  }, [submitting]);

  const removePinDigit = useCallback(() => {
    if (submitting) return;
    setError(null);
    setPin((currentPin) => currentPin.slice(0, -1));
  }, [submitting]);

  const showPinError = useCallback((message: string) => {
    setPin('');
    setError(message);
    setShakeDots(true);
    window.setTimeout(() => setShakeDots(false), 240);
  }, []);

  const unlockFromBiometrics = useCallback(async () => {
    try {
      const result = await authService.unlockWithBiometrics();
      if (result?.authenticated) {
        setPin('');
        onUnlocked();
      }
    } catch {
      // PIN remains available when biometric auth is canceled, unavailable, or not set up.
    }
  }, [onUnlocked]);

  const submitPin = useCallback(async () => {
    if (!canSubmit || submitting || mode === 'loading') return;

    if (mode === 'setup') {
      setFirstPin(pin);
      setPin('');
      setError(null);
      setMode('confirm');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      if (mode === 'confirm') {
        if (pin !== firstPin) {
          setFirstPin('');
          setMode('setup');
          showPinError(t('app_lock.confirm_mismatch'));
          return;
        }
        await authService.setupPin(pin);
      } else {
        await authService.unlockWithPin(pin);
      }
      setPin('');
      setFirstPin('');
      onUnlocked();
    } catch {
      showPinError(PIN_ERROR_MESSAGE);
    } finally {
      setSubmitting(false);
    }
  }, [canSubmit, firstPin, mode, onUnlocked, pin, showPinError, submitting, t]);

  useEffect(() => {
    let isMounted = true;
    let removeListener: (() => Promise<void>) | undefined;

    async function subscribeToBiometrics() {
      let hasSecret = false;
      try {
        hasSecret = await authService.hasStoredSecret();
      } catch {
        hasSecret = false;
      }
      if (!isMounted) return;

      setMode(hasSecret ? 'unlock' : 'setup');
      if (!hasSecret) return;

      const biometricUnlockEnabled = await authService.isBiometricUnlockEnabled();
      if (!isMounted || !biometricUnlockEnabled) return;

      try {
        const listenerHandle = await authService.onBiometricResult((event) => {
          if (event.result) {
            if (isMounted) void unlockFromBiometrics();
          } else if (isMounted && event.message) {
            setError(event.message);
          }
        });

        removeListener = listenerHandle ? () => listenerHandle.remove() : undefined;
      } catch {
        removeListener = undefined;
      }

      if (isMounted) await unlockFromBiometrics();
    }

    void subscribeToBiometrics();

    return () => {
      isMounted = false;
      if (removeListener) {
        void removeListener();
      }
    };
  }, [unlockFromBiometrics]);

  useEffect(() => {
    if (!error) return;

    const dismissTimer = window.setTimeout(() => {
      setError(null);
    }, 2000);

    return () => window.clearTimeout(dismissTimer);
  }, [error]);

  useEffect(() => {
    if (pin.length === PIN_MIN_LENGTH) {
      void submitPin();
    }
  }, [pin, submitPin]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (/^\d$/.test(event.key)) {
        event.preventDefault();
        appendPinDigit(event.key);
        return;
      }

      if (event.key === 'Backspace' || event.key === 'Delete') {
        event.preventDefault();
        removePinDigit();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [appendPinDigit, removePinDigit]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submitPin();
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F7] text-[#1A1B22]">
      <style>
        {`
          @keyframes pin-dot-row-shake {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(-10px); }
            40% { transform: translateX(9px); }
            60% { transform: translateX(-6px); }
            80% { transform: translateX(4px); }
          }
        `}
      </style>
      <main className="flex flex-1 items-center justify-center px-6 pb-6 pt-2">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[390px]"
        >
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-[0_10px_30px_rgba(17,24,39,0.08)]">
              <LockKeyhole
                size={30}
                strokeWidth={2.35}
                className="text-[#4A6FA5]"
                aria-hidden="true"
              />
            </div>

            <h1 className="text-center text-[24px] font-extrabold leading-[30px] text-[#1A1B22]">
              {mode === 'setup' ? t('app_lock.setup_title') : mode === 'confirm' ? t('app_lock.confirm_title') : t('app_lock.unlock_title')}
            </h1>
            <p className="mt-2 max-w-[260px] text-center text-[14px] font-normal leading-5 text-[#454653]">
              {mode === 'setup'
                ? t('app_lock.setup_desc')
                : mode === 'confirm'
                  ? t('app_lock.confirm_desc')
                  : t('app_lock.unlock_desc')}
            </p>
          </div>

          <input
            id="app-pin"
            value={pin}
            onChange={(event) => {
              const nextPin = event.target.value.replace(/\D/g, '').slice(0, PIN_MIN_LENGTH);
              setPin(nextPin);
            }}
            type="password"
            inputMode="numeric"
            autoComplete={mode === 'unlock' ? 'current-password' : 'new-password'}
            minLength={PIN_MIN_LENGTH}
            className="sr-only"
            disabled={submitting}
            aria-label={mode === 'unlock' ? 'PIN' : t('app_lock.new_pin')}
          />

          <div className="mt-9 flex min-h-[76px] flex-col items-center justify-center">
            <div
              className="flex h-10 items-center justify-center gap-4"
              style={shakeDots ? { animation: 'pin-dot-row-shake 220ms ease-in-out' } : undefined}
              aria-hidden="true"
            >
              {Array.from({ length: PIN_MIN_LENGTH }).map((_, index) => {
                const isFilled = pin.length > index;

                return (
                  <span
                    key={index}
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-[#D9DEE7]"
                  >
                    <span
                      className={`h-4 w-4 rounded-full bg-[#4A6FA5] transition-all duration-200 ease-out ${
                        isFilled ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                      }`}
                    />
                  </span>
                );
              })}
            </div>

            <p
              className={`mt-2 min-h-5 text-center text-[13px] font-medium text-[#BA1A1A] transition-opacity duration-150 ${
                error ? 'opacity-100' : 'opacity-0'
              }`}
              role={error ? 'alert' : undefined}
            >
              {error ?? PIN_ERROR_MESSAGE}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3">
            {PIN_KEYS.slice(0, 9).map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => appendPinDigit(digit)}
                disabled={submitting}
                className="flex aspect-square items-center justify-center rounded-2xl bg-white text-[26px] font-semibold text-[#1A1B22] shadow-[0_8px_24px_rgba(17,24,39,0.08)] transition duration-100 active:scale-[0.92] active:bg-[#EEF2F7] disabled:opacity-50"
                aria-label={`${t('app_lock.enter_digit')} ${digit}`}
              >
                {digit}
              </button>
            ))}

            <div aria-hidden="true" />

            <button
              type="button"
              onClick={() => appendPinDigit('0')}
              disabled={submitting}
              className="flex aspect-square items-center justify-center rounded-2xl bg-white text-[26px] font-semibold text-[#1A1B22] shadow-[0_8px_24px_rgba(17,24,39,0.08)] transition duration-100 active:scale-[0.92] active:bg-[#EEF2F7] disabled:opacity-50"
              aria-label={`${t('app_lock.enter_digit')} 0`}
            >
              0
            </button>

            <button
              type="button"
              onClick={removePinDigit}
              disabled={submitting || pin.length === 0}
              className="flex aspect-square items-center justify-center rounded-2xl bg-white text-[#454653] shadow-[0_8px_24px_rgba(17,24,39,0.08)] transition duration-100 active:scale-[0.92] active:bg-[#EEF2F7] disabled:opacity-40"
              aria-label="Xóa"
            >
              <Delete size={26} strokeWidth={2.2} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => void unlockFromBiometrics()}
            disabled={submitting || mode !== 'unlock'}
            className="mx-auto mt-7 flex h-11 items-center justify-center gap-2 rounded-2xl px-4 text-[14px] font-semibold text-[#4A6FA5] transition duration-100 active:scale-[0.92] active:bg-[#E8EEF6] disabled:opacity-50"
            aria-label="Dùng sinh trắc học"
          >
            <Fingerprint size={21} strokeWidth={2.2} />
            <span>Dùng sinh trắc học</span>
          </button>
        </form>
      </main>
    </div>
  );
}
