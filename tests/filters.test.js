import {filterIconsByCategories} from '../public/scripts/filters.js';

describe('Category Filters', () => {
  test('filterIconsByCategories returns all icons when no categories selected', () => {
    const mockIcons = [
      {getAttribute: () => '[]'},
      {
        getAttribute: () =>
          JSON.stringify([{key: 'social', label: 'Social Media'}]),
      },
    ];

    const result = filterIconsByCategories(mockIcons, []);
    expect(result).toHaveLength(2);
  });

  test('filterIconsByCategories filters icons by selected category', () => {
    const mockIcons = [
      {
        getAttribute: () =>
          JSON.stringify([{key: 'social', label: 'Social Media'}]),
      },
      {
        getAttribute: () =>
          JSON.stringify([{key: 'dev', label: 'Developer Tools'}]),
      },
      {
        getAttribute: () =>
          JSON.stringify([{key: 'social', label: 'Social Media'}]),
      },
    ];

    const result = filterIconsByCategories(mockIcons, ['social']);
    expect(result).toHaveLength(2);
  });

  test('filterIconsByCategories supports multiple selected categories', () => {
    const mockIcons = [
      {
        getAttribute: () =>
          JSON.stringify([{key: 'social', label: 'Social Media'}]),
      },
      {
        getAttribute: () =>
          JSON.stringify([{key: 'dev', label: 'Developer Tools'}]),
      },
      {getAttribute: () => JSON.stringify([{key: 'music', label: 'Music'}])},
    ];

    const result = filterIconsByCategories(mockIcons, ['social', 'dev']);
    expect(result).toHaveLength(2);
  });

  test('filterIconsByCategories returns empty array when no icons match', () => {
    const mockIcons = [
      {
        getAttribute: () =>
          JSON.stringify([{key: 'social', label: 'Social Media'}]),
      },
    ];

    const result = filterIconsByCategories(mockIcons, ['nonexistent']);
    expect(result).toHaveLength(0);
  });

  test('filterIconsByCategories handles icons with multiple categories', () => {
    const mockIcons = [
      {
        getAttribute: () =>
          JSON.stringify([
            {key: 'social', label: 'Social Media'},
            {key: 'dev', label: 'Developer Tools'},
          ]),
      },
    ];

    const result = filterIconsByCategories(mockIcons, ['dev']);
    expect(result).toHaveLength(1);
  });
});
