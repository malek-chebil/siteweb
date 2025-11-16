import React from 'react'
import { Group, Stack, Text, useMantineTheme } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
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
  const theme = useMantineTheme()
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`)
  const isTablet = useMediaQuery(`(max-width: ${theme.breakpoints.md})`)

  return (
    <Stack gap={{ base: 'sm', sm: 'md' }} style={{ width: '100%' }}>
      <Text 
        size="lg"
        fw={700} 
        ta="center"
        hiddenFrom="sm"
        style={{ 
          textTransform: 'uppercase', 
          letterSpacing: '1px', 
          fontSize: '0.875rem',
          color: '#2C1810',
          background: 'linear-gradient(135deg, #8B4513 0%, #5C2E0A 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '8px',
        }}
      >
        {t('home.popularCategories')}
      </Text>
      <Text 
        size="xl"
        fw={700} 
        ta="center"
        visibleFrom="sm"
        style={{ 
          textTransform: 'uppercase', 
          letterSpacing: '1px', 
          color: '#2C1810',
          background: 'linear-gradient(135deg, #8B4513 0%, #5C2E0A 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '12px',
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
                  if (!isMobile) {
                    e.currentTarget.style.transform = 'translateY(-6px) scale(1.08)'
                    e.currentTarget.style.filter = 'brightness(1.1)'
                    if (transparent) {
                      e.currentTarget.children[0].style.boxShadow = '0 12px 32px rgba(255, 184, 77, 0.35), 0 6px 16px rgba(139, 69, 19, 0.25)'
                      e.currentTarget.children[0].style.borderColor = 'rgba(255, 184, 77, 0.50)'
                    } else {
                      e.currentTarget.children[0].style.boxShadow = `0 12px 32px ${style.color}50, 0 6px 16px rgba(139, 69, 19, 0.25)`
                      e.currentTarget.children[0].style.borderColor = `${style.color}60`
                    }
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isMobile) {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)'
                    e.currentTarget.style.filter = 'brightness(1)'
                    if (transparent) {
                      e.currentTarget.children[0].style.boxShadow = '0 6px 20px rgba(139, 69, 19, 0.20), 0 2px 8px rgba(139, 69, 19, 0.15)'
                      e.currentTarget.children[0].style.borderColor = 'rgba(255, 184, 77, 0.35)'
                    } else {
                      e.currentTarget.children[0].style.boxShadow = '0 8px 24px rgba(139, 69, 19, 0.15), 0 4px 12px rgba(139, 69, 19, 0.10)'
                      e.currentTarget.children[0].style.borderColor = 'rgba(255, 184, 77, 0.30)'
                    }
                  }
                }}
              >
                <div
                  className="category-icon-box"
                  style={{
                    borderRadius: isMobile ? '12px' : '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    width: isMobile ? '60px' : isTablet ? '70px' : '80px',
                    height: isMobile ? '60px' : isTablet ? '70px' : '80px',
                    padding: isMobile ? '8px' : '12px',
                    background: transparent 
                      ? `linear-gradient(135deg, rgba(255, 252, 248, 0.30) 0%, rgba(255, 248, 240, 0.25) 100%)`
                      : `linear-gradient(135deg, rgba(255, 252, 248, 0.85) 0%, rgba(255, 248, 240, 0.80) 100%)`,
                    border: transparent 
                      ? `1.5px solid rgba(255, 184, 77, 0.35)`
                      : `1.5px solid rgba(255, 184, 77, 0.30)`,
                    boxShadow: transparent 
                      ? '0 6px 20px rgba(139, 69, 19, 0.20), 0 2px 8px rgba(139, 69, 19, 0.15)'
                      : `0 8px 24px rgba(139, 69, 19, 0.15), 0 4px 12px rgba(139, 69, 19, 0.10)`,
                    backdropFilter: transparent ? 'blur(12px) saturate(180%)' : 'blur(16px) saturate(180%)',
                    WebkitBackdropFilter: transparent ? 'blur(12px) saturate(180%)' : 'blur(16px) saturate(180%)',
                  }}
                >
                  {React.createElement(style.IconComponent, {
                    size: isMobile ? 40 : isTablet ? 45 : 50,
                    color: transparent ? '#FFB84D' : style.color,
                    className: 'category-icon',
                    style: transparent 
                      ? { filter: 'drop-shadow(0 3px 6px rgba(255, 184, 77, 0.4))' } 
                      : { filter: `drop-shadow(0 3px 6px ${style.color}40)` },
                  })}
                </div>
                <Text 
                  size="xs" 
                  fw={600} 
                  ta="center" 
                  style={{ 
                    color: transparent ? '#2C1810' : '#2C1810',
                    wordBreak: 'break-word',
                    lineHeight: 1.2,
                    textShadow: 'none',
                    fontSize: '0.75rem',
                    letterSpacing: '0.2px',
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

