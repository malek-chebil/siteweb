import { useState } from 'react'
import { 
  Paper, 
  Stack, 
  Text, 
  Select,
  TextInput, 
  Button, 
  Checkbox, 
  Group,
  Divider,
  Title
} from '@mantine/core'
import { IconSearch, IconMapPin, IconCategory } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { categories, getCategoryIcon } from '../utils/categoryIcons'

const SearchSidebar = ({ filters, onFiltersChange, onApply }) => {
  const { t } = useTranslation()

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

  const periods = [
    { value: 'all', label: 'Toutes les périodes' },
    { value: 'yesterday', label: "Hier" },
    { value: 'last_week', label: 'La semaine dernière' },
    { value: 'last_month', label: 'Le mois dernier' },
  ]

  const selectedCategory = categories.find(cat => cat === filters.category)

  const handleApply = () => {
    if (onApply) {
      onApply()
    }
  }

  return (
    <Paper 
      p={{ base: 'sm', sm: 'md' }}
      radius="md" 
      withBorder
      className="search-sidebar"
      style={{
        height: 'fit-content',
      }}
    >
      <Stack gap="lg">
        {/* Location Filter */}
        <Stack gap="xs">
          <Text size="sm" fw={600}>Localisation</Text>
          <Select
            placeholder="Ville, région ou pays"
            data={cities}
            value={filters.city || null}
            onChange={(value) => onFiltersChange({ ...filters, city: value })}
            clearable
            size="sm"
            searchable
            leftSection={<IconMapPin size={16} style={{ color: '#868e96' }} />}
          />
        </Stack>

        {/* Category Filter */}
        <Stack gap="xs">
          <Text size="sm" fw={600}>Catégorie</Text>
          <Select
            placeholder="Toutes les catégories"
            data={categories.map(cat => ({
              value: cat,
              label: cat,
            }))}
            value={filters.category || null}
            onChange={(value) => onFiltersChange({ ...filters, category: value })}
            clearable
            size="sm"
            searchable
            leftSection={selectedCategory ? (() => {
              const CategoryIcon = getCategoryIcon(selectedCategory)
              return <CategoryIcon size={16} style={{ color: '#4dabf7' }} />
            })() : <IconCategory size={16} style={{ color: '#868e96' }} />}
            renderOption={({ option }) => {
              const CategoryIcon = getCategoryIcon(option.value)
              return (
                <Group gap="xs">
                  <CategoryIcon size={16} style={{ color: '#4dabf7' }} />
                  <Text>{option.label}</Text>
                </Group>
              )
            }}
          />
        </Stack>

        {/* Price Range */}
        <Stack gap="xs">
          <Text size="sm" fw={600}>Prix</Text>
          <Group gap="xs" grow>
            <TextInput
              placeholder="Min Dinars"
              value={filters.min_price || ''}
              onChange={(e) => {
                const value = e.target.value
                onFiltersChange({ 
                  ...filters, 
                  min_price: value ? parseFloat(value) : null 
                })
              }}
              size="sm"
              type="number"
              min="0"
            />
            <TextInput
              placeholder="Max Dinars"
              value={filters.max_price || ''}
              onChange={(e) => {
                const value = e.target.value
                onFiltersChange({ 
                  ...filters, 
                  max_price: value ? parseFloat(value) : null 
                })
              }}
              size="sm"
              type="number"
              min="0"
            />
          </Group>
        </Stack>

        {/* Period Filter */}
        <Stack gap="xs">
          <Text size="sm" fw={600}>Période</Text>
          <Select
            placeholder="Sélectionner la période"
            data={periods}
            value={filters.period || 'all'}
            onChange={(value) => onFiltersChange({ ...filters, period: value || 'all' })}
            size="sm"
          />
        </Stack>

        {/* Checkboxes */}
        <Stack gap="xs">
          <Checkbox
            label="Seulement les annonces avec photo"
            checked={filters.has_images || false}
            onChange={(e) => onFiltersChange({ ...filters, has_images: e.currentTarget.checked })}
            size="sm"
          />
          <Checkbox
            label="Seulement les annonces premium"
            checked={filters.is_featured || false}
            onChange={(e) => onFiltersChange({ 
              ...filters, 
              is_featured: e.currentTarget.checked ? true : null 
            })}
            size="sm"
          />
        </Stack>

        {/* Search Button */}
        <Button
          onClick={handleApply}
          size="md"
          fullWidth
          leftSection={<IconSearch size={18} />}
          style={{
            backgroundColor: '#4dabf7',
          }}
        >
          Rechercher
        </Button>

        {/* Navigate Section */}
        <Divider />
        <Stack gap="xs">
          {/* <Title order={4} size="h5" fw={600}>Naviguer</Title> */}
         
        </Stack>
      </Stack>
    </Paper>
  )
}

export default SearchSidebar
