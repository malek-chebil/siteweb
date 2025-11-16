import { Paper, Image, Text, Group, Badge, Button, Stack, ActionIcon, Tooltip, Box } from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { showNotification } from '@mantine/notifications'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { IconPhone, IconBrandWhatsapp, IconEye, IconStar, IconHeart, IconHeartFilled, IconMapPin, IconTag, IconMail } from '@tabler/icons-react'
import { getCategoryIcon } from '../utils/categoryIcons'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'

dayjs.extend(relativeTime)

const ListingCardList = ({ listing }) => {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()
  
  // Check if listing is favorited
  const { data: favoriteCheck } = useQuery(
    ['favorite-check', listing.id],
    async () => {
      if (!isAuthenticated) return { is_favorited: false }
      const response = await api.get(`/favorites/check/${listing.id}`)
      return response.data
    },
    {
      enabled: isAuthenticated,
      staleTime: 1000 * 60 * 5, // 5 minutes
    }
  )
  
  const isFavorited = favoriteCheck?.is_favorited || false
  
  // Toggle favorite mutation
  const toggleFavoriteMutation = useMutation(
    async () => {
      if (isFavorited) {
        await api.delete(`/favorites/${listing.id}`)
      } else {
        await api.post(`/favorites/${listing.id}`)
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['favorite-check', listing.id])
        queryClient.invalidateQueries('favorites')
        showNotification({
          title: t('success'),
          message: isFavorited ? 'Retiré des favoris' : 'Ajouté aux favoris',
          color: isFavorited ? 'gray' : 'red',
        })
      },
      onError: (error) => {
        showNotification({
          title: t('error'),
          message: error.response?.data?.detail || 'Erreur lors de l\'ajout aux favoris',
          color: 'red',
        })
      },
    }
  )

  const primaryImage = listing.media && listing.media.length > 0 
    ? listing.media[0].url 
    : 'https://via.placeholder.com/400x300?text=No+Image'

  const handleWhatsApp = () => {
    if (listing.whatsapp) {
      const message = encodeURIComponent(`Bonjour, je suis intéressé par votre annonce: ${listing.title}`)
      window.open(`https://wa.me/${listing.whatsapp.replace(/\D/g, '')}?text=${message}`, '_blank')
    }
  }

  const handleCall = () => {
    if (listing.phone) {
      window.open(`tel:${listing.phone}`, '_self')
    }
  }

  return (
    <Paper
      p="md"
      radius="md"
      withBorder
      style={{
        backgroundColor: '#faf8f3',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        border: '1px solid #e9ecef',
      }}
      onClick={() => navigate(`/listing/${listing.id}`)}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <Group align="flex-start" gap="md" wrap="nowrap">
        {/* Image Section */}
        <Box style={{ position: 'relative', flexShrink: 0 }}>
          <Image
            src={primaryImage}
            alt={listing.title}
            width={200}
            height={150}
            radius="md"
            fit="cover"
            style={{
              minWidth: '200px',
              maxWidth: '200px',
            }}
          />
          {listing.is_featured && (
            <Badge
              pos="absolute"
              top={8}
              left={8}
              color="red"
              variant="filled"
              size="sm"
              style={{
                backgroundColor: '#ff4444',
                fontWeight: 600,
              }}
            >
              Premium
            </Badge>
          )}
          {isAuthenticated && (
            <ActionIcon
              variant="filled"
              color={isFavorited ? 'red' : 'gray'}
              size="md"
              radius="md"
              pos="absolute"
              top={8}
              right={8}
              onClick={(e) => {
                e.stopPropagation()
                toggleFavoriteMutation.mutate()
              }}
              loading={toggleFavoriteMutation.isLoading}
              style={{
                backgroundColor: isFavorited ? 'rgba(250, 82, 82, 0.9)' : 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(4px)',
              }}
            >
              {isFavorited ? <IconHeartFilled size={16} /> : <IconHeart size={16} />}
            </ActionIcon>
          )}
        </Box>

        {/* Content Section */}
        <Stack gap="xs" style={{ flex: 1, minWidth: 0 }} justify="space-between">
          <div>
            <Text 
              fw={600} 
              size="lg" 
              lineClamp={1}
              mb="xs"
              style={{ 
                color: '#212529',
              }}
            >
              {listing.title}
            </Text>
            
            <Text 
              size="sm" 
              c="dimmed" 
              lineClamp={2}
              mb="md"
            >
              {listing.description}
            </Text>

            <Group gap="md" wrap="wrap" mb="xs">
              {listing.user?.username && (
                <Group gap={4}>
                  <IconMail size={14} style={{ color: '#868e96' }} />
                  <Text size="sm" c="dimmed" fw={500}>
                    {listing.user.username}
                  </Text>
                </Group>
              )}
              <Group gap={4}>
                <IconMapPin size={14} style={{ color: '#868e96' }} />
                <Text size="sm" c="dimmed">
                  {listing.city}
                </Text>
              </Group>
              
              <Group gap={4}>
                <IconTag size={14} style={{ color: '#868e96' }} />
                <Text size="sm" c="dimmed">
                  {listing.category}
                </Text>
              </Group>
            </Group>
          </div>

          <Group justify="space-between" wrap="wrap" align="flex-end" mt="auto">
            <div>
              {listing.price ? (
                <Text size="lg" fw={700} c="blue" mb="xs">
                  {Math.round(listing.price).toLocaleString('fr-FR').replace(/\s/g, '.')} TND
                </Text>
              ) : (
                <Text size="sm" c="dimmed" fw={500} mb="xs">
                  Check with seller
                </Text>
              )}
              
              <Group gap="md" mt="xs">
                <Button
                  variant="filled"
                  color="blue"
                  size="sm"
                  leftSection={<IconMail size={16} />}
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/listing/${listing.id}`)
                  }}
                  style={{
                    backgroundColor: '#4dabf7',
                  }}
                >
                  Contact
                </Button>
              </Group>
            </div>
            
            <Stack gap={4} align="flex-end">
              {listing.views_count > 0 && (
                <Text size="sm" c="dimmed">
                  {listing.views_count} people viewed
                </Text>
              )}
              <Text size="sm" c="dimmed">
                Added {dayjs(listing.created_at).fromNow()}
              </Text>
            </Stack>
          </Group>
        </Stack>
      </Group>
    </Paper>
  )
}

export default ListingCardList

