interface CheckIconProps {
  size?: number;
}

export default function CheckIcon({ size = 16 }: CheckIconProps) {
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
      aria-label="확인"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
