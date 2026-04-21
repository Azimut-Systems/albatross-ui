import { MoreIcon } from '../icons';

type ListMoreHandleProps = {
  label: string;
  onActivate: () => void;
};

/**
 * Nested "more" control that lives inside a parent <button>. Uses role="button"
 * on a span so HTML doesn't reject nested interactive elements; keyboard
 * activation is mirrored from a real button.
 */
export default function ListMoreHandle({ label, onActivate }: ListMoreHandleProps) {
  return (
    <span
      role="button"
      tabIndex={0}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onActivate();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          onActivate();
        }
      }}
      className="flex items-center p-1 rounded text-white cursor-pointer hover:bg-[var(--hover-overlay)]"
    >
      <MoreIcon />
    </span>
  );
}
