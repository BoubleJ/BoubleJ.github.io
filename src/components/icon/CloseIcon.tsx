interface CloseIconProps {
  size?: number;
}

export default function CloseIcon({ size = 16 }: CloseIconProps) {
  return (
    <svg
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="검색 지우기"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 6l12 12M18 6L6 18"
      />
    </svg>
  );
}
