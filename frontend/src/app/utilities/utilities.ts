export const clamp = (v: number, min: number, max: number): number => {
  if (v < min) return min;
  else if (v > max) return max;
  else return v;
}
