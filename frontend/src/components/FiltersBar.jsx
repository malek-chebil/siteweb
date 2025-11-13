import { Paper, TextInput, Select, Group, Button, Stack, Text, Box } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { IconSearch, IconMapPin, IconCategory } from '@tabler/icons-react'
import { categories, getCategoryIcon } from '../utils/categoryIcons'

const FiltersBar = ({ filters, onFiltersChange, onApply, transparent = false }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const cities = [
   'Tunis',
   'Sfax',
   'Sousse',
   'Ettadhamen',
   'Kairouan',
   'Gabès',
   'Bizerte',
   'Ariana',
   'Gafsa',
   'Monastir',
   'Ben Arous',
   'La Goulette',
   'Mars',
   'Nabeul',
   'Zarzis',
   'Médenine',
   'Mahdia',
   'Kasserine',
   'Kebili',
   'Beja',
   'Jendouba',
   'Le Kef',
   'Siliana',
   'Tozeur',
   'Tataouine',
   'Manouba',
   'Autre',
  ]

  const handleSearch = () => {
    // If onApply is provided, use it (for SearchPage)
    // Otherwise, redirect to search page (for HomePage)
    if (onApply) {
      onApply()
    } else {
      const params = new URLSearchParams()
      if (filters.search) params.set('search', filters.search)
      if (filters.category) params.set('category', filters.category)
      if (filters.city) params.set('city', filters.city)
      navigate(`/search?${params.toString()}`)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const selectedCategory = categories.find(cat => cat === filters.category)

  if (transparent) {
    const inputStyle = {
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      border: '2px solid rgba(255, 195, 0, 0.4)',
      color: '#212529',
      fontSize: '1rem',
      fontWeight: 600,
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      '&::placeholder': {
        color: '#868e96',
        fontWeight: 500,
      },
      '&:focus': {
        backgroundColor: '#ffffff',
        borderColor: 'rgba(255, 195, 0, 0.7)',
        boxShadow: '0 0 0 3px rgba(255, 195, 0, 0.2)',
        color: '#212529',
      },
      '&:hover': {
        borderColor: 'rgba(255, 195, 0, 0.6)',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        color: '#212529',
      },
    }

    const iconStyle = {
      color: '#FFC300',
    }

    return (
      <Box 
        p={{ base: 'md', sm: 'xl' }}
        style={{
          backgroundColor: 'transparent',
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
          boxShadow: 'none',
          border: 'none',
          width: '100%',
          maxWidth: '1000px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '8rem',
        }}
      >
        <Stack gap="md" style={{ width: '100%', alignItems: 'center' }}>
          {/* Search Bar */}
          <TextInput
            placeholder={t('filters.whatAreYouLookingFor')}
            value={filters.search || ''}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            onKeyPress={handleKeyPress}
            size="lg"
            radius="md"
            style={{ width: '100%' }}
            leftSection={<IconSearch size={20} style={iconStyle} />}
            styles={{
              input: {
                ...inputStyle,
                '&::selection': {
                  backgroundColor: 'rgba(255, 195, 0, 0.3)',
                  color: '#212529',
                },
              },
              label: {
                color: '#212529',
                fontWeight: 600,
              },
            }}
          />

          {/* Filters Row */}
          <Group gap="md" align="flex-end" wrap="wrap" grow style={{ width: '100%' }}>
            <Select
              placeholder={t('filters.allCategories')}
              data={categories.map(cat => ({
                value: cat,
                label: cat,
              }))}
              value={filters.category || null}
              onChange={(value) => onFiltersChange({ ...filters, category: value })}
              clearable
              size="md"
              radius="md"
              searchable
              leftSection={selectedCategory ? (() => {
                const CategoryIcon = getCategoryIcon(selectedCategory)
                return <CategoryIcon size={18} style={iconStyle} />
              })() : <IconCategory size={18} style={iconStyle} />}
              renderOption={({ option }) => {
                const CategoryIcon = getCategoryIcon(option.value)
                return (
                  <Group gap="xs">
                    <CategoryIcon size={18} style={{ color: '#FFC300' }} />
                    <Text>{option.label}</Text>
                  </Group>
                )
              }}
              styles={{
                input: {
                  ...inputStyle,
                  color: '#212529 !important',
                  '&::placeholder': {
                    color: '#868e96 !important',
                  },
                  '&[data-selected]': {
                    color: '#212529 !important',
                  },
                },
                inputLabel: {
                  color: '#212529',
                  fontWeight: 600,
                },
                dropdown: {
                  backgroundColor: '#fff',
                },
                option: {
                  color: '#212529',
                },
                section: {
                  color: '#FFC300',
                },
                value: {
                  color: '#212529 !important',
                },
              }}
            />

            <Select
              placeholder={t('filters.countryRegionCity')}
              data={cities}
              value={filters.city || null}
              onChange={(value) => onFiltersChange({ ...filters, city: value })}
              clearable
              size="md"
              radius="md"
              searchable
              leftSection={<IconMapPin size={18} style={iconStyle} />}
              styles={{
                input: {
                  ...inputStyle,
                  color: '#212529 !important',
                  '&::placeholder': {
                    color: '#868e96 !important',
                  },
                  '&[data-selected]': {
                    color: '#212529 !important',
                  },
                },
                inputLabel: {
                  color: '#212529',
                  fontWeight: 600,
                },
                dropdown: {
                  backgroundColor: '#fff',
                },
                option: {
                  color: '#212529',
                },
                section: {
                  color: '#FFC300',
                },
                value: {
                  color: '#212529 !important',
                },
              }}
            />
          </Group>

          {/* Search Button - Centered Below */}
          <Group justify="center" mt="xs">
            <Button
              onClick={handleSearch}
              size="lg"
              radius="md"
              px="xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 195, 0, 0.85) 0%, rgba(255, 179, 0, 0.85) 100%)',
                border: '2px solid rgba(255, 195, 0, 0.5)',
                fontWeight: 600,
                color: '#fff',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                boxShadow: '0 4px 16px rgba(255, 195, 0, 0.4)',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                minWidth: '200px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 195, 0, 0.95) 0%, rgba(255, 179, 0, 0.95) 100%)'
                e.currentTarget.style.borderColor = 'rgba(255, 195, 0, 0.7)'
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 195, 0, 0.5)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 195, 0, 0.85) 0%, rgba(255, 179, 0, 0.85) 100%)'
                e.currentTarget.style.borderColor = 'rgba(255, 195, 0, 0.5)'
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(255, 195, 0, 0.4)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <IconSearch size={20} style={{ marginRight: '8px' }} />
              {t('common.search')}
            </Button>
          </Group>
        </Stack>
      </Box>
    )
  }

  return (
    <Paper 
      p={{ base: 'md', sm: 'xl' }}
      radius="lg" 
      withBorder
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.80)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(233, 236, 239, 0.5)',
      }}
    >
      <Stack gap="md">
        <Text 
          size="sm" 
          fw={600} 
          c="dimmed" 
          mb="xs" 
          visibleFrom="sm"
        >
          {t('filters.platform')}
        </Text>
        
        <Stack gap={4}>
          <Text 
            size="xs" 
            fw={500} 
            c="dimmed" 
            style={{ 
              textTransform: 'uppercase', 
              letterSpacing: '0.5px',
            }}
          >
            {t('filters.whatAreYouLookingFor')}
          </Text>
          <TextInput
            placeholder={t('filters.whatAreYouLookingFor')}
            value={filters.search || ''}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            onKeyPress={handleKeyPress}
            size="md"
            radius="md"
            leftSection={<IconSearch size={18} style={{ color: '#868e96' }} />}
            styles={{
              input: {
                border: '1px solid #e9ecef',
                transition: 'all 0.2s ease',
                '&:focus': {
                  borderColor: '#4dabf7',
                  boxShadow: '0 0 0 3px rgba(77, 171, 247, 0.1)',
                },
              },
            }}
          />
        </Stack>
        
        <Group gap="md" align="flex-end" grow wrap>
          <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
            <Text 
              size="xs" 
              fw={500} 
              c="dimmed" 
              style={{ 
                textTransform: 'uppercase', 
                letterSpacing: '0.5px',
              }}
            >
              {t('filters.inWhichCategory')}
            </Text>
            <Select
              placeholder={t('filters.allCategories')}
              data={categories.map(cat => ({
                value: cat,
                label: cat,
              }))}
              value={filters.category || null}
              onChange={(value) => onFiltersChange({ ...filters, category: value })}
              clearable
              size="md"
              radius="md"
              searchable
              leftSection={selectedCategory ? (() => {
                const CategoryIcon = getCategoryIcon(selectedCategory)
                return <CategoryIcon size={18} style={{ color: '#4dabf7' }} />
              })() : <IconCategory size={18} style={{ color: '#868e96' }} />}
              renderOption={({ option }) => {
                const CategoryIcon = getCategoryIcon(option.value)
                return (
                  <Group gap="xs">
                    <CategoryIcon size={18} style={{ color: '#4dabf7' }} />
                    <Text>{option.label}</Text>
                  </Group>
                )
              }}
              styles={{
                input: {
                  border: '1px solid #e9ecef',
                  transition: 'all 0.2s ease',
                  '&:focus': {
                    borderColor: '#4dabf7',
                    boxShadow: '0 0 0 3px rgba(77, 171, 247, 0.1)',
                  },
                },
                dropdown: {
                  backgroundColor: '#fff',
                },
              }}
            />
          </Stack>

          <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
            <Text 
              size="xs" 
              fw={500} 
              c="dimmed" 
              style={{ 
                textTransform: 'uppercase', 
                letterSpacing: '0.5px',
              }}
            >
              {t('filters.whereIsIt')}
            </Text>
            <Select
              placeholder={t('filters.countryRegionCity')}
              data={cities}
              value={filters.city || null}
              onChange={(value) => onFiltersChange({ ...filters, city: value })}
              clearable
              size="md"
              radius="md"
              searchable
              leftSection={<IconMapPin size={18} style={{ color: '#868e96' }} />}
              styles={{
                input: {
                  border: '1px solid #e9ecef',
                  transition: 'all 0.2s ease',
                  '&:focus': {
                    borderColor: '#4dabf7',
                    boxShadow: '0 0 0 3px rgba(77, 171, 247, 0.1)',
                  },
                },
                dropdown: {
                  backgroundColor: '#fff',
                },
              }}
            />
          </Stack>

          <Button
            onClick={handleSearch}
            size="md"
            radius="md"
            style={{
              backgroundColor: '#4dabf7',
              border: 'none',
              fontWeight: 600,
            }}
            visibleFrom="sm"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#339af0'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#4dabf7'
            }}
          >
            <IconSearch size={20} style={{ color: '#fff' }} />
          </Button>
        </Group>

        <Button
          onClick={handleSearch}
          size="md"
          radius="md"
          fullWidth
          hiddenFrom="sm"
          style={{
            backgroundColor: '#4dabf7',
            border: 'none',
            fontWeight: 600,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#339af0'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#4dabf7'
          }}
        >
          <IconSearch size={18} style={{ color: '#fff', marginRight: '8px' }} />
          {t('common.search')}
        </Button>
      </Stack>
    </Paper>
  )
}

export default FiltersBar
