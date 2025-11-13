import { useState, useEffect, useMemo } from 'react'
import { Container, Title, Text, SimpleGrid, Pagination, Stack, Center, Paper, Box, Group, Badge, ScrollArea, Tabs, Select, ActionIcon, Grid } from '@mantine/core'
import { Carousel } from '@mantine/carousel'
import { useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { IconStar, IconEye, IconList, IconX, IconGrid3x3, IconList as IconListMode, IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import api from '../lib/api'
import ListingCard from '../components/ListingCard'
import ListingCardList from '../components/ListingCardList'
import SearchSidebar from '../components/SearchSidebar'

const SearchPage = () => {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  
  // Scroll to top when page loads or search params change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [searchParams])
  
  // Helper function to safely parse URL params
  const parseFiltersFromURL = () => {
    try {
      const category = searchParams.get('category') || ''
      const city = searchParams.get('city') || ''
      const search = searchParams.get('search') || ''
      const min_priceParam = searchParams.get('min_price')
      const max_priceParam = searchParams.get('max_price')
      const period = searchParams.get('period') || 'all'
      const has_images = searchParams.get('has_images') === 'true'
      const is_featured = searchParams.get('is_featured') === 'true'
      const pageParam = searchParams.get('page')
      
      const min_price = min_priceParam && !isNaN(parseFloat(min_priceParam)) ? parseFloat(min_priceParam) : null
      const max_price = max_priceParam && !isNaN(parseFloat(max_priceParam)) ? parseFloat(max_priceParam) : null
      const page = pageParam && !isNaN(parseInt(pageParam, 10)) ? parseInt(pageParam, 10) : 1
      const validPage = page < 1 ? 1 : page
      
      return {
        search: String(search),
        city: String(city),
        category: String(category),
        min_price,
        max_price,
        period: String(period),
        has_images: Boolean(has_images),
        is_featured: is_featured ? true : null,
        page: validPage,
        page_size: 20,
      }
    } catch (error) {
      console.error('Error parsing filters from URL:', error)
      return {
        search: '',
        city: '',
        category: '',
        min_price: null,
        max_price: null,
        period: 'all',
        has_images: false,
        is_featured: null,
        page: 1,
        page_size: 20,
      }
    }
  }

  // Initialize filters from URL params
  const initialFilters = useMemo(() => parseFiltersFromURL(), [])
  
  const [filters, setFilters] = useState(initialFilters)
  const [appliedFilters, setAppliedFilters] = useState(initialFilters)
  const [viewMode, setViewMode] = useState('list')
  const [sortBy, setSortBy] = useState('newest')

  // Check if filters are empty (no active filters)
  const hasActiveFilters = useMemo(() => {
    if (!appliedFilters || typeof appliedFilters !== 'object') return false
    return !!(
      appliedFilters.search ||
      appliedFilters.city ||
      appliedFilters.category ||
      appliedFilters.min_price ||
      appliedFilters.max_price ||
      (appliedFilters.period && appliedFilters.period !== 'all') ||
      appliedFilters.has_images ||
      appliedFilters.is_featured
    )
  }, [appliedFilters])

  // Update filters when URL params change
  useEffect(() => {
    const newFilters = parseFiltersFromURL()
    setFilters(newFilters)
    setAppliedFilters(newFilters)
  }, [searchParams])

  // Create a stable, serializable query key
  const queryKey = useMemo(() => {
    if (!appliedFilters || typeof appliedFilters !== 'object' || Array.isArray(appliedFilters)) {
      return ['listings', 'default']
    }
    return [
      'listings',
      appliedFilters.search || '',
      appliedFilters.city || '',
      appliedFilters.category || '',
      appliedFilters.min_price || 0,
      appliedFilters.max_price || 0,
      appliedFilters.period || 'all',
      appliedFilters.page || 1,
    ]
  }, [appliedFilters])

  // Create premium query key
  const premiumQueryKey = useMemo(() => {
    if (!appliedFilters || typeof appliedFilters !== 'object' || Array.isArray(appliedFilters)) {
      return ['premium-listings', 'default']
    }
    return [
      'premium-listings',
      appliedFilters.search || '',
      appliedFilters.city || '',
      appliedFilters.category || '',
      appliedFilters.min_price || 0,
      appliedFilters.max_price || 0,
      appliedFilters.period || 'all',
      appliedFilters.page || 1,
    ]
  }, [appliedFilters])

  // Fetch all listings for display (always fetch, even without filters)
  const { data, isLoading, error, refetch } = useQuery(
    queryKey,
    async () => {
      const params = new URLSearchParams()
      if (appliedFilters && typeof appliedFilters === 'object' && !Array.isArray(appliedFilters)) {
        const backendFilters = { ...appliedFilters }
        delete backendFilters.has_images
        
        Object.entries(backendFilters).forEach(([key, value]) => {
          if (value !== null && value !== '' && value !== undefined && key !== 'has_images' && key !== 'page_size') {
            if (key === 'period' && value === 'all') {
              return
            }
            params.append(key, String(value))
          }
        })
      }
      // Always add page and page_size
      if (!params.has('page')) {
        params.append('page', String(appliedFilters?.page || 1))
      }
      params.append('page_size', String(appliedFilters?.page_size || 20))
      const response = await api.get(`/listings?${params.toString()}`)
      return response.data
    },
    {
      keepPreviousData: true,
      enabled: true, // Always enabled
    }
  )

  // Fetch premium listings separately (always fetch, even without filters)
  const { data: premiumData, isLoading: isLoadingPremium } = useQuery(
    premiumQueryKey,
    async () => {
      const params = new URLSearchParams()
      if (appliedFilters && typeof appliedFilters === 'object' && !Array.isArray(appliedFilters)) {
        const backendFilters = { ...appliedFilters }
        delete backendFilters.has_images
        delete backendFilters.is_featured
        
        Object.entries(backendFilters).forEach(([key, value]) => {
          if (value !== null && value !== '' && value !== undefined && key !== 'has_images' && key !== 'page_size') {
            if (key === 'period' && value === 'all') {
              return
            }
            params.append(key, String(value))
          }
        })
      }
      params.append('is_featured', 'true')
      // Fetch more premium listings for carousel
      params.append('page_size', '50') // Get more premium listings for carousel
      const response = await api.get(`/listings?${params.toString()}`)
      return response.data
    },
    {
      keepPreviousData: true,
      enabled: true, // Always enabled
    }
  )

  const handleFiltersChange = (newFilters) => {
    if (newFilters && typeof newFilters === 'object' && !Array.isArray(newFilters)) {
      setFilters({ ...newFilters, page: 1 })
    }
  }

  const handleApplyFilters = () => {
    if (filters && typeof filters === 'object' && !Array.isArray(filters)) {
      setAppliedFilters({ ...filters, page: 1 })
      const params = new URLSearchParams()
      if (filters.search) params.set('search', String(filters.search))
      if (filters.category) params.set('category', String(filters.category))
      if (filters.city) params.set('city', String(filters.city))
      if (filters.min_price) params.set('min_price', String(filters.min_price))
      if (filters.max_price) params.set('max_price', String(filters.max_price))
      if (filters.period && filters.period !== 'all') params.set('period', String(filters.period))
      if (filters.has_images) params.set('has_images', 'true')
      if (filters.is_featured) params.set('is_featured', 'true')
      setSearchParams(params)
    }
  }

  const handleClear = () => {
    const clearedFilters = {
      search: '',
      city: '',
      category: '',
      min_price: null,
      max_price: null,
      period: 'all',
      has_images: false,
      is_featured: null,
      page: 1,
      page_size: 20,
    }
    setFilters(clearedFilters)
    setAppliedFilters(clearedFilters)
    setSearchParams({})
    // Stay on search page to show all listings
  }

  const handlePageChange = (page) => {
    if (appliedFilters && typeof appliedFilters === 'object' && !Array.isArray(appliedFilters)) {
      const newFilters = { ...appliedFilters, page: Number(page) }
      setFilters(newFilters)
      setAppliedFilters(newFilters)
      const params = new URLSearchParams(searchParams)
      params.set('page', String(page))
      setSearchParams(params)
    }
  }

  const handleRemoveFilter = (filterKey) => {
    if (filters && typeof filters === 'object' && !Array.isArray(filters)) {
      const newFilters = { 
        ...filters, 
        [filterKey]: filterKey === 'period' ? 'all' : (filterKey === 'has_images' || filterKey === 'is_featured' ? false : null),
        page: 1
      }
      setFilters(newFilters)
      setAppliedFilters(newFilters)
      
      const params = new URLSearchParams()
      Object.entries(newFilters).forEach(([key, value]) => {
        if (key === 'page' || key === 'page_size') return
        if (key === 'period' && value === 'all') return
        if (key === 'has_images' || key === 'is_featured') {
          if (value) params.set(key, 'true')
          return
        }
        if (value !== null && value !== '' && value !== undefined) {
          params.set(key, String(value))
        }
      })
      setSearchParams(params)
    }
  }

  // Get active filters for badges
  const getActiveFilters = () => {
    const active = []
    if (appliedFilters && typeof appliedFilters === 'object' && !Array.isArray(appliedFilters)) {
      if (appliedFilters.search) active.push({ key: 'search', label: String(appliedFilters.search) })
      if (appliedFilters.category) active.push({ key: 'category', label: String(appliedFilters.category) })
      if (appliedFilters.city) active.push({ key: 'city', label: String(appliedFilters.city) })
      if (appliedFilters.min_price) active.push({ key: 'min_price', label: `${t('search.min')}: ${appliedFilters.min_price} ${t('listing.priceCurrency')}` })
      if (appliedFilters.max_price) active.push({ key: 'max_price', label: `${t('search.max')}: ${appliedFilters.max_price} ${t('listing.priceCurrency')}` })
      if (appliedFilters.period && appliedFilters.period !== 'all') {
        const periodLabels = {
          'yesterday': t('search.yesterday'),
          'last_week': t('search.lastWeek'),
          'last_month': t('search.lastMonth'),
        }
        active.push({ key: 'period', label: periodLabels[appliedFilters.period] || String(appliedFilters.period) })
      }
      if (appliedFilters.has_images) active.push({ key: 'has_images', label: t('search.withPhotos') })
      if (appliedFilters.is_featured) active.push({ key: 'is_featured', label: t('search.premium') })
    }
    return active
  }

  // Sort listings
  const sortListings = (listings) => {
    if (!listings || !Array.isArray(listings)) return []
    const sorted = [...listings]
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      case 'price_low':
        return sorted.sort((a, b) => (a.price || 0) - (b.price || 0))
      case 'price_high':
        return sorted.sort((a, b) => (b.price || 0) - (a.price || 0))
      default:
        return sorted
    }
  }

  return (
    <Container size="xl" pt={{ base: '2xl', sm: '4xl', md: '5xl' }} pb={{ base: 'md', sm: 'xl' }} px={{ base: 'md', sm: 'xl' }}>
      <Stack gap={{ base: 'md', sm: 'xl' }}>
        {/* Results Section */}
        <Grid gutter={{ base: 'xs', sm: 'md' }}>
          {/* Sidebar Filters */}
          <Grid.Col span={{ base: 12, md: 3 }} order={{ base: 2, md: 1 }}>
            <Box style={{ position: 'sticky', top: '100px', alignSelf: 'flex-start' }}>
              <SearchSidebar 
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onApply={handleApplyFilters}
              />
            </Box>
          </Grid.Col>

          {/* Results Content */}
          <Grid.Col span={{ base: 12, md: 9 }} order={{ base: 1, md: 2 }}>
            <Stack gap="md">
              {/* Results Header */}
              <Stack gap="xs">
                <Text size="lg" fw={600} visibleFrom="sm">
                  {hasActiveFilters 
                    ? `${data?.total || 0} ${t('search.resultsMatch')}`
                    : `${t('search.allListings')} (${data?.total || 0})`
                  }
                </Text>
                <Text size="md" fw={600} hiddenFrom="sm">
                  {hasActiveFilters 
                    ? `${data?.total || 0} ${t('search.results')}`
                    : `${data?.total || 0} ${t('listing.noListings').toLowerCase()}`
                  }
                </Text>
                
                <Group justify="space-between" align="center" wrap="wrap" gap="xs">
                  {/* View Mode Toggle */}
                  <Group gap={4}>
                    <ActionIcon
                      variant={viewMode === 'grid' ? 'filled' : 'default'}
                      color={viewMode === 'grid' ? 'blue' : 'gray'}
                      onClick={() => setViewMode('grid')}
                      size="lg"
                    >
                      <IconGrid3x3 size={18} />
                    </ActionIcon>
                    <ActionIcon
                      variant={viewMode === 'list' ? 'filled' : 'default'}
                      color={viewMode === 'list' ? 'blue' : 'gray'}
                      onClick={() => setViewMode('list')}
                      size="lg"
                    >
                      <IconListMode size={18} />
                    </ActionIcon>
                  </Group>

                  {/* Sort Select */}
                  <Select
                    value={sortBy}
                    onChange={(value) => setSortBy(value || 'newest')}
                    data={[
                      { value: 'newest', label: t('search.newest') },
                      { value: 'oldest', label: t('search.oldest') },
                      { value: 'price_low', label: t('search.priceLow') },
                      { value: 'price_high', label: t('search.priceHigh') },
                    ]}
                    size="sm"
                    style={{ width: '100%', maxWidth: '200px' }}
                  />
                </Group>
              </Stack>

              {/* Active Filters */}
              {getActiveFilters().length > 0 && (
                <Group gap="xs">
                  <Text size="sm" fw={500}>{t('search.activeFilters')}</Text>
                  {getActiveFilters().map((filter) => (
                    <Badge
                      key={filter.key}
                      rightSection={
                        <ActionIcon
                          size="xs"
                          color="blue"
                          radius="xl"
                          variant="transparent"
                          onClick={() => handleRemoveFilter(filter.key)}
                        >
                          <IconX size={10} />
                        </ActionIcon>
                      }
                      variant="light"
                      color="blue"
                    >
                      {filter.label}
                    </Badge>
                  ))}
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    onClick={handleClear}
                    size="sm"
                  >
                    <IconX size={16} />
                  </ActionIcon>
                </Group>
              )}

              {/* Tabs */}
              <Tabs defaultValue="all">
                <Tabs.List>
                  <Tabs.Tab value="all">{t('search.allListings')}</Tabs.Tab>
                  <Tabs.Tab value="personal">{t('search.personal')}</Tabs.Tab>
                  <Tabs.Tab value="company">{t('search.company')}</Tabs.Tab>
                </Tabs.List>
              </Tabs>

              {/* Premium Listings - Carousel (always show when no filters or when premium exist) */}
              {(() => {
                const premiumListings = (premiumData?.items && Array.isArray(premiumData.items)) 
                  ? premiumData.items.filter(listing => listing.status === 'approved')
                  : []
                const filteredPremium = appliedFilters?.has_images 
                  ? premiumListings.filter(listing => listing.media && listing.media.length > 0)
                  : premiumListings
                
                return filteredPremium.length > 0 ? (
                  <Stack gap="md">
                    <Group gap="xs">
                      <IconStar size={20} color="var(--mantine-color-yellow-6)" />
                      <Title order={2} size="h3" fw={600}>
                        {t('home.premiumListings')}
                      </Title>
                    </Group>
                    <Carousel
                      slideSize="280px"
                      slideGap="md"
                      align="start"
                      slidesToScroll="auto"
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
                          height: '450px',
                          width: '280px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'flex-start',
                        },
                        container: {
                          padding: '0 10px',
                        },
                      }}
                    >
                      {filteredPremium.map((listing) => (
                        <Carousel.Slide key={`premium-${listing.id}`}>
                          <div style={{ width: '280px', height: '450px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
                            <ListingCard listing={listing} variant="compact" />
                          </div>
                        </Carousel.Slide>
                      ))}
                    </Carousel>
                  </Stack>
                ) : null
              })()}

              {/* All Other Listings */}
              {isLoading ? (
                <Center py="xl">
                  <Text size="lg" c="dimmed">{t('common.loading')}</Text>
                </Center>
              ) : error ? (
                <Center py="xl">
                  <Text size="lg" c="red">{t('common.error')}</Text>
                </Center>
              ) : (() => {
                // Get all listings (premium excluded)
                const premiumIds = (premiumData?.items && Array.isArray(premiumData.items)) 
                  ? premiumData.items.map(listing => listing.id) 
                  : []
                const allListings = (data?.items && Array.isArray(data.items))
                  ? data.items.filter(listing => !premiumIds.includes(listing.id))
                  : []
                
                // Filter out non-approved listings (defense in depth)
                let filteredListings = allListings.filter(listing => listing.status === 'approved')
                if (appliedFilters?.has_images) {
                  filteredListings = filteredListings.filter(
                    listing => listing.media && listing.media.length > 0
                  )
                }
                
                const sortedListings = sortListings(filteredListings)
                
                // Always show listings section, even if empty (for no filters case)
                if (!hasActiveFilters || sortedListings.length > 0) {
                  return (
                    <Stack gap="md">
                      {hasActiveFilters && sortedListings.length === 0 ? (
                        <Center py="xl">
                          <Stack align="center" gap="md">
                            <Text size="lg" c="dimmed">
                              {t('search.noResults')}
                            </Text>
                            <Text size="sm" c="dimmed">
                              {t('search.tryDifferentFilters')}
                            </Text>
                          </Stack>
                        </Center>
                      ) : sortedListings.length > 0 ? (
                        <>
                          {hasActiveFilters ? (
                            <Title order={2} size="h3" fw={600}>
                              {t('search.otherListings')}
                            </Title>
                          ) : (
                            <Title order={2} size="h3" fw={600}>
                              {t('search.allListings')}
                            </Title>
                          )}
                          {viewMode === 'grid' ? (
                            <SimpleGrid
                              cols={{ base: 1, sm: 2, md: 3 }}
                              spacing="md"
                            >
                              {sortedListings.map((listing) => (
                                <ListingCard key={`regular-${listing.id}`} listing={listing} />
                              ))}
                            </SimpleGrid>
                          ) : (
                            <Stack gap="md">
                              {sortedListings.map((listing) => (
                                <ListingCardList key={`regular-list-${listing.id}`} listing={listing} />
                              ))}
                            </Stack>
                          )}

                          {data?.total_pages > 1 && (
                            <Center py="xl">
                              <Pagination
                                page={appliedFilters?.page || 1}
                                total={data.total_pages}
                                onChange={handlePageChange}
                                size="md"
                                radius="md"
                              />
                            </Center>
                          )}
                        </>
                      ) : null}
                    </Stack>
                  )
                }
                
                return (
                  <Center py="xl">
                    <Stack align="center" gap="md">
                      <Text size="lg" c="dimmed">
                        {t('search.noResults')}
                      </Text>
                      <Text size="sm" c="dimmed">
                        {t('search.tryDifferentFilters')}
                      </Text>
                    </Stack>
                  </Center>
                )
              })()}
            </Stack>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  )
}

export default SearchPage
