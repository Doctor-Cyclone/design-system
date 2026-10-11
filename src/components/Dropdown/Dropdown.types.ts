export type DropdownItem = {
  id: string;
  label: string;
  onSelect: () => void;
  disabled?: boolean;
  danger?: boolean;
};
export type DropdownProps = {
  label: string;
  items: readonly DropdownItem[];
  disabled?: boolean;
  className?: string;
};
