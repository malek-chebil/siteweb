import { useState } from 'react'
import { Container, Title, Table, Button, Group, Badge, Text, Modal, Stack, Pagination, Center, Paper, ActionIcon } from '@mantine/core'
import { useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'
import api from '../lib/api'
import { IconInfoCircle } from '@tabler/icons-react'
import dayjs from 'dayjs'

const AdminUsersPage = () => {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState(null)
  const [modalOpened, setModalOpened] = useState(false)

  const { data, isLoading } = useQuery(
    ['admin-users', page],
    async () => {
      const response = await api.get('/admin/users', {
        params: { page, page_size: 20 },
      })
      return response.data
    }
  )

  const { data: userDetails, isLoading: detailsLoading } = useQuery(
    ['user-details', selectedUser?.id],
    async () => {
      if (!selectedUser) return null
      const response = await api.get(`/admin/users/${selectedUser.id}`)
      return response.data
    },
    {
      enabled: !!selectedUser && modalOpened,
    }
  )

  const handleInfoClick = (user) => {
    setSelectedUser(user)
    setModalOpened(true)
  }

  if (isLoading) {
    return (
      <Container>
        <Text>{t('common.loading')}</Text>
      </Container>
    )
  }

  return (
    <Container size="xl" fluid style={{ maxWidth: '100%', padding: '0 1rem' }}>
      <Stack>
        <Title
          order={1}
          mb="xl"
          style={{
            background: 'linear-gradient(135deg, #FFC300 0%, #ffb300 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {t('admin.users')}
        </Title>

        {data?.items?.length === 0 ? (
          <Paper p="xl" radius="md" withBorder>
            <Text ta="center" c="dimmed">
              {t('admin.noUsers')}
            </Text>
          </Paper>
        ) : (
          <Paper p="md" radius="md" withBorder style={{ width: '100%' }}>
            <Table
              striped
              highlightOnHover
              style={{
                width: '100%',
                tableLayout: 'auto',
              }}
            >
              <Table.Thead>
                <Table.Tr style={{ backgroundColor: '#f8f9fa' }}>
                  <Table.Th style={{ fontWeight: 600, width: '5%' }}>ID</Table.Th>
                  <Table.Th style={{ fontWeight: 600, width: '20%' }}>Email</Table.Th>
                  <Table.Th style={{ fontWeight: 600, width: '15%' }}>Username</Table.Th>
                  <Table.Th style={{ fontWeight: 600, width: '10%' }}>Role</Table.Th>
                  <Table.Th style={{ fontWeight: 600, width: '10%' }}>Total Annonces</Table.Th>
                  <Table.Th style={{ fontWeight: 600, width: '10%' }}>En attente</Table.Th>
                  <Table.Th style={{ fontWeight: 600, width: '10%' }}>Approuvées</Table.Th>
                  <Table.Th style={{ fontWeight: 600, width: '10%' }}>Rejetées</Table.Th>
                  <Table.Th style={{ fontWeight: 600, width: '10%' }}>Expirées</Table.Th>
                  <Table.Th style={{ fontWeight: 600, width: '10%' }}>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {data?.items?.map((user) => (
                  <Table.Tr key={user.id} style={{ transition: 'all 0.2s ease' }}>
                    <Table.Td>
                      <Text size="sm" fw={500} c="dimmed">
                        #{user.id.slice(0, 8)}...
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text fw={500} lineClamp={1}>
                        {user.email}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text fw={500} c={user.username ? 'dark' : 'dimmed'}>
                        {user.username || '-'}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        color={user.is_admin ? 'red' : 'blue'}
                        variant="light"
                        size="sm"
                      >
                        {user.is_admin ? 'Admin' : 'User'}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text fw={600} c="blue.6">
                        {user.listings_count.total}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge color="yellow" variant="light" size="sm">
                        {user.listings_count.pending}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Badge color="green" variant="light" size="sm">
                        {user.listings_count.approved}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Badge color="red" variant="light" size="sm">
                        {user.listings_count.rejected}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Badge color="orange" variant="light" size="sm">
                        {user.listings_count.expired || 0}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <ActionIcon
                        variant="light"
                        color="blue"
                        onClick={() => handleInfoClick(user)}
                        size="lg"
                      >
                        <IconInfoCircle size={18} />
                      </ActionIcon>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Paper>
        )}

        {data?.total_pages > 1 && (
          <Center py="xl">
            <Pagination
              page={page}
              total={data.total_pages}
              onChange={setPage}
            />
          </Center>
        )}

        <Modal
          opened={modalOpened}
          onClose={() => {
            setModalOpened(false)
            setSelectedUser(null)
          }}
          title={`Informations utilisateur: ${selectedUser?.email}`}
          size="xl"
        >
          {detailsLoading ? (
            <Text>{t('common.loading')}</Text>
          ) : userDetails ? (
            <Stack gap="md">
              <Paper p="md" radius="md" withBorder>
                <Text fw={600} size="lg" mb="md">Informations utilisateur</Text>
                <Stack gap="xs">
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Email:</Text>
                    <Text fw={500}>{userDetails.user.email}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Username:</Text>
                    <Text fw={500}>{userDetails.user.username || '-'}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">ID:</Text>
                    <Text size="sm" fw={500} c="dimmed">{userDetails.user.id}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Rôle:</Text>
                    <Badge color={userDetails.user.is_admin ? 'red' : 'blue'} variant="light">
                      {userDetails.user.is_admin ? 'Admin' : 'Utilisateur'}
                    </Badge>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Date de création:</Text>
                    <Text size="sm">{dayjs(userDetails.user.created_at).format('DD/MM/YYYY HH:mm')}</Text>
                  </Group>
                </Stack>
              </Paper>

              <Paper p="md" radius="md" withBorder>
                <Text fw={600} size="lg" mb="md">Statistiques</Text>
                <Group grow>
                  <Stack align="center" gap="xs">
                    <Text size="sm" c="dimmed">Total</Text>
                    <Text size="xl" fw={700} c="blue.6">{userDetails.statistics.total_listings}</Text>
                  </Stack>
                  <Stack align="center" gap="xs">
                    <Text size="sm" c="dimmed">En attente</Text>
                    <Text size="xl" fw={700} c="yellow.6">{userDetails.statistics.pending}</Text>
                  </Stack>
                  <Stack align="center" gap="xs">
                    <Text size="sm" c="dimmed">Approuvées</Text>
                    <Text size="xl" fw={700} c="green.6">{userDetails.statistics.approved}</Text>
                  </Stack>
                  <Stack align="center" gap="xs">
                    <Text size="sm" c="dimmed">Rejetées</Text>
                    <Text size="xl" fw={700} c="red.6">{userDetails.statistics.rejected}</Text>
                  </Stack>
                  <Stack align="center" gap="xs">
                    <Text size="sm" c="dimmed">Expirées</Text>
                    <Text size="xl" fw={700} c="orange.6">{userDetails.statistics.expired || 0}</Text>
                  </Stack>
                </Group>
              </Paper>

              {userDetails.listings.length > 0 && (
                <Paper p="md" radius="md" withBorder>
                  <Text fw={600} size="lg" mb="md">Annonces ({userDetails.listings.length})</Text>
                  <Stack gap="sm" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {userDetails.listings.map((listing) => (
                      <Paper key={listing.id} p="sm" radius="md" withBorder style={{ backgroundColor: '#f8f9fa' }}>
                        <Group justify="space-between" mb="xs">
                          <Text fw={600} lineClamp={1}>{listing.title}</Text>
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
                            variant="light"
                            size="sm"
                          >
                            {listing.status === 'expired' ? 'Expiré' : listing.status}
                          </Badge>
                        </Group>
                        <Group gap="md" mt="xs">
                          <Text size="xs" c="dimmed">📍 {listing.city}</Text>
                          <Text size="xs" c="dimmed">📁 {listing.category}</Text>
                          {listing.price && (
                            <Text size="xs" c="dimmed">💰 {listing.price} TND</Text>
                          )}
                          <Text size="xs" c="dimmed">👁️ {listing.views_count} vues</Text>
                          <Text size="xs" c="dimmed">📸 {listing.media_count} images</Text>
                        </Group>
                        <Text size="xs" c="dimmed" mt="xs">
                          Créé le: {dayjs(listing.created_at).format('DD/MM/YYYY HH:mm')}
                        </Text>
                        {listing.expires_at && (
                          <Text size="xs" c="dimmed">
                            Expire le: {dayjs(listing.expires_at).format('DD/MM/YYYY')}
                          </Text>
                        )}
                      </Paper>
                    ))}
                  </Stack>
                </Paper>
              )}
            </Stack>
          ) : (
            <Text>{t('common.loading')}</Text>
          )}
        </Modal>
      </Stack>
    </Container>
  )
}

export default AdminUsersPage

