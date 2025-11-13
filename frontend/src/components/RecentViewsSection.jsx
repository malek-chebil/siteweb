import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Stack, 
  Title, 
  SimpleGrid, 
  Text, 
  Paper, 
  Image, 
  Group, 
  Badge,
  Box,
  Center
} from '@mantine/core'
import { useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'
import api from '../lib/api'
import { getHistory } from '../utils/navigationHistory'
import { getCategoryIcon } from '../utils/categoryIcons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

const RecentViewsSection = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [history, setHistory] = useState([])

  // Charger l'historique depuis les cookies
  useEffect(() => {
    const loadHistory = () => {
      const historyData = getHistory()
      setHistory(historyData)
    }
    
    loadHistory()
    // Recharger toutes les 5 secondes pour mettre à jour l'historique
    const interval = setInterval(loadHistory, 5000)
    return () => clearInterval(interval)
  }, [])

  // Récupérer les détails des annonces depuis l'API
  const listingIds = history.map(item => item.id).join(',')
  
  const { data: listingsData, isLoading } = useQuery(
    ['recent-listings', listingIds],
    async () => {
      if (!listingIds || listingIds.length === 0) {
        return { items: [] }
      }
      
      // Récupérer chaque annonce individuellement
      const promises = history.map(item => 
        api.get(`/listings/${item.id}`).catch(() => null)
      )
      
      const results = await Promise.all(promises)
      const validListings = results
        .filter(result => result && result.data)
        .map(result => result.data)
        .filter(listing => listing.status === 'approved') // Seulement les annonces approuvées
      
      return { items: validListings }
    },
    {
      enabled: history.length > 0,
      staleTime: 30000, // Cache pendant 30 secondes
    }
  )

  if (history.length === 0 || !listingsData?.items?.length) {
    return null // Ne rien afficher s'il n'y a pas d'historique
  }

  const recentListings = listingsData.items.slice(0, 4) // Maximum 4 annonces

  return (
    <Stack gap="md">
      <Title order={3}>
        Annonces récemment consultées
      </Title>
      
      {isLoading ? (
        <Center py="xl">
          <Text size="sm" c="dimmed">Chargement...</Text>
        </Center>
      ) : (
        <SimpleGrid
          cols={{ base: 2, sm: 3, md: 4 }}
          spacing="md"
        >
          {recentListings.map((listing) => {
            const historyItem = history.find(item => item.id === listing.id)
            const viewedAt = historyItem?.viewedAt 
              ? dayjs(historyItem.viewedAt).fromNow()
              : null
            
            const CategoryIcon = getCategoryIcon(listing.category)
            const mainImage = listing.media?.[0]?.url || 'https://via.placeholder.com/300x200?text=No+Image'
            
            return (
              <Paper
                key={listing.id}
                p="sm"
                radius="md"
                withBorder
                style={{
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onClick={() => navigate(`/listing/${listing.id}`)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = 'var(--mantine-shadow-md)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <Stack gap="xs">
                  <Box style={{ position: 'relative', width: '100%', paddingTop: '66.67%' }}>
                    <Image
                      src={mainImage}
                      alt={listing.title}
                      fit="cover"
                      radius="sm"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                      }}
                    />
                    {listing.is_featured && (
                      <Badge
                        color="yellow"
                        variant="filled"
                        size="sm"
                        style={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                        }}
                      >
                        ⭐ Premium
                      </Badge>
                    )}
                  </Box>
                  
                  <Stack gap={4}>
                    <Text
                      size="sm"
                      fw={500}
                      lineClamp={2}
                      style={{
                        minHeight: '2.5rem',
                      }}
                    >
                      {listing.title}
                    </Text>
                    
                    <Group gap="xs" wrap="nowrap">
                      <CategoryIcon size={16} />
                      <Text size="xs" c="dimmed" lineClamp={1}>
                        {listing.category}
                      </Text>
                    </Group>
                    
                    <Group justify="space-between" wrap="nowrap">
                      {listing.price && (
                        <Text size="sm" fw={600} c="green">
                          {listing.price} TND
                        </Text>
                      )}
                      {viewedAt && (
                        <Text size="xs" c="dimmed">
                          {viewedAt}
                        </Text>
                      )}
                    </Group>
                  </Stack>
                </Stack>
              </Paper>
            )
          })}
        </SimpleGrid>
      )}
    </Stack>
  )
}

export default RecentViewsSection


