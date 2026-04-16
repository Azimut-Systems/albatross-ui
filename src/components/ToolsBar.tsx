import LiquidGlass from 'liquid-glass-react';

function PencilIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 4.5L18 2L22 6L19.5 9L15 4.5Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M15 4.5L9.5 10C9.5 10 7 9 4.5 11.5L12.5 19.5C15 17 14 14.5 14 14.5L19.5 9" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
      <line x1="2" y1="22" x2="9.5" y2="14.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export default function ToolsBar() {
  const tools = [PencilIcon, PinIcon, LayersIcon];

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 glass-wrapper">
      <LiquidGlass
        displacementScale={70}
        blurAmount={0.5}
        saturation={140}
        elasticity={0}
        cornerRadius={16}
        padding="8px"
        style={{ border: '1px solid rgba(110,72,242,0.5)' }}
      >
        <div className="flex items-center gap-2">
          {tools.map((Icon, i) => (
            <button
              key={i}
              className="flex items-center p-[10px] rounded-lg cursor-pointer hover:bg-[rgba(122,86,246,0.2)] transition-colors"
            >
              <Icon />
            </button>
          ))}
        </div>
      </LiquidGlass>
    </div>
  );
}
