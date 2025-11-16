import { Container, Title, Button, SimpleGrid, Stack, Text, Center, Group, Badge, Paper, ActionIcon, Tooltip } from '@mantine/core'
import { IconPlus, IconEdit, IconStar, IconHourglass } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'
import api from '../lib/api'
import ListingCard from '../components/ListingCard'
import dayjs from 'dayjs'

const MyListingsPage = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const { data, isLoading, error } = useQuery(
    'my-listings',
    async () => {
      const response = await api.get('/listings/my', {
        params: {
          page: 1,
          page_size: 100,
        },
      })
      return response.data
    }
  )

  const myListings = data?.items || []

  return (
    <Container size="xl" style={{ paddingTop: '120px' }}>
      <Stack>
        <Group justify="space-between" mb="xl">
          <Title 
            order={1}
            style={{
              background: 'linear-gradient(135deg, #FFC300 0%, #ffb300 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {t('listing.myListings')}
          </Title>
          <Button 
            onClick={() => navigate('/listing/new')}
            leftSection={<IconPlus size={18} />}
            style={{
              background: 'linear-gradient(135deg, #FFC300 0%, #ffb300 100%)',
              border: 'none',
            }}
          >
            {t('listing.addListing')}
          </Button>
        </Group>

        {isLoading ? (
          <Center py="xl">
            <Text>{t('common.loading')}</Text>
          </Center>
        ) : error ? (
          <Center py="xl">
            <Text c="red">Error loading listings</Text>
          </Center>
        ) : myListings.length > 0 ? (
          <>
            <SimpleGrid
              cols={4}
              spacing="lg"
              breakpoints={[
                { maxWidth: 'md', cols: 3, spacing: 'md' },
                { maxWidth: 'sm', cols: 2, spacing: 'sm' },
                { maxWidth: 'xs', cols: 1, spacing: 'sm' },
              ]}
            >
              {myListings.map((listing) => {
                // Calculate expiration info
                const expiresAt = listing.expires_at ? dayjs(listing.expires_at) : null
                const now = dayjs()
                const isExpired = expiresAt ? expiresAt.isBefore(now) : false
                const daysRemaining = expiresAt ? expiresAt.diff(now, 'day') : null
                const hoursRemaining = expiresAt ? expiresAt.diff(now, 'hour') : null
                const isExpiringSoon = daysRemaining !== null && daysRemaining >= 0 && daysRemaining <= 7
                
                return (
                  <Stack key={listing.id} gap="xs">
                    <ListingCard listing={listing} />
                    <Group justify="space-between" px="xs" wrap="wrap">
                      <Group gap="xs" wrap="wrap">
                        <Badge
                          color={
                            listing.status === 'approved'
                              ? 'green'
                              : listing.status === 'rejected'
                              ? 'red'
                              : listing.status === 'expired'
                              ? 'orange'
                              : 'yellow'
                          }
                          size="sm"
                        >
                          {listing.status === 'expired' ? 'Expiré' : t(`listing.status.${listing.status}`)}
                        </Badge>
                        {listing.is_featured && (
                          <Badge
                            color="yellow"
                            variant="filled"
                            size="sm"
                            leftSection={<IconStar size={12} />}
                          >
                            Premium
                          </Badge>
                        )}
                        {expiresAt && (
                          <Badge
                            color={isExpired ? 'red' : isExpiringSoon ? 'orange' : 'blue'}
                            variant="light"
                            size="sm"
                            leftSection={<IconHourglass size={12} />}
                          >
                            {isExpired 
                              ? 'Expiré' 
                              : daysRemaining > 0 
                              ? `${daysRemaining}j restants`
                              : hoursRemaining > 0
                              ? `${hoursRemaining}h restantes`
                              : 'Expiré'}
                          </Badge>
                        )}
                      </Group>
                      <Group gap="xs">
                        <Tooltip 
                          label={listing.status === 'approved' ? 'Les annonces approuvées ne peuvent pas être modifiées' : t('common.edit')} 
                          withArrow
                        >
                          <ActionIcon
                            variant="light"
                            color="blue"
                            onClick={() => navigate(`/listing/${listing.id}/edit`)}
                            size="lg"
                            disabled={listing.status === 'approved'}
                          >
                            <IconEdit size={18} />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                    </Group>
                  </Stack>
                )
              })}
            </SimpleGrid>
          </>
        ) : (
          <Center py="xl">
            <Stack align="center">
              <Text size="lg" c="dimmed">
                {t('listing.noListings')}
              </Text>
              <Button onClick={() => navigate('/listing/new')}>
                {t('listing.addListing')}
              </Button>
            </Stack>
          </Center>
        )}
      </Stack>
    </Container>
  )
}

export default MyListingsPage

