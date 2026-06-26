export default function toPersianDigits(input: string | number): string {
  const persianNumbers = [
    "۰",
    "۱",
    "۲",
    "۳",
    "۴",
    "۵",
    "۶",
    "۷",
    "۸",
    "۹",
  ] as const;
  return String(input).replace(
    /\d/g,
    (d) => persianNumbers[+d as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9],
  );
}
