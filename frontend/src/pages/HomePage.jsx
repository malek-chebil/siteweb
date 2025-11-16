import { useState, useEffect, useMemo } from 'react'
import { Container, Title, Text, SimpleGrid, Pagination, Stack, Center, Box, Group, Button, useMantineTheme } from '@mantine/core'
import { useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { IconSparkles, IconTrendingUp, IconGridDots, IconSearch } from '@tabler/icons-react'
import { Carousel } from '@mantine/carousel'
import { useMediaQuery } from '@mantine/hooks'
import api from '../lib/api'
import ListingCard from '../components/ListingCard'
import FiltersBar from '../components/FiltersBar'
import CategoryIconsBar from '../components/CategoryIconsBar'
import { recordVisit } from '../utils/visitStats'
import { useFavoritesBatch } from '../hooks/useFavoritesBatch'

const HomePage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const theme = useMantineTheme()
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`)
  
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

  // Fetch all active listings for "Tous les annonces" section
  const { data: allListingsData, isLoading: isLoadingAll } = useQuery(
    ['homepage-all-listings'],
    async () => {
      const response = await api.get('/listings?page=1&page_size=100')
      return response.data
    }
  )

  // OPTIMIZED: Collect all listing IDs to check favorites in batch
  const allListingIds = useMemo(() => {
    const ids = new Set()
    
    // Premium listings
    if (premiumData?.items) {
      premiumData.items
        .filter(listing => listing.status === 'approved')
        .forEach(listing => ids.add(listing.id))
    }
    
    // Most viewed listings
    if (data?.items) {
      data.items
        .filter(listing => listing.status === 'approved')
        .forEach(listing => ids.add(listing.id))
    }
    
    // All listings for carousel
    if (allListingsData?.items) {
      allListingsData.items
        .filter(listing => listing.status === 'approved')
        .forEach(listing => ids.add(listing.id))
    }
    
    return Array.from(ids)
  }, [premiumData, data, allListingsData])

  // OPTIMIZED: Check all favorites in a single batch API call
  const { favoritesMap } = useFavoritesBatch(allListingIds)

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
    <Container size="xl" py={{ base: 'md', sm: 'xl' }} px={{ base: 'md', sm: 'xl' }}>
      <Stack gap={{ base: 'md', sm: 'xl' }}>
        {/* Search Content - Directly on background */}
        <Stack gap={{ base: 'md', sm: 'xl' }} align="center" style={{ width: '100%' }}>
          <Box style={{ width: '100%', maxWidth: '100%' }}>
            <FiltersBar 
              filters={filters} 
              onFiltersChange={handleFiltersChange}
              onApply={handleApplyFilters}
              transparent={true}
            />
          </Box>
          
          <CategoryIconsBar onCategoryClick={handleCategoryClick} transparent={true} />
        </Stack>

        {/* Section 1: Premium Listings (ALWAYS FIRST - Display even if empty) */}
        <Stack gap="lg" mt="xl">
          <Group gap="md" align="center" mb="xs">
            <div style={{
              padding: '14px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(255, 195, 0, 0.15) 0%, rgba(255, 179, 0, 0.10) 100%)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '2.5px solid rgba(255, 195, 0, 0.5)',
                      boxShadow: '0 6px 16px rgba(255, 195, 0, 0.25), inset 0 1px 0 rgba(250, 248, 243, 0.5)',
            }}>
              <IconSparkles size={30} color="#FFC300" strokeWidth={2.5} fill="rgba(255, 195, 0, 0.2)" />
            </div>
            <Title order={2} size="h2" style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
              color: '#212529',
              fontWeight: 800,
              letterSpacing: '-0.5px',
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
                  <ListingCard 
                    key={`premium-${listing.id}`} 
                    listing={listing} 
                    isFavorited={favoritesMap[listing.id]}
                  />
                ))}
            </SimpleGrid>
          ) : (
            <Text c="dimmed" size="sm" py="md">
              {t('home.noPremiumListings')}
            </Text>
          )}
        </Stack>

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
                <Stack gap="lg" mt="xl">
                  <Group gap="md" align="center" mb="xs">
                    <div style={{
                      padding: '10px',
                      borderRadius: '50%',
                      background: 'rgba(250, 248, 243, 0.95)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: '3px solid rgba(255, 195, 0, 0.6)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15), 0 0 0 2px rgba(255, 195, 0, 0.1)',
                      width: '56px',
                      height: '56px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <IconTrendingUp size={26} color="#212529" strokeWidth={2.5} />
                    </div>
                    <Title order={2} size="h2" style={{ 
                      fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
                      color: '#212529',
                      fontWeight: 800,
                      letterSpacing: '-0.5px',
                    }}>
                      {t('home.mostViewed')}
                    </Title>
                  </Group>
                  <SimpleGrid
                    cols={{ base: 1, sm: 2, md: 3, lg: 4 }}
                    spacing="md"
                  >
                    {mostViewedListings.map((listing) => (
                      <ListingCard 
                        key={`most-viewed-${listing.id}`} 
                        listing={listing} 
                        isFavorited={favoritesMap[listing.id]}
                      />
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
                <Stack gap="lg" mt="xl">
                  <Group gap="md" align="center" mb="xs">
                    <div style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      background: 'rgba(250, 248, 243, 0.98)',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      border: '2px solid rgba(255, 195, 0, 0.4)',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08), inset 0 1px 1px rgba(250, 248, 243, 0.8)',
                      transform: 'rotate(-2deg)',
                    }}>
                      <IconGridDots size={28} color="#212529" strokeWidth={2} />
                    </div>
                    <Title order={2} size="h2" style={{
                      fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
                      color: '#212529',
                      fontWeight: 800,
                      letterSpacing: '-0.5px',
                    }}>
                      {t('home.allListings')}
                    </Title>
                  </Group>
                  <SimpleGrid
                    cols={{ base: 1, sm: 2, md: 3, lg: 4 }}
                    spacing="md"
                  >
                    {allOtherListings.map((listing) => (
                      <ListingCard 
                        key={`all-${listing.id}`} 
                        listing={listing} 
                        isFavorited={favoritesMap[listing.id]}
                      />
                    ))}
                  </SimpleGrid>
                </Stack>
              ) : null
            })()}

          </>
        ) : null}

        {/* Section 4: Tous les annonces - Horizontal Display */}
        {(() => {
          const allActiveListings = (allListingsData?.items || [])
            .filter(listing => listing.status === 'approved')
          
          return allActiveListings.length > 0 ? (
            <Stack gap="lg" mt="xl">
              <Group gap="md" align="center" mb="xs">
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.98)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  border: '2px solid rgba(255, 195, 0, 0.4)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.8)',
                  transform: 'rotate(-2deg)',
                }}>
                  <IconGridDots size={28} color="#212529" strokeWidth={2} />
                </div>
                <Title order={2} size="h2" style={{
                  fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
                  color: '#212529',
                  fontWeight: 800,
                  letterSpacing: '-0.5px',
                }}>
                  {t('home.allListings')}
                </Title>
              </Group>
              {isLoadingAll ? (
                <Center py="xl">
                  <Text size="lg" c="dimmed">{t('common.loading')}</Text>
                </Center>
              ) : (
                <Box style={{ width: '100%' }}>
                  <Carousel
                    slideSize={{ base: '100%', sm: '50%', md: '33.333%', lg: '25%' }}
                    slideGap={{ base: 'md', sm: 'md' }}
                    align="start"
                    emblaOptions={{ align: 'start', slidesToScroll: mobile ? 1 : 2 }}
                    withIndicators
                    loop
                    styles={{
                      control: {
                        '&[data-inactive]': {
                          opacity: 0,
                          cursor: 'default',
                        },
                      },
                      slide: {
                        height: 'auto',
                        minHeight: '450px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        padding: '0 8px',
                      },
                      container: {
                        padding: '0 16px',
                      },
                    }}
                  >
                        {allActiveListings.map((listing) => (
                          <Carousel.Slide key={`all-horizontal-${listing.id}`}>
                            <div style={{ width: '100%', minHeight: '450px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
                              <ListingCard 
                                listing={listing} 
                                variant="compact" 
                                isFavorited={favoritesMap[listing.id]}
                              />
                            </div>
                          </Carousel.Slide>
                        ))}
                  </Carousel>
                </Box>
              )}
            </Stack>
          ) : null
        })()}
      </Stack>
    </Container>
  )
}

export default HomePage
