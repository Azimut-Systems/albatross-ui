import type { ReactNode } from 'react';

type SectionHeadingProps = {
  title: string;
  /** Optional trailing action (button, link, icons) */
  action?: ReactNode;
};

/** Bold section heading with an optional right-aligned action slot. */
export default function SectionHeading({ title, action }: SectionHeadingProps) {
  return (
    <div className="flex items-center gap-1">
      <h3 className="flex-1 font-ibm-plex-sans font-bold text-base text-white tracking-[0.1px] leading-5">
        {title}
      </h3>
      {action}
    </div>
  );
}
