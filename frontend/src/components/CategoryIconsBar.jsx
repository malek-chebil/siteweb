import React from 'react'
import { Group, Stack, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { categories } from '../utils/categoryIcons'
import { 
  MassageIcon, 
  BeautyIcon, 
  HotelIcon, 
  SpaIcon, 
  OtherIcon,
  HammamIcon,
  MasseuseIcon,
  MassageCenterIcon,
  MassageSchoolIcon,
  EstheticSchoolIcon
} from './CategoryIcon'

// Realistic category icons with colors and styles matching the reference image exactly
const getCategoryIconStyle = (category) => {
  const styles = {
    'Hammam': {
      IconComponent: HammamIcon,
      color: '#8b4513',
    },
    'Massage': {
      IconComponent: MassageIcon,
      color: '#4dabf7',
    },
    'Masseuse': {
      IconComponent: MasseuseIcon,
      color: '#d63384',
    },
    'Beaute Esthetique': {
      IconComponent: BeautyIcon,
      color: '#e64980',
    },
    'centre de massage': {
      IconComponent: MassageCenterIcon,
      color: '#495057',
    },
    'Spa': {
      IconComponent: SpaIcon,
      color: '#12b886',
    },
    'Ecoles de massage': {
      IconComponent: MassageSchoolIcon,
      color: '#4dabf7',
    },
    'Ecole d\'esthétique': {
      IconComponent: EstheticSchoolIcon,
      color: '#e64980',
    },
  }
  return styles[category] || styles['Massage']
}

const CategoryIconsBar = ({ onCategoryClick, transparent = false }) => {
  const { t } = useTranslation()

  return (
    <Stack gap={{ base: 'sm', sm: 'md' }} style={{ width: '100%' }}>
      <Text 
        size="lg"
        fw={600} 
        ta="center"
        hiddenFrom="sm"
        style={{ 
          textTransform: 'uppercase', 
          letterSpacing: '0.5px', 
          fontSize: '0.875rem',
          color: transparent ? 'rgba(255, 255, 255, 0.95)' : '#212529',
          textShadow: transparent ? '0 2px 4px rgba(0, 0, 0, 0.7)' : 'none',
        }}
      >
        {t('home.popularCategories')}
      </Text>
      <Text 
        size="lg"
        fw={600} 
        ta="center"
        visibleFrom="sm"
        style={{ 
          textTransform: 'uppercase', 
          letterSpacing: '0.5px',
          color: transparent ? 'rgba(255, 255, 255, 0.95)' : '#212529',
          textShadow: transparent ? '0 2px 4px rgba(0, 0, 0, 0.7)' : 'none',
        }}
      >
        {t('home.popularCategories')}
      </Text>
      <Group 
        gap={{ base: 'xs', sm: 'md', md: 'lg' }} 
        justify="center" 
        wrap="wrap"
        style={{ width: '100%' }}
      >
          {categories.map((category) => {
            const style = getCategoryIconStyle(category)
            return (
              <Stack
                key={category}
                gap="xs"
                align="center"
                className="category-icon-item"
                style={{
                  cursor: 'pointer',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                }}
                onClick={() => onCategoryClick(category)}
                onMouseEnter={(e) => {
                  if (window.innerWidth >= 768) {
                    e.currentTarget.style.backgroundColor = transparent ? 'rgba(255, 255, 255, 0.2)' : '#f8f9fa'
                    e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)'
                    e.currentTarget.style.boxShadow = `0 8px 16px ${style.color}40`
                  }
                }}
                onMouseLeave={(e) => {
                  if (window.innerWidth >= 768) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.transform = 'translateY(0) scale(1)'
                    e.currentTarget.style.boxShadow = 'none'
                  }
                }}
              >
                <div
                  className="category-icon-box"
                  style={{
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    background: transparent 
                      ? `linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%)`
                      : `linear-gradient(135deg, ${style.color}15 0%, ${style.color}08 100%)`,
                    border: transparent 
                      ? `2px solid rgba(255, 255, 255, 0.4)`
                      : `2px solid ${style.color}30`,
                    boxShadow: transparent 
                      ? '0 4px 12px rgba(0, 0, 0, 0.2)'
                      : `0 4px 12px ${style.color}20`,
                    backdropFilter: transparent ? 'blur(8px)' : 'none',
                    WebkitBackdropFilter: transparent ? 'blur(8px)' : 'none',
                  }}
                >
                  {React.createElement(style.IconComponent, {
                    size: 50,
                    color: transparent ? 'rgba(255, 255, 255, 0.95)' : style.color,
                    className: 'category-icon',
                    style: transparent ? { filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' } : undefined,
                  })}
                </div>
                <Text 
                  size="xs" 
                  fw={600} 
                  ta="center" 
                  style={{ 
                    color: transparent ? 'rgba(255, 255, 255, 0.95)' : '#212529',
                    wordBreak: 'break-word',
                    lineHeight: 1.2,
                    textShadow: transparent ? '0 2px 4px rgba(0, 0, 0, 0.7)' : 'none',
                  }}
                >
                  {category}
                </Text>
              </Stack>
            )
          })}
      </Group>
    </Stack>
  )
}

export default CategoryIconsBar

