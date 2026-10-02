import React from 'react';

interface LumaMarkProps {
  size?: number;
  tile?: boolean;
  className?: string;
}

export const LumaMark: React.FC<LumaMarkProps> = ({ size = 36, tile = true, className = "" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {tile && <rect width="40" height="40" rx="13" fill="#111318" />}
      <circle cx="16" cy="14.5" r="8.4" fill="#F4B860" />
      <circle cx="24.5" cy="26" r="8" fill={tile ? "#111318" : "#FFFFFF"} />
      <path
        d="M31.2 30.2a8 8 0 1 1-8.9-9.2"
        stroke="#12A05A"
        strokeWidth="4.6"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="30" cy="13" r="3.4" fill="#DB6FA0" />
    </svg>
  );
};

interface SectionHeaderProps {
  eyebrow: string;
  dot?: string;
  title: string;
  sub?: string;
  align?: 'center' | 'left';
  dark?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  dot = "#F4B860",
  title,
  sub,
  align = "center",
  dark = false
}) => {
  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      <span className={`eyebrow ${dark ? "!border-white/15 !bg-white/10 !text-white" : ""}`}>
        <span className="eyebrow-dot" style={{ background: dot }} />
        {eyebrow}
      </span>
      <h2 className={`mt-5 font-display text-3xl font-extrabold leading-[1.08] tracking-[-0.025em] sm:text-[2.75rem] ${dark ? "text-white" : "text-ink-900"}`}>
        {title}
      </h2>
      {sub && (
        <p className={`mt-4 text-[16px] leading-relaxed ${dark ? "text-white/65" : "text-ink-500"}`}>
          {sub}
        </p>
      )}
    </div>
  );
};
