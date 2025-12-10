import fs from 'node:fs/promises';
import path from 'node:path';
import {getDirnameFromImportMeta} from 'simple-icons/sdk';

const __dirname = getDirnameFromImportMeta(import.meta.url);

/**
 * Load category metadata and create a mapping of icon slug to categories
 * @returns {Promise<Object>} Map of icon slug to categories array
 */
export const loadCategoryMetadata = async () => {
  try {
    const categoryFilePath = path.resolve(__dirname, 'icon-categories.json');
    const categoryContent = await fs.readFile(categoryFilePath, 'utf8');
    const {categories} = JSON.parse(categoryContent);

    // Create reverse map: slug -> [category keys]
    const slugToCategoriesMap = {};

    for (const [categoryKey, categoryData] of Object.entries(categories)) {
      for (const slug of categoryData.icons) {
        slugToCategoriesMap[slug] ||= [];

        slugToCategoriesMap[slug].push({
          key: categoryKey,
          label: categoryData.label,
          color: categoryData.color,
        });
      }
    }

    return {
      slugToCategoriesMap,
      categoriesList: Object.entries(categories).map(([key, data]) => ({
        key,
        label: data.label,
        description: data.description,
        color: data.color,
        count: data.icons.length,
      })),
    };
  } catch (error) {
    console.error('Error loading category metadata:', error);
    return {
      slugToCategoriesMap: {},
      categoriesList: [],
    };
  }
};

/**
 * Enrich icon data with category information
 * @param {Array} icons - Array of icon objects
 * @param {Object} slugToCategoriesMap - Map of icon slug to categories
 * @returns {Array} Enriched icons array with category data
 */
export const enrichIconsWithCategories = (icons, slugToCategoriesMap) => {
  return icons.map((icon) => {
    const categories = slugToCategoriesMap[icon.slug] || [];
    return {
      ...icon,
      categories,
    };
  });
};
