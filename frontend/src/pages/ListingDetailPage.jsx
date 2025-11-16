import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { 
  Container, 
  Title, 
  Text, 
  Image, 
  Group, 
  Button, 
  Badge, 
  Stack, 
  Paper, 
  Divider,
  ActionIcon,
  Grid,
  Breadcrumbs,
  Anchor,
  Box,
  Alert,
  SimpleGrid
} from '@mantine/core'
import { Carousel } from '@mantine/carousel'
import { useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'
import { showNotification } from '@mantine/notifications'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { 
  IconPhone, 
  IconBrandWhatsapp, 
  IconMessage, 
  IconCopy, 
  IconPrinter, 
  IconShare,
  IconAlertCircle,
  IconFlag,
  IconArrowLeft
} from '@tabler/icons-react'
import ListingCard from '../components/ListingCard'
import { getCategoryIcon } from '../utils/categoryIcons'
import { addToHistory } from '../utils/navigationHistory'

dayjs.extend(relativeTime)

const ListingDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { isAuthenticated, user } = useAuth()

  const { data: listing, isLoading, error } = useQuery(
    ['listing', id],
    async () => {
      const response = await api.get(`/listings/${id}`)
      return response.data
    }
  )

  // Ajouter l'annonce à l'historique de navigation
  useEffect(() => {
    if (listing) {
      addToHistory(listing.id, {
        title: listing.title,
        media: listing.media
      })
    }
  }, [listing])

  // Fetch related listings
  const { data: relatedListings } = useQuery(
    ['related-listings', listing?.category, listing?.city],
    async () => {
      if (!listing) return { items: [] }
      const response = await api.get('/listings', {
        params: {
          category: listing.category,
          city: listing.city,
          page: 1,
          page_size: 4,
        },
      })
      // Filter out current listing
      return {
        ...response.data,
        items: response.data.items.filter(l => l.id !== listing.id).slice(0, 3)
      }
    },
    {
      enabled: !!listing,
    }
  )

  const handleWhatsApp = () => {
    if (listing?.whatsapp) {
      const message = encodeURIComponent(`Bonjour, je suis intéressé par votre annonce: ${listing.title}`)
      window.open(`https://wa.me/${listing.whatsapp.replace(/\D/g, '')}?text=${message}`, '_blank')
    }
  }

  const handleCall = () => {
    if (listing?.phone) {
      window.open(`tel:${listing.phone}`, '_self')
    }
  }

  const handleSMS = () => {
    if (listing?.phone) {
      window.open(`sms:${listing.phone}`, '_self')
    }
  }

  const handleCopyNumber = () => {
    if (listing?.phone) {
      navigator.clipboard.writeText(listing.phone)
      showNotification({
        title: t('common.success'),
        message: t('errors.copyNumber'),
        color: 'green',
      })
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: listing?.title,
          text: listing?.description,
          url: window.location.href,
        })
      } catch (error) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      showNotification({
        title: t('common.success'),
        message: t('errors.copyLink'),
        color: 'green',
      })
    }
  }

  const handleReport = () => {
    showNotification({
      title: t('listing.report'),
      message: t('errors.reportComingSoon'),
      color: 'yellow',
    })
  }

  if (isLoading) {
    return (
      <Container style={{ paddingTop: '120px', paddingBottom: '48px' }}>
        <Text>{t('common.loading')}</Text>
      </Container>
    )
  }

  if (error || !listing) {
    return (
      <Container style={{ paddingTop: '120px', paddingBottom: '48px' }}>
        <Text c="red">{t('errors.errorLoadingListing')}</Text>
      </Container>
    )
  }

  const images = listing.media && listing.media.length > 0 
    ? listing.media.map(m => m.url)
    : ['https://via.placeholder.com/800x600?text=No+Image']

  const breadcrumbs = [
    { title: t('home.title'), href: '/' },
    { title: listing.category, href: `/?category=${listing.category}` },
    { title: listing.title, href: '#' },
  ]

  return (
    <Container size="lg" style={{ paddingTop: '120px', paddingBottom: '48px' }}>
      <Stack gap={{ base: 'md', sm: 'lg' }}>
        {/* Back Button and Breadcrumbs */}
        <Group justify="space-between" wrap="wrap" gap="xs">
          <Button
            variant="subtle"
            size="md"
            leftSection={<IconArrowLeft size={18} />}
            onClick={() => navigate(-1)}
          >
            {t('common.back')}
          </Button>
          <Breadcrumbs hiddenFrom="xs">
            {breadcrumbs.map((item, index) => (
              <Anchor 
                key={index} 
                href={item.href}
                onClick={(e) => {
                  e.preventDefault()
                  navigate(item.href)
                }}
                c={index === breadcrumbs.length - 1 ? 'dimmed' : 'yellow.6'}
                size="sm"
              >
                {item.title}
              </Anchor>
            ))}
          </Breadcrumbs>
        </Group>

        <Grid gutter={{ base: 'xs', sm: 'md' }}>
          {/* Main Content */}
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Stack gap={{ base: 'md', sm: 'lg' }}>
              {/* Images */}
              {images.length > 1 ? (
                <Carousel withIndicators loop radius="md" className="listing-carousel">
                  {images.map((url, index) => (
                    <Carousel.Slide key={index}>
                      <Image 
                        src={url} 
                        alt={`${listing.title} ${index + 1}`}
                        fit="cover"
                        style={{ width: '100%', height: '100%' }}
                      />
                    </Carousel.Slide>
                  ))}
                </Carousel>
              ) : (
                <Image 
                  src={images[0]} 
                  alt={listing.title}
                  radius="md"
                  fit="cover"
                  className="listing-image"
                  style={{ width: '100%', height: '100%' }}
                />
              )}

              {/* Title and Price */}
              <Paper p={{ base: 'md', sm: 'lg' }} radius="md" withBorder>
                <Stack gap={{ base: 'sm', sm: 'md' }}>
                  <Stack gap="xs">
                    <Title order={1} size="h2" c="yellow.6">
                      {listing.title}
                    </Title>
                    {listing.price && (
                      <Badge size="xl" color="green" variant="filled" p="md">
                        <Text fw={700} size="lg">
                          {listing.price} {t('listing.priceCurrency')}
                        </Text>
                      </Badge>
                    )}
                  </Stack>

                  <Group gap="xs" wrap="wrap">
                    <Badge color="yellow" variant="light" size="lg">
                      📍 {listing.city}
                    </Badge>
                    <Badge 
                      color="gray" 
                      variant="light" 
                      size="lg"
                      leftSection={(() => {
                        const CategoryIcon = getCategoryIcon(listing.category)
                        return <CategoryIcon size={18} />
                      })()}
                    >
                      {listing.category}
                    </Badge>
                    <Text size="sm" c="dimmed">
                      {t('listing.published')} {dayjs(listing.created_at).fromNow()}
                    </Text>
                    <Text size="sm" c="dimmed">
                      • {listing.views_count || 0} {t('listing.views')}
                    </Text>
                  </Group>

                  <Divider />

                  {/* Description */}
                  <Box>
                    <Title order={3} size="h4" mb="sm">
                      {t('listing.description')}
                    </Title>
                    {listing.user?.username && (
                      <Text size="sm" c="dimmed" mb="md" fw={500}>
                        {t('listing.publishedBy')}: {listing.user.username}
                      </Text>
                    )}
                    <Text size="md" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
                      {listing.description || t('listing.noDescription')}
                    </Text>
                  </Box>
                </Stack>
              </Paper>

              {/* Safety Warning */}
              <Alert 
                icon={<IconAlertCircle size={20} />} 
                title="Restez toujours en sécurité!"
                color="yellow"
                variant="light"
              >
                <Text size="sm">
                  Ne payez jamais d'acompte sur un compte bancaire avant d'avoir rencontré le vendeur et signé un accord d'achat. 
                  Aucun annonceur sérieux ne demande de paiement avant la rencontre. 
                  Recevoir un email avec une pièce d'identité scannée ne signifie pas que vous avez identifié l'expéditeur.
                </Text>
              </Alert>

              {/* Comments Section - Placeholder */}
              <Paper p="lg" radius="md" withBorder>
                <Title order={3} size="h4" mb="md">
                  Commentaires
                </Title>
                <Text c="dimmed" size="sm">
                  Aucun commentaire n'a encore été ajouté
                </Text>
              </Paper>
            </Stack>
          </Grid.Col>

          {/* Sidebar */}
          <Grid.Col span={{ base: 12, md: 4 }} order={{ base: -1, md: 2 }}>
            <Stack gap={{ base: 'md', sm: 'lg' }}>
              {/* Contact Information */}
              <Paper p={{ base: 'md', sm: 'lg' }} radius="md" withBorder>
                <Stack gap={{ base: 'sm', sm: 'md' }}>
                  <Title order={3} size="h4">
                    {t('listing.contactSeller')}
                  </Title>

                  {listing.phone && (
                    <Box>
                      <Text fw={600} mb="xs">{t('listing.phone')}</Text>
                      <Group gap="xs">
                        <Text size="lg" fw={500}>{listing.phone}</Text>
                        <ActionIcon 
                          variant="light" 
                          color="blue"
                          onClick={handleCopyNumber}
                          title={t('errors.copyNumber')}
                        >
                          <IconCopy size={18} />
                        </ActionIcon>
                      </Group>
                    </Box>
                  )}

                  <Divider />

                  {/* Contact Buttons */}
                  <Stack gap="sm">
                    {listing.phone && (
                      <Button
                        leftSection={<IconPhone size={18} />}
                        onClick={handleCall}
                        fullWidth
                        size="md"
                        color="blue"
                      >
                        {t('listing.call')} {listing.phone}
                      </Button>
                    )}
                    {listing.whatsapp && (
                      <Button
                        leftSection={<IconBrandWhatsapp size={18} />}
                        onClick={handleWhatsApp}
                        fullWidth
                        size="md"
                        color="green"
                      >
                        {t('listing.whatsappChat')}
                      </Button>
                    )}
                    {listing.phone && (
                      <Button
                        leftSection={<IconMessage size={18} />}
                        onClick={handleSMS}
                        fullWidth
                        size="md"
                        variant="light"
                      >
                        {t('listing.sendSMS')}
                      </Button>
                    )}
                  </Stack>

                  {/* Seller Info */}
                  {listing.user && (
                    <>
                      <Divider />
                      <Box>
                        <Text fw={600} mb="xs">{t('listing.seller')}</Text>
                        <Text size="sm" c="dimmed">
                          {listing.user.username || listing.user.email || 'Utilisateur'}
                        </Text>
                      </Box>
                    </>
                  )}
                </Stack>
              </Paper>

              {/* Action Buttons */}
              <Paper p={{ base: 'md', sm: 'lg' }} radius="md" withBorder>
                <Stack gap="sm">
                  <Group grow wrap>
                    <Button
                      leftSection={<IconPrinter size={18} />}
                      onClick={handlePrint}
                      variant="light"
                      fullWidth
                      size="md"
                    >
                      {t('listing.print')}
                    </Button>
                    <Button
                      leftSection={<IconShare size={18} />}
                      onClick={handleShare}
                      variant="light"
                      fullWidth
                      size="md"
                    >
                      {t('listing.share')}
                    </Button>
                  </Group>
                  {isAuthenticated && (
                    <Button
                      leftSection={<IconFlag size={18} />}
                      onClick={handleReport}
                      variant="light"
                      color="red"
                      fullWidth
                      size="md"
                    >
                      {t('listing.reportListing')}
                    </Button>
                  )}
                </Stack>
              </Paper>
            </Stack>
          </Grid.Col>
        </Grid>

        {/* Related Listings */}
        {relatedListings?.items && relatedListings.items.length > 0 && (
          <Box mt="xl">
            <Title order={2} size="h3" mb="lg">
              {t('listing.youMightAlsoLike')}
            </Title>
            <SimpleGrid
              cols={{ base: 1, sm: 2, md: 3 }}
              spacing="lg"
            >
              {relatedListings.items.map((relatedListing) => (
                <ListingCard key={relatedListing.id} listing={relatedListing} />
              ))}
            </SimpleGrid>
          </Box>
        )}
      </Stack>
    </Container>
  )
}

export default ListingDetailPage
