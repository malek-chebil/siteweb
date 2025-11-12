import { useState, useEffect } from 'react'
import { Container, Title, Text, SimpleGrid, Pagination, Stack, Center, Box, Group, Button } from '@mantine/core'
import { useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { IconStar, IconEye, IconList, IconSearch } from '@tabler/icons-react'
import api from '../lib/api'
import ListingCard from '../components/ListingCard'
import FiltersBar from '../components/FiltersBar'
import CategoryIconsBar from '../components/CategoryIconsBar'
import { recordVisit } from '../utils/visitStats'
import RecentViewsSection from '../components/RecentViewsSection'

const HomePage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  
  // Simple filters state for the search bar on homepage
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    category: '',
  })

  // Enregistrer une visite au chargement de la page
  useEffect(() => {
    recordVisit()
  }, [])

  // Fetch all listings for homepage display (no filters, just for display)
  const { data, isLoading, error } = useQuery(
    ['homepage-listings'],
    async () => {
      const response = await api.get('/listings?page=1&page_size=20')
      return response.data
    }
  )

  // Fetch premium listings for homepage
  const { data: premiumData, isLoading: isLoadingPremium } = useQuery(
    ['homepage-premium-listings'],
    async () => {
      const response = await api.get('/listings?is_featured=true&page=1&page_size=20')
      return response.data
    }
  )

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
  }

  const handleApplyFilters = () => {
    // Redirect to search page with filters
    const params = new URLSearchParams()
    if (filters.search) params.set('search', filters.search)
    if (filters.category) params.set('category', filters.category)
    if (filters.city) params.set('city', filters.city)
    navigate(`/search?${params.toString()}`)
  }

  const handleCategoryClick = (category) => {
    // Redirect to search page with category filter
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    navigate(`/search?${params.toString()}`)
  }


  if (error) {
    return (
      <Container>
        <Text c="red">Error loading listings: {error.message}</Text>
      </Container>
    )
  }

  return (
    <Container size="xl" py={{ base: 'md', sm: 'xl' }}>
      <Stack gap={{ base: 'md', sm: 'xl' }}>
        {/* Search Content - Directly on background */}
        <Stack gap={{ base: 'md', sm: 'xl' }} align="center">
          <FiltersBar 
            filters={filters} 
            onFiltersChange={handleFiltersChange}
            onApply={handleApplyFilters}
            transparent={true}
          />
          
          <CategoryIconsBar onCategoryClick={handleCategoryClick} transparent={true} />
        </Stack>

        {/* Section 1: Premium Listings (ALWAYS FIRST - Display even if empty) */}
        <Stack gap="md" mt="xl">
          <Group gap="xs">
            <IconStar size={24} color="#FFC300" />
            <Title order={2} size="h3" style={{ 
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              color: '#212529',
            }}>
              {t('home.premiumListings')}
            </Title>
          </Group>
          {isLoadingPremium ? (
            <Center py="md">
              <Text size="sm" c="dimmed">{t('common.loading')}</Text>
            </Center>
          ) : premiumData?.items?.filter(listing => listing.status === 'approved').length > 0 ? (
            <SimpleGrid
              cols={{ base: 1, sm: 2, md: 3, lg: 4 }}
              spacing="md"
            >
              {premiumData.items
                .filter(listing => listing.status === 'approved')
                .map((listing) => (
                  <ListingCard key={`premium-${listing.id}`} listing={listing} />
                ))}
            </SimpleGrid>
          ) : (
            <Text c="dimmed" size="sm" py="md">
              {t('home.noPremiumListings')}
            </Text>
          )}
        </Stack>

        {/* Section: Annonces récemment consultées */}
        <RecentViewsSection />

        {isLoading ? (
          <Center py="xl">
            <Text size="lg" c="dimmed">{t('common.loading')}</Text>
          </Center>
        ) : data?.items?.length > 0 ? (
          <>
            {/* Section 2: Most Viewed Listings (Second Section) */}
            {(() => {
              // Get premium IDs to exclude from other sections
              const premiumIds = premiumData?.items?.map(listing => listing.id) || []
              
              const mostViewedListings = [...(data?.items || [])]
                .filter(listing => 
                  listing.status === 'approved' && 
                  !premiumIds.includes(listing.id)
                )
                .sort((a, b) => (b.views_count || 0) - (a.views_count || 0))
              
              return mostViewedListings.length > 0 ? (
                <Stack gap="md" mt="xl">
                  <Group gap="xs">
                    <IconEye size={24} color="#FFC300" />
                    <Title order={2} size="h3" style={{ 
                      fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                      color: '#212529',
                    }}>
                      {t('home.mostViewed')}
                    </Title>
                  </Group>
                  <SimpleGrid
                    cols={{ base: 1, sm: 2, md: 3, lg: 4 }}
                    spacing="md"
                  >
                    {mostViewedListings.map((listing) => (
                      <ListingCard key={`most-viewed-${listing.id}`} listing={listing} />
                    ))}
                  </SimpleGrid>
                </Stack>
              ) : null
            })()}

            {/* Section 3: All Other Listings (Third Section) */}
            {(() => {
              // Get premium IDs and most viewed IDs to exclude
              const premiumIds = premiumData?.items?.map(listing => listing.id) || []
              
              const mostViewedListings = [...data.items]
                .filter(listing => !premiumIds.includes(listing.id))
                .sort((a, b) => (b.views_count || 0) - (a.views_count || 0))
              
              const mostViewedIds = mostViewedListings.map(listing => listing.id)
              
              const allOtherListings = [...(data?.items || [])]
                .filter(listing => 
                  listing.status === 'approved' &&
                  !premiumIds.includes(listing.id) && 
                  !mostViewedIds.includes(listing.id)
                )
              
              return allOtherListings.length > 0 ? (
                <Stack gap="md" mt="xl">
                  <Group gap="xs">
                    <IconList size={24} color="#FFC300" />
                    <Title order={2} size="h3" style={{ 
                      fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                      color: '#212529',
                    }}>
                      {t('home.allListings')}
                    </Title>
                  </Group>
                  <SimpleGrid
                    cols={{ base: 1, sm: 2, md: 3, lg: 4 }}
                    spacing="md"
                  >
                    {allOtherListings.map((listing) => (
                      <ListingCard key={`all-${listing.id}`} listing={listing} />
                    ))}
                  </SimpleGrid>
                </Stack>
              ) : null
            })()}

          </>
        ) : null}
      </Stack>
    </Container>
  )
}

export default HomePage
