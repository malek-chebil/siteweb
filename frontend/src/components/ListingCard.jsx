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
  // Removed fixed min/max height for description to allow proper ellipsis
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
      radius="lg"
      withBorder
      style={{ 
        height: cardHeight,
        width: isCompact ? '100%' : '100%',
        maxWidth: isCompact ? '100%' : '100%',
        display: 'flex', 
        flexDirection: 'column',
        transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        overflow: 'visible',
        cursor: 'pointer',
        position: 'relative',
      }}
      className={`listing-card ${isCompact ? 'listing-card-compact' : 'listing-card-responsive'}`}
      onMouseEnter={(e) => {
        if (window.innerWidth >= 768) {
          e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)'
          e.currentTarget.style.boxShadow = '0 20px 48px rgba(255, 184, 77, 0.35), 0 8px 16px rgba(139, 69, 19, 0.20)'
          e.currentTarget.style.borderColor = 'rgba(255, 184, 77, 0.50)'
          // Add subtle glow effect
          e.currentTarget.style.filter = 'brightness(1.05)'
        }
      }}
      onMouseLeave={(e) => {
        if (window.innerWidth >= 768) {
          e.currentTarget.style.transform = 'translateY(0) scale(1)'
          e.currentTarget.style.filter = 'brightness(1)'
        }
      }}
      onClick={() => navigate(`/listing/${listing.id}`)}
    >
      <Card.Section pos="relative" style={{ height: imageHeight, overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.05) 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        }} />
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
            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          onMouseEnter={(e) => {
            if (window.innerWidth >= 768) {
              e.currentTarget.style.transform = 'scale(1.08)'
            }
          }}
          onMouseLeave={(e) => {
            if (window.innerWidth >= 768) {
              e.currentTarget.style.transform = 'scale(1)'
            }
          }}
        />
        {listing.is_featured && (
          <Badge
            pos="absolute"
            top={4}
            left={4}
            color="yellow"
            variant="filled"
            size="md"
            leftSection={<IconStar size={14} fill="currentColor" />}
            style={{
              background: 'linear-gradient(135deg, #FFB84D 0%, #ff9919 100%)',
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(255, 184, 77, 0.5), 0 2px 4px rgba(139, 69, 19, 0.3)',
              fontSize: '0.7rem',
              padding: '8px 14px',
              paddingTop: '8px',
              paddingBottom: '8px',
              color: '#fff',
              border: '1.5px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '8px',
              letterSpacing: '0.5px',
              zIndex: 30,
              textTransform: 'uppercase',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              lineHeight: '1.2',
              height: 'auto',
              minHeight: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'visible',
            }}
          >
            Premium
          </Badge>
        )}
        <Group
          gap={4}
          pos="absolute"
          top={4}
          right={4}
          style={{
            gap: '4px',
            zIndex: 25,
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
            {listing.user?.username || '--'}
          </Text>
          
          {/* Title */}
          <Text 
            fw={700} 
            size={titleSize} 
            mb={isCompact ? '2px' : '4px'} 
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
          
          {/* Description - Close to title - Fixed height for alignment */}
          <Text 
            size="sm" 
            c="dimmed" 
            lineClamp={3} 
            mb={isCompact ? '10px' : '12px'}
            style={{ 
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              textOverflow: 'ellipsis',
              lineHeight: isCompact ? '1.2rem' : '1.3rem',
              fontSize: isCompact ? '0.8rem' : '0.85rem',
              color: '#868e96',
              fontWeight: 400,
              marginTop: '0',
              paddingTop: '0',
              minHeight: isCompact ? '3.6rem' : '3.9rem',
              height: isCompact ? '3.6rem' : '3.9rem',
              opacity: 0.85,
            }}
          >
            {listing.description || t('listing.noDescription')}
          </Text>
          
          {/* Location, Category, Price - Bigger */}
          <Stack gap={isCompact ? '8px' : '10px'} mb={isCompact ? '10px' : '12px'} style={{ width: '100%', flexShrink: 0 }}>
            {/* Location */}
            <Group gap={8} style={{ alignItems: 'center', flexWrap: 'nowrap' }}>
              <Text size="sm" c="dimmed" style={{ fontSize: '0.85rem', color: '#868e96', lineHeight: '1', flexShrink: 0 }}>
                📍
              </Text>
              <Text size="sm" c="dimmed" style={{ fontSize: isCompact ? '0.85rem' : '0.9rem', color: '#495057', fontWeight: 500, lineHeight: '1.3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {listing.city}
              </Text>
            </Group>
            
            {/* Category */}
            <Group gap={8} style={{ alignItems: 'center', flexWrap: 'nowrap' }}>
              {(() => {
                const CategoryIcon = getCategoryIcon(listing.category)
                return <CategoryIcon size={isCompact ? 16 : 18} style={{ color: '#868e96', flexShrink: 0 }} />
              })()}
              <Text size="sm" c="dimmed" style={{ fontSize: isCompact ? '0.85rem' : '0.9rem', color: '#495057', fontWeight: 500, lineHeight: '1.3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {listing.category}
              </Text>
            </Group>
            
            {/* Price */}
            {listing.price && (
              <Group gap={8} style={{ alignItems: 'center', flexWrap: 'nowrap' }}>
                <Text size="sm" c="dimmed" style={{ fontSize: '0.85rem', color: '#868e96', lineHeight: '1', flexShrink: 0 }}>
                  💰
                </Text>
                <Text size="sm" fw={600} style={{ fontSize: isCompact ? '0.9rem' : '1rem', color: '#28a745', fontWeight: 600, lineHeight: '1.3' }}>
                  {listing.price} {t('listing.priceCurrency')}
                </Text>
              </Group>
            )}
          </Stack>
          
          {/* Date - Bigger */}
          <Text size="sm" c="dimmed" style={{ fontSize: isCompact ? '0.75rem' : '0.8rem', color: '#868e96', fontWeight: 400, marginTop: 'auto', marginBottom: '6px', lineHeight: '1.3' }}>
            {dayjs(listing.created_at).format('DD/MM/YYYY')}
          </Text>
        </div>

        <Group mt="auto" gap="6px" wrap="nowrap" style={{ marginTop: '12px', minHeight: '36px', flexShrink: 0 }}>
          <Button
            variant="light"
            color="yellow"
            flex={1}
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/listing/${listing.id}`)
            }}
            size="sm"
            leftSection={<IconEye size={16} />}
            style={{
              fontWeight: 600,
              fontSize: '0.8rem',
              padding: '6px 12px',
              height: '36px',
              background: 'linear-gradient(135deg, rgba(255, 184, 77, 0.15) 0%, rgba(255, 153, 25, 0.12) 100%)',
              color: '#8B4513',
              border: '1.5px solid rgba(255, 184, 77, 0.40)',
              borderRadius: '8px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 184, 77, 0.25) 0%, rgba(255, 153, 25, 0.20) 100%)'
              e.currentTarget.style.borderColor = 'rgba(255, 184, 77, 0.60)'
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 184, 77, 0.25)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 184, 77, 0.15) 0%, rgba(255, 153, 25, 0.12) 100%)'
              e.currentTarget.style.borderColor = 'rgba(255, 184, 77, 0.40)'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
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
                  width: '36px', 
                  height: '36px',
                  background: 'linear-gradient(135deg, #25D366 0%, #20BA5A 100%)',
                  boxShadow: '0 4px 12px rgba(37, 211, 102, 0.35), 0 2px 4px rgba(37, 211, 102, 0.25)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.1)'
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(37, 211, 102, 0.45), 0 4px 8px rgba(37, 211, 102, 0.30)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 211, 102, 0.35), 0 2px 4px rgba(37, 211, 102, 0.25)'
                }}
              >
                <IconBrandWhatsapp size={18} />
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
                  width: '36px', 
                  height: '36px',
                  background: 'linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)',
                  boxShadow: '0 4px 12px rgba(74, 144, 226, 0.35), 0 2px 4px rgba(74, 144, 226, 0.25)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.1)'
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(74, 144, 226, 0.45), 0 4px 8px rgba(74, 144, 226, 0.30)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(74, 144, 226, 0.35), 0 2px 4px rgba(74, 144, 226, 0.25)'
                }}
              >
                <IconPhone size={18} />
              </ActionIcon>
            </Tooltip>
          )}
        </Group>
      </Stack>
    </Card>
  )
}

export default ListingCard

