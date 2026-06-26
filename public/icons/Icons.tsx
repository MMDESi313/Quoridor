export function WallIconHorizontal({
  size = 24,
  color = "currentColor",
  
  ...props
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="2" y="11" width="20" height="2" rx="1" fill={color} />
    </svg>
  );
}

export function WallIconVertical({
  size = 24,
  color = "currentColor",
  
  ...props
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="11" y="2" width="2" height="20" rx="1" fill={color} />
    </svg>
  );
}
