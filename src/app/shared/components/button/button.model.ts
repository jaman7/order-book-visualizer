export interface IButton {
  onAction?: () => void;
  id?: string;
  name?: string;
  className?: string;
  customClass?: string;
  tooltipTitle?: string;
  tooltipClassName?: string;
  isRound?: boolean;
  icon?: string;
  ariaLabel?: string;
  disabled?: boolean;
}
