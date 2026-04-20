type PinIconProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
};

export default function PinIcon({
  size = 24,
  color = 'currentColor',
  strokeWidth = 1.5,
}: PinIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 4.5L18 2L22 6L19.5 9L15 4.5Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <path
        d="M15 4.5L9.5 10C9.5 10 7 9 4.5 11.5L12.5 19.5C15 17 14 14.5 14 14.5L19.5 9"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <line
        x1="2"
        y1="22"
        x2="9.5"
        y2="14.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}
