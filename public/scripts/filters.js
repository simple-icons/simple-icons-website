/**
 * Filter icons by selected categories
 * @param {Array} icons - All icon DOM elements
 * @param {Array} selectedCategories - Array of category keys to filter by
 * @returns {Array} Filtered icon elements
 */
export const filterIconsByCategories = (icons, selectedCategories) => {
  if (selectedCategories.length === 0) {
    return [...icons];
  }

  return icons.filter((iconElement) => {
    const categoriesAttribute = iconElement.getAttribute('categories');

    let iconCategories = [];

    if (categoriesAttribute) {
      try {
        iconCategories = JSON.parse(categoriesAttribute);
      } catch {
        iconCategories = [];
      }
    }

    // Fallback: try to infer categories by slug using injected categories map
    if (
      (!iconCategories || iconCategories.length === 0) &&
      typeof window !== 'undefined'
    ) {
      try {
        const img = iconElement.querySelector('img');
        if (img) {
          const dsrc =
            img.getAttribute('d-src') || img.getAttribute('src') || '';
          const slug = dsrc.split('/').pop().replace('.svg', '');
          const map = window.__SIMPLE_ICONS_CATEGORIES_MAP__ || {};
          const mapped = map[slug];
          if (mapped && Array.isArray(mapped) && mapped.length > 0) {
            iconCategories = mapped;
          }
        }
      } catch {
        // ignore fallback errors
      }
    }

    if (!iconCategories || iconCategories.length === 0) return false;

    try {
      const iconCategoryKeys = new Set(iconCategories.map((cat) => cat.key));

      // Return true if icon has at least one selected category
      return selectedCategories.some((selected) =>
        iconCategoryKeys.has(selected),
      );
    } catch {
      return false;
    }
  });
};

/**
 * Apply category filters to the grid
 * @param {Object} params - Parameters object
 * @param {Array} params.selectedCategories - Selected category keys
 * @param {Array} params.allIcons - All icon DOM elements
 * @param {HTMLElement} params.gridElement - Grid container element
 * @param {Array} params.nonIcons - Non-icon elements (ads, etc)
 * @param {Object} params.domUtils - DOM utilities
 */
export const applyCategoryFilters = ({
  selectedCategories,
  allIcons,
  gridElement,
  nonIcons,
  domUtils,
}) => {
  const filtered = filterIconsByCategories(allIcons, selectedCategories);

  // Replace grid children with filtered icons
  const result = [...nonIcons, ...filtered];
  domUtils.replaceChildren(gridElement, result);
};

/**
 * Get emoji/icon for a category
 * @param {string} categoryKey - Category key
 * @returns {string} Emoji representation
 */
const getCategoryEmoji = (categoryKey) => {
  const emojiMap = {
    social: '💬',
    'tech-startup': '🚀',
    'developer-tools': '⚙️',
    payment: '💳',
    cloud: '☁️',
    productivity: '📊',
    design: '🎨',
    video: '🎬',
    music: '🎵',
    ecommerce: '🛍️',
  };
  return emojiMap[categoryKey] || '📦';
};

/**
 * Create category filter UI and return handler
 * @param {HTMLElement} controlsElement - Container for filter controls
 * @param {Array} categories - Categories list from webpack config
 * @param {Object} callbacks - Callback functions
 * @returns {Object} Filter control object with methods
 */
export const createCategoryFilterUI = (
  controlsElement,
  categories,
  callbacks,
) => {
  const selectedCategories = new Set();
  let filterContainer = null;

  const render = () => {
    // Remove existing filter if present
    if (filterContainer) {
      filterContainer.remove();
    }

    // Create main filter container
    filterContainer = document.createElement('section');
    filterContainer.className = 'categories-filter-section';

    // Create title/header
    const header = document.createElement('div');
    header.className = 'categories-filter-header';
    const title = document.createElement('h3');
    title.className = 'categories-filter-title';
    title.textContent = 'Browse by Category';
    header.append(title);

    if (selectedCategories.size > 0) {
      const subtitle = document.createElement('p');
      subtitle.className = 'categories-filter-subtitle';
      subtitle.textContent = `${selectedCategories.size} categor${selectedCategories.size === 1 ? 'y' : 'ies'} selected`;
      header.append(subtitle);
    }

    filterContainer.append(header);

    // Create cards grid container
    const gridContainer = document.createElement('div');
    gridContainer.className = 'categories-cards-grid';

    // Create card for each category
    for (const category of categories) {
      const card = document.createElement('button');
      card.className = 'category-card';
      card.dataset.category = category.key;
      card.setAttribute('title', category.description);
      card.type = 'button';

      if (selectedCategories.has(category.key)) {
        card.classList.add('active');
      }

      // Create card content
      const cardContent = document.createElement('div');
      cardContent.className = 'category-card-content';

      // Emoji/Icon
      const emoji = document.createElement('div');
      emoji.className = 'category-card-emoji';
      emoji.textContent = getCategoryEmoji(category.key);
      cardContent.append(emoji);

      // Label
      const label = document.createElement('div');
      label.className = 'category-card-label';
      label.textContent = category.label;
      cardContent.append(label);

      // Count
      const count = document.createElement('div');
      count.className = 'category-card-count';
      count.textContent = `${category.count} icons`;
      cardContent.append(count);

      card.append(cardContent);

      // Toggle category on click
      card.addEventListener('click', () => {
        const categoryKey = category.key;
        if (selectedCategories.has(categoryKey)) {
          selectedCategories.delete(categoryKey);
          card.classList.remove('active');
        } else {
          selectedCategories.add(categoryKey);
          card.classList.add('active');
        }

        render();

        // Call callback
        if (callbacks.onCategoryChange) {
          callbacks.onCategoryChange([...selectedCategories]);
        }
      });

      gridContainer.append(card);
    }

    filterContainer.append(gridContainer);

    // Create action buttons container
    if (selectedCategories.size > 0) {
      const actionsContainer = document.createElement('div');
      actionsContainer.className = 'categories-filter-actions';

      const clearButton = document.createElement('button');
      clearButton.className = 'categories-clear-btn';
      clearButton.textContent = 'Clear All Filters';
      clearButton.type = 'button';

      clearButton.addEventListener('click', () => {
        selectedCategories.clear();
        render();
        if (callbacks.onCategoryChange) {
          callbacks.onCategoryChange([]);
        }
      });

      actionsContainer.append(clearButton);
      filterContainer.append(actionsContainer);
    }

    // Insert at the beginning of controls
    controlsElement.insertBefore(filterContainer, controlsElement.firstChild);
  };

  // Initial render
  render();

  return {
    getSelectedCategories: () => [...selectedCategories],
    render,
  };
};
