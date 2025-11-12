import { useState } from 'react'
import { Container, Title, Text, SimpleGrid, Pagination, Stack, Center, Paper } from '@mantine/core'
import { useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'
import api from '../lib/api'
import ListingCard from '../components/ListingCard'

const FavoritesPage = () => {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)

  const { data, isLoading, error } = useQuery(
    ['favorites', page],
    async () => {
      const response = await api.get('/favorites', {
        params: { page, page_size: 20 },
      })
      return response.data
    }
  )

  const handlePageChange = (newPage) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (error) {
    return (
      <Container>
        <Text color="red">Error loading favorites: {error.message}</Text>
      </Container>
    )
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Title
          order={1}
          style={{
            background: 'linear-gradient(135deg, #FFC300 0%, #ffb300 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          ❤️ Mes favoris
        </Title>

        {isLoading ? (
          <Center py="xl">
            <Text size="lg" c="dimmed">{t('common.loading')}</Text>
          </Center>
        ) : data?.items?.length > 0 ? (
          <>
            <Text size="lg" c="dimmed">
              {data.total} {data.total === 1 ? 'annonce' : 'annonces'} en favoris
            </Text>
            <SimpleGrid
              cols={{ base: 1, sm: 2, md: 3, lg: 4 }}
              spacing="lg"
            >
              {data.items.map((favorite) => (
                <ListingCard key={favorite.listing.id} listing={favorite.listing} />
              ))}
            </SimpleGrid>

            {data.total_pages > 1 && (
              <Center py="xl">
                <Pagination
                  page={page}
                  total={data.total_pages}
                  onChange={handlePageChange}
                  size="md"
                  radius="md"
                />
              </Center>
            )}
          </>
        ) : (
          <Paper p="xl" radius="md" withBorder>
            <Stack align="center" gap="md">
              <Text size="xl" c="dimmed" fw={500}>
                Aucun favori
              </Text>
              <Text size="sm" c="dimmed" ta="center">
                Vous n'avez pas encore d'annonces en favoris.
                Cliquez sur le cœur ❤️ sur une annonce pour l'ajouter à vos favoris.
              </Text>
            </Stack>
          </Paper>
        )}
      </Stack>
    </Container>
  )
}

export default FavoritesPage


