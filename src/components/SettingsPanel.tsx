import GlassPanel from './GlassPanel';
import { useUISize, type UISize } from '../contexts/UISizeContext';

const sizeOptions: { label: string; value: UISize }[] = [
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' },
];

export default function SettingsPanel() {
  const { size, setSize } = useUISize();

  return (
    <div className="absolute top-[110px] left-1/2 -translate-x-1/2 z-30">
      <GlassPanel padding="16px">
        <div className="flex flex-col gap-3 min-w-[260px]">
          <span className="font-satoshi font-bold text-white text-sm tracking-[0.25px]">
            UI Size
          </span>
          <div className="flex items-center gap-2">
            {sizeOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSize(opt.value)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm tracking-[0.25px] transition-all cursor-pointer font-satoshi ${
                  size === opt.value
                    ? 'text-white font-bold'
                    : 'text-[#dee3e7] font-medium hover:text-white'
                }`}
                style={
                  size === opt.value
                    ? {
                        backgroundImage:
                          'linear-gradient(90deg, rgba(105,49,245,0.35) 0%, rgba(105,49,245,0.35) 100%), linear-gradient(107deg, rgba(56,78,231,0.15) 5.66%, rgba(30,191,245,0.15) 98.96%)',
                      }
                    : undefined
                }
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </GlassPanel>
    </div>
  );
}
