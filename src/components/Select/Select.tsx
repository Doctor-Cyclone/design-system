import { useEffect, useId, useRef, useState } from 'react';
import type { SelectOption, SelectProps } from './Select.types';
import styles from './Select.module.css';

/** Editable single-select combobox; DOM focus stays on the input while options use active descendant. */
export function Select({
  label,
  options,
  value,
  defaultValue = '',
  onValueChange,
  disabled,
  required,
  name,
  id,
  placeholder = 'Choose an option',
  hint,
  error,
  emptyMessage = 'No matching options',
  className,
}: SelectProps) {
  const generated = useId();
  const inputId = id ?? generated;
  const listId = `${inputId}-list`;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const selected = value ?? internalValue;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeValue, setActiveValue] = useState<string | undefined>();
  const input = useRef<HTMLInputElement>(null);
  const expanded = open && !disabled;
  const filtered = options.filter((option) =>
    option.label.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
  );
  const available = filtered.filter((option) => !option.disabled);
  const active =
    available.find((option) => option.value === activeValue) ?? available[0];
  const activeIndex = filtered.findIndex((option) => option === active);
  const optionId = (index: number) => `${listId}-${index}`;
  useEffect(() => {
    if (expanded && activeIndex >= 0)
      document
        .getElementById(`${listId}-${activeIndex}`)
        ?.scrollIntoView?.({ block: 'nearest' });
  }, [expanded, activeIndex, listId, query]);
  const selectedLabel =
    options.find((option) => option.value === selected)?.label ?? '';
  const close = () => {
    setOpen(false);
    setQuery('');
  };
  const choose = (option: SelectOption) => {
    if (option.disabled) return;
    if (value === undefined) setInternalValue(option.value);
    onValueChange?.(option.value);
    close();
    input.current?.focus();
  };
  const show = (last = false) => {
    setQuery('');
    setOpen(true);
    setActiveValue(
      last
        ? options.filter((option) => !option.disabled).at(-1)?.value
        : (options.find(
            (option) => !option.disabled && option.value === selected,
          )?.value ?? options.find((option) => !option.disabled)?.value),
    );
  };
  return (
    <div
      className={[styles.field, className].filter(Boolean).join(' ')}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) close();
      }}
    >
      <label htmlFor={inputId} className={styles.label}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {name && (
        <input type="hidden" name={name} value={selected} disabled={disabled} />
      )}
      <div className={styles.control}>
        <input
          ref={input}
          id={inputId}
          role="combobox"
          aria-autocomplete="list"
          aria-haspopup="listbox"
          aria-expanded={expanded}
          aria-controls={expanded ? listId : undefined}
          aria-activedescendant={
            expanded && activeIndex >= 0 ? optionId(activeIndex) : undefined
          }
          aria-describedby={
            [hint && `${inputId}-hint`, error && `${inputId}-error`]
              .filter(Boolean)
              .join(' ') || undefined
          }
          aria-invalid={Boolean(error) || undefined}
          aria-required={required || undefined}
          autoComplete="off"
          disabled={disabled}
          placeholder={placeholder}
          value={expanded ? query : selectedLabel}
          className={styles.input}
          onClick={() => {
            if (!expanded) show();
          }}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
            setActiveValue(undefined);
          }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
              event.preventDefault();
              if (!expanded) show(event.key === 'ArrowUp');
              else if (available.length) {
                const index = available.findIndex(
                  (option) => option === active,
                );
                setActiveValue(
                  available[
                    (index +
                      (event.key === 'ArrowDown' ? 1 : -1) +
                      available.length) %
                      available.length
                  ]?.value,
                );
              }
            } else if (event.key === 'Enter') {
              event.preventDefault();
              if (!expanded) show();
              else if (active) choose(active);
            } else if (event.key === 'Escape' && expanded) {
              event.preventDefault();
              event.stopPropagation();
              close();
            } else if (event.key === 'Tab') close();
          }}
        />
        <span aria-hidden="true" className={styles.arrow}>
          ⌄
        </span>
        {expanded && (
          <ul
            role="listbox"
            id={listId}
            aria-label={label}
            className={styles.list}
          >
            {filtered.map((option, index) => (
              <li role="none" key={option.value}>
                <button
                  type="button"
                  role="option"
                  id={optionId(index)}
                  aria-selected={selected === option.value}
                  aria-disabled={option.disabled || undefined}
                  tabIndex={-1}
                  data-active={option === active || undefined}
                  className={styles.option}
                  onPointerDown={(event) => event.preventDefault()}
                  onPointerMove={() => {
                    if (!option.disabled) setActiveValue(option.value);
                  }}
                  onClick={() => choose(option)}
                >
                  {option.label}
                  {selected === option.value && (
                    <span aria-hidden="true"> ✓</span>
                  )}
                </button>
              </li>
            ))}
            {filtered.length === 0 && (
              <li role="none" className={styles.empty}>
                {emptyMessage}
              </li>
            )}
          </ul>
        )}
      </div>
      {expanded && filtered.length === 0 && (
        <span role="status" className={styles.srOnly}>
          {emptyMessage}
        </span>
      )}
      {hint && (
        <p id={`${inputId}-hint`} className={styles.hint}>
          {hint}
        </p>
      )}
      {error && (
        <p id={`${inputId}-error`} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}
