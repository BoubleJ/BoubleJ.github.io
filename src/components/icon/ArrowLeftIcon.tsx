interface ArrowLeftIconProps {
  size?: number;
}

export default function ArrowLeftIcon({ size = 24 }: ArrowLeftIconProps) {
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
      aria-label="뒤로 가기"
    >
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}
