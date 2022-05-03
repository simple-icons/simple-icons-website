/**
 * @fileoverview
 * Color sorting algorithm.
 */
const isGray = (rgb, range) => {
  let { r, g, b } = { ...rgb };
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
  let { r, g, b } = { ...rgb };
  // Normalize r, g, and b
  r /= 255;
  g /= 255;
  b /= 255;

  // Find greatest and smallest channel values
  let cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;

  // Calculate hue
  // No difference
  if (delta == 0) h = 0;
  // Red is max
  else if (cmax == r) h = ((g - b) / delta) % 6;
  // Green is max
  else if (cmax == g) h = (b - r) / delta + 2;
  // Blue is max
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  // Ensure all hues are positive
  if (h < 0) h += 360;
  // Calculate luminosity
  l = (cmax + cmin) / 2;

  // Calculate saturation
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  // Multiply l and s by 100 to get the value in percent, rather than [0,1]
  s = +(s * 100);
  l = +(l * 100);
  return { h, s, l };
};

export default (colors) => {
  const GREY_RANGE = 10;
  const BLACK_CUTOFF = 15;
  const WHITE_CUTOFF = 90;
  let colored = [];
  let bgw = [];
  colors.map((c) => {
    let rgb = {
      r: parseInt(`0x${c.substring(0, 2)}`),
      g: parseInt(`0x${c.substring(2, 4)}`),
      b: parseInt(`0x${c.substring(4, 6)}`),
    };
    let color = rgbToHsl(rgb);
    let mappedColor = {
      color,
      hex: c,
      bgwFlag:
        color.l <= BLACK_CUTOFF ||
        isGray(rgb, GREY_RANGE) ||
        color.l >= WHITE_CUTOFF,
    };

    if (mappedColor.bgwFlag) bgw.push(mappedColor);
    else colored.push(mappedColor);
  });

  return [
    ...colored.sort((c1, c2) => {
      let hue = c1.color.h - c2.color.h;
      if (!hue) {
        // If hue is the same, sort by saturation
        let saturation = c1.color.s - c2.color.s;

        // If saturation is the same, sort by lightness
        return !saturation ? c1.color.s - c2.color.s : saturation;
      }
      return hue;
    }),
    ...bgw.sort((c1, c2) => c2.color.l - c1.color.l),
  ].map((data) => data.hex);
};
