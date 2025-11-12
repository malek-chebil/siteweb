import {
  IconHandFinger,
  IconScissors,
  IconBuildingStore,
  IconDroplet,
  IconCategory,
  IconUser,
  IconSchool,
} from '@tabler/icons-react'

/**
 * Maps category names to their corresponding icons
 */
export const categoryIcons = {
  'Hammam': IconDroplet,
  'Massage': IconHandFinger,
  'Masseuse': IconUser,
  'Beaute Esthetique': IconScissors,
  'centre de massage': IconBuildingStore,
  'Spa': IconDroplet,
  'Ecoles de massage': IconSchool,
  'Ecole d\'esthétique': IconSchool,
}

/**
 * Gets the icon component for a category
 * @param {string} category - The category name
 * @returns {React.Component} - The icon component or default IconCategory
 */
export const getCategoryIcon = (category) => {
  return categoryIcons[category] || IconCategory
}

/**
 * Gets all available categories
 */
export const categories = [
  'Hammam',
  'Massage',
  'Masseuse',
  'Beaute Esthetique',
  'centre de massage',
  'Spa',
  'Ecoles de massage',
  'Ecole d\'esthétique',
]

