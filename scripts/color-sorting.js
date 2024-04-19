/**
 * @fileoverview
 * Color sorting algorithm.
 */

const isGray = (rgb, range) => {
  const {r, g, b} = rgb;
  return (
    r >= g - range &&
    r <= g + range &&
    b >= g - range &&
    b <= g + range &&
    r >= b - range &&
    r <= b + range
  );
};

const rgbToHsl = (rgb) => {
  let {r, g, b} = rgb;
  // Normalize r, g, and b
  r /= 255;
  g /= 255;
  b /= 255;

  // Find greatest and smallest channel values
  const cmin = Math.min(r, g, b);
  const cmax = Math.max(r, g, b);
  const delta = cmax - cmin;
  let h = 0;
  let s = 0;
  let l = 0;

  // Calculate hue
  // No difference
  if (delta === 0) h = 0;
  // Red is max
  else if (cmax === r) h = ((g - b) / delta) % 6;
  // Green is max
  else if (cmax === g) h = (b - r) / delta + 2;
  // Blue is max
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  // Ensure all hues are positive
  if (h < 0) h += 360;
  // Calculate luminosity
  l = (cmax + cmin) / 2;

  // Calculate saturation
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  // Multiply l and s by 100 to get the value in percent, rather than [0,1]
  s *= 100;
  l *= 100;
  return {h, s, l};
};

export default function colorSorting(colors) {
  const GREY_RANGE = 10;
  const BLACK_CUTOFF = 15;
  const WHITE_CUTOFF = 90;
  const colored = [];
  const bgw = [];

  for (const c of colors) {
    const rgb = {
      r: Number.parseInt(`0x${c.slice(0, 2)}`, 16),
      g: Number.parseInt(`0x${c.slice(2, 4)}`, 16),
      b: Number.parseInt(`0x${c.slice(4, 6)}`, 16),
    };
    const color = rgbToHsl(rgb);
    const mappedColor = {
      color,
      hex: c,
      bgwFlag:
        color.l <= BLACK_CUTOFF ||
        isGray(rgb, GREY_RANGE) ||
        color.l >= WHITE_CUTOFF,
    };

    if (mappedColor.bgwFlag) bgw.push(mappedColor);
    else colored.push(mappedColor);
  }

  return [
    ...colored.sort((c1, c2) => {
      const hue = c1.color.h - c2.color.h;
      if (!hue) {
        // If hue is the same, sort by saturation
        const saturation = c1.color.s - c2.color.s;

        // If saturation is the same, sort by lightness
        return saturation || c1.color.s - c2.color.s;
      }

      return hue;
    }),
    ...bgw.sort((c1, c2) => c2.color.l - c1.color.l),
  ].map((data) => data.hex);
}
