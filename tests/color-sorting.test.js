import sortByColors from '../scripts/color-sorting.js';

describe('scripts/color-sorting.js', () => {
  // Issue: https://github.com/simple-icons/simple-icons-website/issues/66
  it('orders color', () => {
    const colors = [
      '181717',
      '1D1717',
      '000000',
      '512BD4',
      '40AEF0',
      '0094F5',
      'FF0000',
      '004088',
      '0099E5',
      'EF2D5E',
      'FF9E0F',
      '071D49',
      '00A98F',
      '191A1B',
      '41454A',
      'A100FF',
      '26689A',
      'A9225C',
      '83B81A',
      '0085CA',
      '0B2C4A',
    ];

    const orderedColors = [
      'FF0000',
      'FF9E0F',
      '83B81A',
      '00A98F',
      '0099E5',
      '0085CA',
      '40AEF0',
      '0094F5',
      '26689A',
      '0B2C4A',
      '004088',
      '071D49',
      '512BD4',
      'A100FF',
      'A9225C',
      'EF2D5E',
      '41454A',
      '1D1717',
      '191A1B',
      '181717',
      '000000',
    ];

    const hexes = sortByColors(colors);
    expect(hexes).toEqual(orderedColors);
  });
});
