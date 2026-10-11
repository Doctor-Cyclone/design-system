export type SelectOption = { value: string; label: string; disabled?: boolean };
export type SelectProps = {
  label: string;
  options: readonly SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  placeholder?: string;
  hint?: string;
  error?: string;
  emptyMessage?: string;
  className?: string;
};
