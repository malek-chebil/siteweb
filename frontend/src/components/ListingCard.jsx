import { Card, Image, Text, Group, Badge, Button, Stack, ActionIcon, Tooltip } from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { showNotification } from '@mantine/notifications'
import dayjs from 'dayjs'
import { IconPhone, IconBrandWhatsapp, IconEye, IconStar, IconHeart, IconHeartFilled } from '@tabler/icons-react'
import { getCategoryIcon } from '../utils/categoryIcons'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'

const ListingCard = ({ listing, variant = 'default' }) => {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()
  
  // Determine if this is a compact/premium carousel card
  const isCompact = variant === 'compact' || variant === 'premium'
  
  // Size configurations - Responsive cards
  const cardHeight = isCompact ? '450px' : undefined // Auto height for responsive cards
  const imageHeight = isCompact ? '180px' : '200px' // Fixed image height
  const titleSize = isCompact ? 'md' : 'md'
  const titleMinHeight = isCompact ? '2.2rem' : '2.2rem'
  const titleMaxHeight = isCompact ? '2.2rem' : '2.2rem'
  const descriptionMinHeight = isCompact ? '1.6rem' : '1.6rem'
  const descriptionMaxHeight = isCompact ? '1.6rem' : '1.6rem'
  const padding = isCompact ? 'sm' : 'md'
  const gap = isCompact ? '6px' : 'xs'
  const badgesGap = isCompact ? '6px' : '6px'
  
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
          title: t('common.success'),
          message: isFavorited ? t('listing.removedFromFavorites') : t('listing.addedToFavorites'),
          color: isFavorited ? 'gray' : 'red',
        })
      },
      onError: (error) => {
        showNotification({
          title: t('common.error'),
          message: error.response?.data?.detail || t('errors.favoriteError'),
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
    <Card
      shadow="sm"
      padding={0}
      radius="md"
      withBorder
      style={{ 
        height: cardHeight,
        width: isCompact ? '280px' : '100%',
        maxWidth: isCompact ? '280px' : '100%',
        display: 'flex', 
        flexDirection: 'column',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
        cursor: 'pointer',
      }}
      className={`listing-card ${isCompact ? 'listing-card-compact' : 'listing-card-responsive'}`}
      onMouseEnter={(e) => {
        if (window.innerWidth >= 768) {
          e.currentTarget.style.transform = 'translateY(-4px)'
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 195, 0, 0.4)'
          e.currentTarget.style.borderColor = 'rgba(255, 195, 0, 0.6)'
        }
      }}
      onMouseLeave={(e) => {
        if (window.innerWidth >= 768) {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2)'
          e.currentTarget.style.borderColor = 'rgba(255, 195, 0, 0.3)'
        }
      }}
      onClick={() => navigate(`/listing/${listing.id}`)}
    >
      <Card.Section pos="relative" style={{ height: imageHeight, overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
        <Image
          src={primaryImage}
          height={imageHeight}
          alt={listing.title}
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
            width: '100%',
            height: imageHeight,
            minHeight: imageHeight,
            maxHeight: imageHeight,
            display: 'block',
          }}
        />
        {listing.is_featured && (
          <Badge
            pos="absolute"
            top={8}
            left={8}
            color="yellow"
            variant="filled"
            size="md"
            leftSection={<IconStar size={14} fill="currentColor" />}
            style={{
              backgroundColor: '#ffc107',
              fontWeight: 700,
              boxShadow: '0 2px 8px rgba(255, 195, 0, 0.5)',
              fontSize: '0.7rem',
              padding: '4px 10px',
              color: '#000',
              border: 'none',
              borderRadius: '6px',
              letterSpacing: '0.3px',
              zIndex: 10,
            }}
          >
            PREMIUM
          </Badge>
        )}
        <Group
          gap={4}
          pos="absolute"
          top={8}
          right={8}
          style={{
            gap: '4px',
          }}
        >
          {isAuthenticated && (
            <Tooltip label={isFavorited ? t('listing.removeFromFavorites') : t('listing.addToFavorites')}>
              <ActionIcon
                variant="filled"
                color={isFavorited ? 'red' : 'gray'}
                size={isCompact ? 'md' : 'lg'}
                radius="md"
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
                {isFavorited ? <IconHeartFilled size={isCompact ? 14 : 18} /> : <IconHeart size={isCompact ? 14 : 18} />}
              </ActionIcon>
            </Tooltip>
          )}
          {listing.views_count > 0 && (
            <Group
              gap={4}
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                padding: isCompact ? '2px 6px' : '4px 8px',
                borderRadius: '6px',
                backdropFilter: 'blur(4px)',
              }}
            >
              <IconEye size={isCompact ? 12 : 14} style={{ color: '#fff' }} />
              <Text size={isCompact ? '10px' : 'xs'} c="white" fw={500}>
                {listing.views_count}
              </Text>
            </Group>
          )}
        </Group>
      </Card.Section>

      <Stack justify="space-between" style={{ flex: 1, minHeight: 0, overflow: 'hidden', height: `calc(${cardHeight} - ${imageHeight})` }} p={padding} gap={gap}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
          {/* Username first */}
          {listing.user?.username && (
            <Text 
              size="sm" 
              c="dimmed" 
              mb={isCompact ? '4px' : '6px'}
              style={{ 
                fontSize: isCompact ? '0.75rem' : '0.8rem',
                color: '#6c757d',
                fontWeight: 500,
                lineHeight: '1.2',
              }}
            >
              {listing.user.username}
            </Text>
          )}
          
          {/* Title under username */}
          <Text 
            fw={700} 
            size={titleSize} 
            mb={isCompact ? '6px' : '8px'} 
            lineClamp={2}
            style={{ 
              minHeight: titleMinHeight,
              maxHeight: titleMaxHeight,
              color: '#212529',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: isCompact ? '1.15rem' : '1.25rem',
              fontSize: isCompact ? '0.9rem' : '1rem',
              fontWeight: 700,
            }}
          >
            {listing.title}
          </Text>
          
          {/* Description under title */}
          <Text 
            size="sm" 
            c="dimmed" 
            lineClamp={2} 
            mb={isCompact ? '8px' : '10px'}
            style={{ 
              minHeight: descriptionMinHeight,
              maxHeight: descriptionMaxHeight,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: isCompact ? '1rem' : '1.1rem',
              fontSize: isCompact ? '0.8rem' : '0.85rem',
              color: '#495057',
              fontWeight: 400,
            }}
          >
            {listing.description || t('listing.noDescription')}
          </Text>
          
          {/* Other elements - Soft style */}
          <Stack gap="6px" mb="8px" style={{ width: '100%', flexShrink: 0 }}>
            {/* Location */}
            <Group gap={6} style={{ alignItems: 'center', flexWrap: 'nowrap' }}>
              <Text size="xs" c="dimmed" style={{ fontSize: '0.7rem', color: '#868e96', lineHeight: '1', flexShrink: 0 }}>
                📍
              </Text>
              <Text size="sm" c="dimmed" style={{ fontSize: '0.75rem', color: '#495057', fontWeight: 400, lineHeight: '1.2', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {listing.city}
              </Text>
            </Group>
            
            {/* Category */}
            <Group gap={6} style={{ alignItems: 'center', flexWrap: 'nowrap' }}>
              {(() => {
                const CategoryIcon = getCategoryIcon(listing.category)
                return <CategoryIcon size={14} style={{ color: '#868e96', flexShrink: 0 }} />
              })()}
              <Text size="sm" c="dimmed" style={{ fontSize: '0.75rem', color: '#495057', fontWeight: 400, lineHeight: '1.2', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {listing.category}
              </Text>
            </Group>
            
            {/* Price */}
            {listing.price && (
              <Group gap={6} style={{ alignItems: 'center', flexWrap: 'nowrap' }}>
                <Text size="xs" c="dimmed" style={{ fontSize: '0.7rem', color: '#868e96', lineHeight: '1', flexShrink: 0 }}>
                  💰
                </Text>
                <Text size="sm" fw={600} style={{ fontSize: '0.85rem', color: '#28a745', fontWeight: 600, lineHeight: '1.2' }}>
                  {listing.price} {t('listing.priceCurrency')}
                </Text>
              </Group>
            )}
          </Stack>
          
          {/* Date */}
          <Text size="xs" c="dimmed" style={{ fontSize: '0.65rem', color: '#868e96', fontWeight: 400, marginTop: 'auto', marginBottom: '6px', lineHeight: '1.2' }}>
            {dayjs(listing.created_at).format('DD/MM/YYYY')}
          </Text>
        </div>

        <Group mt="auto" gap="4px" wrap="nowrap" style={{ marginTop: '8px', minHeight: '32px', flexShrink: 0 }}>
          <Button
            variant="light"
            color="yellow"
            flex={1}
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/listing/${listing.id}`)
            }}
            size="xs"
            leftSection={<IconEye size={14} />}
            style={{
              fontWeight: 600,
              fontSize: '0.75rem',
              padding: '4px 10px',
              height: '32px',
              color: '#856404',
              backgroundColor: '#fff3cd',
              border: '1px solid #ffc107',
              borderRadius: '6px',
            }}
          >
            {t('common.view')}
          </Button>
          {listing.whatsapp && (
            <Tooltip label={t('listing.whatsapp')} withArrow>
              <ActionIcon
                variant="filled"
                color="green"
                onClick={(e) => {
                  e.stopPropagation()
                  handleWhatsApp()
                }}
                size="md"
                radius="md"
                style={{ 
                  width: '32px', 
                  height: '32px',
                  backgroundColor: '#25D366',
                  boxShadow: '0 2px 4px rgba(37, 211, 102, 0.3)',
                }}
              >
                <IconBrandWhatsapp size={16} />
              </ActionIcon>
            </Tooltip>
          )}
          {listing.phone && (
            <Tooltip label={t('listing.call')} withArrow>
              <ActionIcon
                variant="filled"
                color="blue"
                onClick={(e) => {
                  e.stopPropagation()
                  handleCall()
                }}
                size="md"
                radius="md"
                style={{ 
                  width: '32px', 
                  height: '32px',
                  backgroundColor: '#0d6efd',
                  boxShadow: '0 2px 4px rgba(13, 110, 253, 0.3)',
                }}
              >
                <IconPhone size={16} />
              </ActionIcon>
            </Tooltip>
          )}
        </Group>
      </Stack>
    </Card>
  )
}

export default ListingCard

