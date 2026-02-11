interface ArrowUpIconProps {
  size?: number;
}

export default function ArrowUpIcon({ size = 24 }: ArrowUpIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="위로"
    >
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}
