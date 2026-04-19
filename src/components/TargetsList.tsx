function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="9" cy="9" r="6" stroke="white" strokeWidth="1.5" />
      <line x1="14" y1="14" x2="17.5" y2="17.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 6L8 10L12 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShipIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 17L5 11H19L21 17" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M3 17C3 17 5 20 12 20C19 20 21 17 21 17" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 11V7H17V11" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
      <line x1="12" y1="4" x2="12" y2="11" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="5" cy="12" r="1.5" fill="white" />
      <circle cx="12" cy="12" r="1.5" fill="white" />
      <circle cx="19" cy="12" r="1.5" fill="white" />
    </svg>
  );
}

type Target = {
  id: string;
  name: string;
  coordinates: string;
  status: 'Critical' | 'Warning' | 'Normal';
  vesselClass: string;
  heading: string;
  speed: string;
  transmission: string;
  size: string;
};

const MOCK_TARGETS: Target[] = Array.from({ length: 7 }, (_, i) => ({
  id: String(i),
  name: 'Traget Name',
  coordinates: `31°38'17 N | 31°12'08 E`,
  status: 'Critical',
  vesselClass: 'Bulk',
  heading: '084°',
  speed: '09 kt',
  transmission: 'AIS',
  size: '72M',
}));

const FILTERS = ['Status', 'Class', 'Type', 'AIS'] as const;

function FilterPill({ label }: { label: string }) {
  return (
    <button className="flex-1 flex items-center gap-1 p-2 rounded border border-[#4c3d7b] cursor-pointer hover:border-[#6e48f2] transition-colors">
      <span className="flex-1 text-left font-satoshi font-medium text-sm text-white">{label}</span>
      <ChevronDownIcon />
    </button>
  );
}

function StatusBadge() {
  return (
    <div className="flex h-5 items-center px-2 rounded-[34px] border border-[#ff3646] bg-[rgba(255,54,70,0.2)]">
      <span className="font-satoshi font-medium text-xs text-[#ff3646] leading-none">Critical</span>
    </div>
  );
}

function ClassBadge({ label }: { label: string }) {
  return (
    <div
      className="flex h-5 items-center px-2 rounded-[34px] border border-[#ef835d]"
      style={{ backgroundColor: 'rgba(239,131,93,0.2)' }}
    >
      <span className="font-satoshi font-medium text-xs text-[#ef835d] leading-none">{label}</span>
    </div>
  );
}

function StatColumn({ label, value, width }: { label: string; value: string; width: string }) {
  return (
    <div className="flex flex-col items-start" style={{ width }}>
      <span className="font-satoshi font-normal text-xs text-[#bbb0dc]">{label}</span>
      <span className="font-satoshi font-medium text-sm text-white">{value}</span>
    </div>
  );
}

function TargetCard({ target, active }: { target: Target; active: boolean }) {
  return (
    <div
      className={`flex flex-col gap-5 p-4 rounded-xl w-full cursor-pointer transition-colors ${
        active
          ? 'bg-[rgba(93,52,165,0.3)] border border-[rgba(110,72,242,0.5)]'
          : 'bg-[rgba(93,52,165,0.1)] hover:bg-[rgba(93,52,165,0.2)]'
      }`}
    >
      <div className="flex gap-3 items-center w-full">
        <div className="flex flex-1 gap-3 items-center min-w-0">
          <div className="flex items-center p-2 rounded-[30px] bg-[rgba(122,86,246,0.2)] shrink-0">
            <ShipIcon />
          </div>
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <span className="font-satoshi font-bold text-base text-white tracking-[0.1px] leading-5 truncate">
              {target.name}
            </span>
            <span className="font-satoshi font-normal text-xs text-[#bbb0dc] truncate">
              {target.coordinates}
            </span>
          </div>
        </div>
        <div className="flex gap-2 items-center shrink-0">
          <StatusBadge />
          <ClassBadge label={target.vesselClass} />
          {active && (
            <button className="flex items-center p-1 rounded cursor-pointer hover:bg-[rgba(255,255,255,0.1)]">
              <MoreIcon />
            </button>
          )}
        </div>
      </div>

      <div className="h-px w-full bg-[rgba(110,72,242,0.3)]" />

      <div className="flex items-center justify-between w-full">
        <StatColumn label="Heading" value={target.heading} width="45px" />
        <StatColumn label="Speed" value={target.speed} width="34px" />
        <StatColumn label="Transmission" value={target.transmission} width="80px" />
        <StatColumn label="Size" value={target.size} width="28px" />
      </div>
    </div>
  );
}

export default function TargetsList() {
  const activeId = '1';

  return (
    <div
      className="absolute top-[110px] left-6 z-20 w-[464px] max-h-[calc(100vh-140px)] flex flex-col gap-8 p-6 rounded-3xl overflow-hidden"
      style={{
        backgroundColor: 'rgba(106,67,241,0.1)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      <div className="flex flex-col gap-4 w-full shrink-0">
        <div className="flex items-center gap-1.5 w-full">
          <h2 className="flex-1 font-satoshi font-bold text-[22px] text-white leading-[1.5]">
            Targets List
          </h2>
          <button className="flex items-center px-1 py-1.5 rounded cursor-pointer hover:bg-[rgba(255,255,255,0.1)]">
            <SearchIcon />
          </button>
        </div>
        <div className="flex gap-2 items-center w-full">
          {FILTERS.map((f) => (
            <FilterPill key={f} label={f} />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {MOCK_TARGETS.map((t) => (
          <TargetCard key={t.id} target={t} active={t.id === activeId} />
        ))}
      </div>
    </div>
  );
}
