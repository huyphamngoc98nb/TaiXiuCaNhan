import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CurrencyCode } from '@/shared/context/CurrencyContext';
import { formatAmountInput, getFractionDigits, normalizeAmountInput } from '@/shared/components/MoneyInput/money-input-utils';
import { MoneyKeyboard } from '@/shared/components/MoneyInput/MoneyKeyboard';
import { useImeSafeInputValue } from '@/shared/hooks/useImeSafeInputValue';

interface CurrencyAmountInputProps {
  value: string | number | null | undefined;
  onValueChange: (value: string) => void;
  currency: CurrencyCode;
  className?: string;
  inputClassName?: string;
  required?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
  enableMoneyKeyboard?: boolean;
}

const MONEY_KEYBOARD_OPEN_EVENT = 'money-keyboard-open';
const DEFAULT_MONEY_KEYBOARD_HEIGHT = 360;
const MONEY_KEYBOARD_SCROLL_GAP = 24;
const MONEY_KEYBOARD_HEIGHT_VARIABLE = '--money-keyboard-height';

interface MoneyKeyboardScrollState {
  element: HTMLElement;
  previousPaddingBottom: string;
  previousScrollPaddingBottom: string;
  previousOverflowY: string;
  previousWebkitOverflowScrolling: string;
  basePaddingBottom: number;
}

function getMoneyKeyboardScrollContainer(element: HTMLElement): HTMLElement | null {
  let current = element.parentElement;

  while (current && current !== document.body) {
    const style = window.getComputedStyle(current);
    if (/(auto|scroll)/.test(style.overflowY)) {
      return current;
    }
    current = current.parentElement;
  }

  return element.closest<HTMLElement>('.keyboard-safe-bottom-sheet, form, .main-content');
}

function restoreMoneyKeyboardScrollPadding(state: MoneyKeyboardScrollState) {
  state.element.style.paddingBottom = state.previousPaddingBottom;
  state.element.style.scrollPaddingBottom = state.previousScrollPaddingBottom;
  state.element.style.overflowY = state.previousOverflowY;

  if (state.previousWebkitOverflowScrolling) {
    state.element.style.setProperty('-webkit-overflow-scrolling', state.previousWebkitOverflowScrolling);
  } else {
    state.element.style.removeProperty('-webkit-overflow-scrolling');
  }
}

export function CurrencyAmountInput({
  value,
  onValueChange,
  currency,
  className = '',
  inputClassName = '',
  required,
  autoFocus,
  placeholder = '0',
  enableMoneyKeyboard = true,
}: CurrencyAmountInputProps) {
  const keyboardId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const keyboardPanelRef = useRef<HTMLDivElement>(null);
  const scrollPaddingRef = useRef<MoneyKeyboardScrollState | null>(null);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(DEFAULT_MONEY_KEYBOARD_HEIGHT);
  const fractionDigits = getFractionDigits(currency);
  const rawValue = value === null || value === undefined ? '' : String(value);
  const imeInput = useImeSafeInputValue({
    value: formatAmountInput(value, currency),
    onChange: (nextValue) => {
      onValueChange(normalizeAmountInput(nextValue, fractionDigits));
    },
  });

  const openKeyboard = useCallback(() => {
    if (!enableMoneyKeyboard) return;

    window.dispatchEvent(new CustomEvent(MONEY_KEYBOARD_OPEN_EVENT, { detail: keyboardId }));
    if (inputRef.current && document.activeElement !== inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
    }
    setIsKeyboardOpen(true);
  }, [enableMoneyKeyboard, keyboardId]);

  const closeKeyboard = useCallback(() => {
    setIsKeyboardOpen(false);
    inputRef.current?.blur();
  }, []);

  useEffect(() => {
    if (!enableMoneyKeyboard) {
      setIsKeyboardOpen(false);
      return;
    }

    const handleKeyboardOpen = (event: Event) => {
      const activeKeyboardId = (event as CustomEvent<string>).detail;
      if (activeKeyboardId !== keyboardId) {
        setIsKeyboardOpen(false);
      }
    };

    window.addEventListener(MONEY_KEYBOARD_OPEN_EVENT, handleKeyboardOpen);
    return () => window.removeEventListener(MONEY_KEYBOARD_OPEN_EVENT, handleKeyboardOpen);
  }, [enableMoneyKeyboard, keyboardId]);

  useEffect(() => {
    if (!isKeyboardOpen) return undefined;

    const handlePointerDown = (event: globalThis.PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;

      if (wrapperRef.current?.contains(target) || keyboardPanelRef.current?.contains(target)) {
        return;
      }

      setIsKeyboardOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isKeyboardOpen]);

  useEffect(() => {
    if (!isKeyboardOpen) return undefined;

    const panel = keyboardPanelRef.current;
    if (!panel) return undefined;

    const updateKeyboardHeight = () => {
      setKeyboardHeight(panel.getBoundingClientRect().height || DEFAULT_MONEY_KEYBOARD_HEIGHT);
    };

    updateKeyboardHeight();
    const measureTimer = window.setTimeout(updateKeyboardHeight, 0);

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateKeyboardHeight);
      return () => {
        window.clearTimeout(measureTimer);
        window.removeEventListener('resize', updateKeyboardHeight);
      };
    }

    const resizeObserver = new ResizeObserver(updateKeyboardHeight);
    resizeObserver.observe(panel);
    window.addEventListener('resize', updateKeyboardHeight);

    return () => {
      window.clearTimeout(measureTimer);
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateKeyboardHeight);
    };
  }, [isKeyboardOpen]);

  useEffect(() => {
    if (!isKeyboardOpen) return undefined;

    document.body.classList.add('money-keyboard-open');
    document.body.dataset.moneyKeyboardOwner = keyboardId;
    document.documentElement.style.setProperty(MONEY_KEYBOARD_HEIGHT_VARIABLE, `${keyboardHeight}px`);

    return () => {
      if (document.body.dataset.moneyKeyboardOwner === keyboardId) {
        document.body.classList.remove('money-keyboard-open');
        delete document.body.dataset.moneyKeyboardOwner;
        document.documentElement.style.setProperty(MONEY_KEYBOARD_HEIGHT_VARIABLE, '0px');
      }
    };
  }, [isKeyboardOpen, keyboardHeight, keyboardId]);

  useEffect(() => {
    if (!isKeyboardOpen) return undefined;

    const wrapper = wrapperRef.current;
    if (!wrapper) return undefined;

    const scrollContainer = getMoneyKeyboardScrollContainer(wrapper);
    if (!scrollContainer) return undefined;

    const previousState = scrollPaddingRef.current;
    if (previousState && previousState.element !== scrollContainer) {
      restoreMoneyKeyboardScrollPadding(previousState);
      scrollPaddingRef.current = null;
    }

    if (!scrollPaddingRef.current) {
      scrollPaddingRef.current = {
        element: scrollContainer,
        previousPaddingBottom: scrollContainer.style.paddingBottom,
        previousScrollPaddingBottom: scrollContainer.style.scrollPaddingBottom,
        previousOverflowY: scrollContainer.style.overflowY,
        previousWebkitOverflowScrolling: scrollContainer.style.getPropertyValue('-webkit-overflow-scrolling'),
        basePaddingBottom: Number.parseFloat(window.getComputedStyle(scrollContainer).paddingBottom) || 0,
      };
    }

    const safePadding = keyboardHeight + MONEY_KEYBOARD_SCROLL_GAP;
    scrollContainer.style.paddingBottom = `${scrollPaddingRef.current.basePaddingBottom + safePadding}px`;
    scrollContainer.style.scrollPaddingBottom = `${safePadding}px`;
    scrollContainer.style.overflowY = 'auto';
    scrollContainer.style.setProperty('-webkit-overflow-scrolling', 'touch');

    const scrollTimer = window.setTimeout(() => {
      const target = wrapper.closest<HTMLElement>('[data-keyboard-scroll-target="true"]') ?? wrapper;
      target.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'smooth' });
    }, 0);

    return () => {
      window.clearTimeout(scrollTimer);
      if (scrollPaddingRef.current) {
        restoreMoneyKeyboardScrollPadding(scrollPaddingRef.current);
        scrollPaddingRef.current = null;
      }
    };
  }, [isKeyboardOpen, keyboardHeight]);

  const keyboardPortal = enableMoneyKeyboard && isKeyboardOpen && typeof document !== 'undefined'
    ? createPortal(
      <div
        ref={keyboardPanelRef}
        className="fixed inset-x-0 bottom-0 z-[120]"
      >
        <MoneyKeyboard
          value={rawValue}
          currency={currency}
          onChange={onValueChange}
          onDone={closeKeyboard}
          className="pb-[calc(1rem+env(safe-area-inset-bottom))]"
        />
      </div>,
      document.body,
    )
    : null;

  return (
    <>
      <div
        ref={wrapperRef}
        className={`flex items-center h-[56px] bg-bg-subtle border rounded-[14px] px-4 transition-colors focus-within:border-primary ${isKeyboardOpen ? 'border-primary' : ''} ${className}`}
      >
        <span className="text-[14px] font-semibold text-subtle mr-2">{currency}</span>
        <input
          ref={inputRef}
          type="text"
          inputMode={enableMoneyKeyboard ? 'none' : fractionDigits === 0 ? 'numeric' : 'decimal'}
          {...imeInput.inputProps}
          readOnly={enableMoneyKeyboard}
          data-money-keyboard-input={enableMoneyKeyboard ? 'true' : undefined}
          required={required}
          placeholder={placeholder}
          autoFocus={autoFocus}
          onFocus={openKeyboard}
          onClick={openKeyboard}
          onPointerDown={openKeyboard}
          className={`flex-1 min-w-0 bg-transparent text-[26px] font-bold text-text outline-none tabular-nums placeholder:text-subtle ${inputClassName}`}
        />
      </div>

      {keyboardPortal}
    </>
  );
}
