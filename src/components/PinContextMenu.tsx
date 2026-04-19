import GlassPanel from './GlassPanel';

function MoveIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3V21M3 12H21M12 3L9 6M12 3L15 6M12 21L9 18M12 21L15 18M3 12L6 9M3 12L6 15M21 12L18 9M21 12L18 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type PinContextMenuProps = {
  onMove: () => void;
  onDelete: () => void;
};

export default function PinContextMenu({ onMove, onDelete }: PinContextMenuProps) {
  return (
    <GlassPanel cornerRadius={10} padding="4px">
      <div className="flex flex-col min-w-[96px]">
        <button
          type="button"
          onClick={onMove}
          className="flex items-center gap-2 px-3 py-2 rounded-md text-white text-xs font-medium tracking-[0.25px] cursor-pointer hover:bg-[rgba(105,49,245,0.55)] transition-colors text-left"
        >
          <MoveIcon />
          <span>Move</span>
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="flex items-center gap-2 px-3 py-2 rounded-md text-white text-xs font-medium tracking-[0.25px] cursor-pointer hover:bg-[rgba(105,49,245,0.55)] transition-colors text-left"
        >
          <TrashIcon />
          <span>Delete</span>
        </button>
      </div>
    </GlassPanel>
  );
}
