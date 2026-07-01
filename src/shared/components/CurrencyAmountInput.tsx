import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
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

interface MoneyInputSelection {
  start: number;
  end: number;
}

function isFormattedRawCharacter(character: string, fractionDigits: number): boolean {
  return /\d/.test(character) || (fractionDigits > 0 && character === ',');
}

export function formattedOffsetToRawOffset(
  formattedValue: string,
  formattedOffset: number,
  fractionDigits: number,
): number {
  return formattedValue
    .slice(0, Math.max(0, formattedOffset))
    .split('')
    .filter(character => isFormattedRawCharacter(character, fractionDigits))
    .length;
}

export function rawOffsetToFormattedOffset(
  formattedValue: string,
  rawOffset: number,
  fractionDigits: number,
): number {
  if (rawOffset <= 0) return 0;

  let rawCharacters = 0;
  for (let index = 0; index < formattedValue.length; index += 1) {
    if (isFormattedRawCharacter(formattedValue[index], fractionDigits)) {
      rawCharacters += 1;
    }
    if (rawCharacters >= rawOffset) return index + 1;
  }

  return formattedValue.length;
}

export function findNearestFormattedOffset(
  formattedValue: string,
  relativeX: number,
  measureText: (text: string) => number,
): number {
  if (relativeX <= 0 || !formattedValue) return 0;

  let previousWidth = 0;
  for (let offset = 1; offset <= formattedValue.length; offset += 1) {
    const currentWidth = measureText(formattedValue.slice(0, offset));
    if (relativeX < previousWidth + ((currentWidth - previousWidth) / 2)) {
      return offset - 1;
    }
    previousWidth = currentWidth;
  }

  return formattedValue.length;
}

function getFormattedOffsetAtClientX(input: HTMLInputElement, formattedValue: string, clientX: number): number | null {
  const context = document.createElement('canvas').getContext('2d');
  if (!context) return null;

  const style = window.getComputedStyle(input);
  context.font = [style.fontStyle, style.fontWeight, style.fontSize, style.fontFamily]
    .filter(Boolean)
    .join(' ');

  const inputRect = input.getBoundingClientRect();
  const paddingLeft = Number.parseFloat(style.paddingLeft) || 0;
  const relativeX = clientX - inputRect.left - paddingLeft + input.scrollLeft;
  return findNearestFormattedOffset(formattedValue, relativeX, text => context.measureText(text).width);
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
  const formattedValue = formatAmountInput(value, currency);
  const selectionRef = useRef<MoneyInputSelection>({ start: rawValue.length, end: rawValue.length });
  const [selection, setSelection] = useState<MoneyInputSelection>(selectionRef.current);
  const imeInput = useImeSafeInputValue({
    value: formattedValue,
    onChange: (nextValue) => {
      onValueChange(normalizeAmountInput(nextValue, fractionDigits));
    },
  });

  const updateSelection = useCallback((nextSelection: MoneyInputSelection) => {
    selectionRef.current = nextSelection;
    setSelection(nextSelection);
  }, []);

  const syncSelectionFromInput = useCallback(() => {
    if (!enableMoneyKeyboard || !inputRef.current) return;

    const formattedStart = inputRef.current.selectionStart ?? formattedValue.length;
    const formattedEnd = inputRef.current.selectionEnd ?? formattedStart;
    updateSelection({
      start: formattedOffsetToRawOffset(formattedValue, formattedStart, fractionDigits),
      end: formattedOffsetToRawOffset(formattedValue, formattedEnd, fractionDigits),
    });
  }, [enableMoneyKeyboard, formattedValue, fractionDigits, updateSelection]);

  const moveCaretToClientX = useCallback((clientX: number) => {
    if (!enableMoneyKeyboard || !inputRef.current) return;

    const formattedOffset = getFormattedOffsetAtClientX(inputRef.current, formattedValue, clientX);
    if (formattedOffset === null) {
      syncSelectionFromInput();
      return;
    }

    const rawOffset = formattedOffsetToRawOffset(formattedValue, formattedOffset, fractionDigits);
    updateSelection({ start: rawOffset, end: rawOffset });
  }, [enableMoneyKeyboard, formattedValue, fractionDigits, syncSelectionFromInput, updateSelection]);

  const moveSelectionAfterEdit = useCallback((candidateValue: string, candidateCaret: number, nextValue: string) => {
    const normalizedPrefix = normalizeAmountInput(candidateValue.slice(0, candidateCaret), fractionDigits);
    const nextCaret = Math.min(normalizedPrefix.length, nextValue.length);
    updateSelection({ start: nextCaret, end: nextCaret });
  }, [fractionDigits, updateSelection]);

  const insertAtSelection = useCallback((key: string) => {
    const { start, end } = selectionRef.current;
    const candidateValue = `${rawValue.slice(0, start)}${key}${rawValue.slice(end)}`;
    const nextValue = normalizeAmountInput(candidateValue, fractionDigits);
    moveSelectionAfterEdit(candidateValue, start + key.length, nextValue);
    onValueChange(nextValue);
  }, [fractionDigits, moveSelectionAfterEdit, onValueChange, rawValue]);

  const backspaceAtSelection = useCallback(() => {
    const { start, end } = selectionRef.current;
    if (start === 0 && end === 0) return;

    const deleteStart = start === end ? Math.max(0, start - 1) : start;
    const candidateValue = `${rawValue.slice(0, deleteStart)}${rawValue.slice(end)}`;
    const nextValue = normalizeAmountInput(candidateValue, fractionDigits);
    moveSelectionAfterEdit(candidateValue, deleteStart, nextValue);
    onValueChange(nextValue);
  }, [fractionDigits, moveSelectionAfterEdit, onValueChange, rawValue]);

  const replaceValue = useCallback((nextValue: string) => {
    const normalizedValue = normalizeAmountInput(nextValue, fractionDigits);
    updateSelection({ start: normalizedValue.length, end: normalizedValue.length });
    onValueChange(normalizedValue);
  }, [fractionDigits, onValueChange, updateSelection]);

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
    if (!enableMoneyKeyboard) return;

    if (!isKeyboardOpen) {
      updateSelection({ start: rawValue.length, end: rawValue.length });
      return;
    }

    const { start, end } = selectionRef.current;
    const nextSelection = {
      start: Math.min(start, rawValue.length),
      end: Math.min(end, rawValue.length),
    };
    if (nextSelection.start !== start || nextSelection.end !== end) {
      updateSelection(nextSelection);
    }
  }, [enableMoneyKeyboard, isKeyboardOpen, rawValue.length, updateSelection]);

  useLayoutEffect(() => {
    if (!enableMoneyKeyboard || !isKeyboardOpen || !inputRef.current) return;

    inputRef.current.setSelectionRange(
      rawOffsetToFormattedOffset(formattedValue, selection.start, fractionDigits),
      rawOffsetToFormattedOffset(formattedValue, selection.end, fractionDigits),
    );
  }, [enableMoneyKeyboard, formattedValue, fractionDigits, imeInput.value, isKeyboardOpen, selection]);

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
          onInsert={insertAtSelection}
          onBackspace={backspaceAtSelection}
          onReplace={replaceValue}
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
        <div className="relative flex-1 min-w-0 h-full">
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
            onPointerDown={(event) => {
              openKeyboard();
              moveCaretToClientX(event.clientX);
            }}
            onSelect={syncSelectionFromInput}
            className={`h-full w-full min-w-0 bg-transparent text-[26px] font-bold text-text outline-none tabular-nums placeholder:text-subtle ${isKeyboardOpen ? 'text-transparent caret-transparent' : ''} ${inputClassName}`}
          />

          {enableMoneyKeyboard && isKeyboardOpen && (
            <div
              aria-hidden="true"
              data-money-input-selection-overlay="true"
              className={`pointer-events-none absolute inset-0 z-10 flex items-center overflow-hidden whitespace-pre text-[26px] font-bold text-text tabular-nums ${inputClassName}`}
            >
              <span>{formattedValue.slice(0, rawOffsetToFormattedOffset(formattedValue, selection.start, fractionDigits))}</span>
              {selection.start === selection.end ? (
                <span data-money-input-caret="true" className="money-input-caret h-[1.15em] w-0.5 shrink-0 rounded-full bg-primary" />
              ) : (
                <span className="rounded-sm bg-primary/20">
                  {formattedValue.slice(
                    rawOffsetToFormattedOffset(formattedValue, selection.start, fractionDigits),
                    rawOffsetToFormattedOffset(formattedValue, selection.end, fractionDigits),
                  )}
                </span>
              )}
              <span>{formattedValue.slice(rawOffsetToFormattedOffset(formattedValue, selection.end, fractionDigits))}</span>
            </div>
          )}
        </div>
      </div>

      {keyboardPortal}
    </>
  );
}
