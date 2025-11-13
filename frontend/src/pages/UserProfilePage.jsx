import { useState, useEffect } from 'react'
import { Container, Title, Paper, Stack, Group, Text, Badge, SimpleGrid, Card, Divider, Avatar, Button, TextInput, ActionIcon, Tooltip } from '@mantine/core'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { showNotification } from '@mantine/notifications'
import api from '../lib/api'
import { IconUser, IconList, IconClock, IconCheck, IconX, IconEdit, IconCheck as IconCheckSave, IconX as IconXCancel, IconHourglass } from '@tabler/icons-react'
import dayjs from 'dayjs'
import RecentViewsSection from '../components/RecentViewsSection'

const UserProfilePage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isEditingUsername, setIsEditingUsername] = useState(false)
  const [usernameValue, setUsernameValue] = useState('')

  const { data, isLoading, error } = useQuery(
    'user-profile-stats',
    async () => {
      const response = await api.get('/users/me/stats')
      console.log('User stats response:', response.data) // Debug
      return response.data
    }
  )

  // Initialize username value when data loads
  useEffect(() => {
    if (data?.user?.username && !isEditingUsername) {
      setUsernameValue(data.user.username)
    }
  }, [data?.user?.username, isEditingUsername])

  const updateUsernameMutation = useMutation(
    async (username) => {
      const response = await api.put('/users/me', { username })
      return response.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('user-profile-stats')
        setIsEditingUsername(false)
        showNotification({
          title: 'Succès',
          message: 'Nom d\'utilisateur mis à jour avec succès',
          color: 'green',
        })
      },
      onError: (error) => {
        showNotification({
          title: 'Erreur',
          message: error.response?.data?.detail || 'Erreur lors de la mise à jour du nom d\'utilisateur',
          color: 'red',
        })
      },
    }
  )

  const handleEditUsername = () => {
    setUsernameValue(data?.user?.username || '')
    setIsEditingUsername(true)
  }

  const handleSaveUsername = () => {
    if (!usernameValue.trim()) {
      showNotification({
        title: 'Erreur',
        message: 'Le nom d\'utilisateur ne peut pas être vide',
        color: 'red',
      })
      return
    }
    if (usernameValue.length < 3) {
      showNotification({
        title: 'Erreur',
        message: 'Le nom d\'utilisateur doit contenir au moins 3 caractères',
        color: 'red',
      })
      return
    }
    updateUsernameMutation.mutate(usernameValue.trim())
  }

  const handleCancelEdit = () => {
    setUsernameValue(data?.user?.username || '')
    setIsEditingUsername(false)
  }

  if (isLoading) {
    return (
      <Container size="md" py="xl">
        <Text>{t('common.loading')}</Text>
      </Container>
    )
  }

  if (error) {
    return (
      <Container size="md" py="xl">
        <Text c="red">Error loading profile: {error.message}</Text>
      </Container>
    )
  }

  const user = data?.user
  const stats = data?.stats || {}
  
  // Debug: Log stats to see what we're getting
  console.log('Stats object:', stats)
  console.log('Expired count:', stats.expired)

  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        {/* Profile Header */}
        <Paper p="xl" radius="md" withBorder>
          <Group justify="space-between" align="flex-start">
            <Group gap="md">
              <Avatar
                size={80}
                radius="md"
                color="yellow"
                style={{
                  background: 'linear-gradient(135deg, #FFC300 0%, #ffb300 100%)',
                }}
              >
                <IconUser size={40} />
              </Avatar>
              <Stack gap="xs">
                <Title order={2}>
                  {user?.username || user?.email || 'Utilisateur'}
                </Title>
                <Text size="sm" c="dimmed">
                  {user?.email}
                </Text>
                <Text size="xs" c="dimmed">
                  Membre depuis {dayjs(user?.created_at).format('MMMM YYYY')}
                </Text>
              </Stack>
            </Group>
            <Button
              variant="light"
              leftSection={<IconEdit size={16} />}
              onClick={() => navigate('/my-listings')}
            >
              Mes annonces
            </Button>
          </Group>
        </Paper>

        {/* Statistics Cards */}
        <Title order={3}>Statistiques des annonces</Title>
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 5 }} spacing="md">
          <Card
            p="md"
            radius="md"
            withBorder
            style={{
              background: 'linear-gradient(135deg, rgba(255, 195, 0, 0.1) 0%, rgba(255, 179, 0, 0.1) 100%)',
              borderColor: '#FFC300',
            }}
          >
            <Stack gap="xs" align="center">
              <IconList size={32} color="#FFC300" />
              <Text size="xl" fw={700} c="yellow.7">
                {stats.total_listings || 0}
              </Text>
              <Text size="sm" c="dimmed" ta="center">
                Total annonces
              </Text>
            </Stack>
          </Card>

          <Card
            p="md"
            radius="md"
            withBorder
            style={{
              background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 179, 0, 0.1) 100%)',
              borderColor: '#FFC107',
            }}
          >
            <Stack gap="xs" align="center">
              <IconClock size={32} color="#FFC107" />
              <Text size="xl" fw={700} c="yellow.6">
                {stats.pending || 0}
              </Text>
              <Text size="sm" c="dimmed" ta="center">
                En attente
              </Text>
            </Stack>
          </Card>

          <Card
            p="md"
            radius="md"
            withBorder
            style={{
              background: 'linear-gradient(135deg, rgba(40, 167, 69, 0.1) 0%, rgba(34, 139, 58, 0.1) 100%)',
              borderColor: '#28a745',
            }}
          >
            <Stack gap="xs" align="center">
              <IconCheck size={32} color="#28a745" />
              <Text size="xl" fw={700} c="green.7">
                {stats.approved || 0}
              </Text>
              <Text size="sm" c="dimmed" ta="center">
                Approuvées
              </Text>
            </Stack>
          </Card>

          <Card
            p="md"
            radius="md"
            withBorder
            style={{
              background: 'linear-gradient(135deg, rgba(220, 53, 69, 0.1) 0%, rgba(200, 35, 51, 0.1) 100%)',
              borderColor: '#dc3545',
            }}
          >
            <Stack gap="xs" align="center">
              <IconX size={32} color="#dc3545" />
              <Text size="xl" fw={700} c="red.7">
                {stats.rejected || 0}
              </Text>
              <Text size="sm" c="dimmed" ta="center">
                Rejetées
              </Text>
            </Stack>
          </Card>

          <Card
            p="md"
            radius="md"
            withBorder
            style={{
              background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(245, 124, 0, 0.1) 100%)',
              borderColor: '#ff9800',
            }}
          >
            <Stack gap="xs" align="center">
              <IconHourglass size={32} color="#ff9800" />
              <Text size="xl" fw={700} c="orange.7">
                {stats.expired || 0}
              </Text>
              <Text size="sm" c="dimmed" ta="center">
                Expirées
              </Text>
            </Stack>
          </Card>
        </SimpleGrid>

        {/* Additional Info */}
        <Paper p="md" radius="md" withBorder>
          <Stack gap="md">
            <Title order={4}>Informations du compte</Title>
            <Divider />
            
            <Group justify="space-between" align="center">
              <Text size="sm" fw={500}>Nom d'utilisateur:</Text>
              {isEditingUsername ? (
                <Group gap="xs" align="center">
                  <TextInput
                    value={usernameValue}
                    onChange={(e) => setUsernameValue(e.target.value)}
                    placeholder="Nom d'utilisateur"
                    size="sm"
                    style={{ width: '200px' }}
                    minLength={3}
                    maxLength={50}
                  />
                  <Tooltip label="Enregistrer">
                    <ActionIcon
                      color="green"
                      variant="filled"
                      onClick={handleSaveUsername}
                      loading={updateUsernameMutation.isLoading}
                    >
                      <IconCheckSave size={16} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Annuler">
                    <ActionIcon
                      color="gray"
                      variant="light"
                      onClick={handleCancelEdit}
                      disabled={updateUsernameMutation.isLoading}
                    >
                      <IconXCancel size={16} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              ) : (
                <Group gap="xs" align="center">
                  <Badge variant="light" color="yellow">
                    {user?.username || 'Non défini'}
                  </Badge>
                  <Tooltip label="Modifier le nom d'utilisateur">
                    <ActionIcon
                      variant="light"
                      color="blue"
                      size="sm"
                      onClick={handleEditUsername}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              )}
            </Group>
            <Group justify="space-between">
              <Text size="sm" fw={500}>Email:</Text>
              <Text size="sm" c="dimmed">{user?.email}</Text>
            </Group>
            <Group justify="space-between">
              <Text size="sm" fw={500}>Type de compte:</Text>
              <Badge color={user?.is_admin ? 'orange' : 'blue'}>
                {user?.is_admin ? 'Administrateur' : 'Utilisateur'}
              </Badge>
            </Group>
            <Group justify="space-between">
              <Text size="sm" fw={500}>Date d'inscription:</Text>
              <Text size="sm" c="dimmed">
                {dayjs(user?.created_at).format('DD/MM/YYYY à HH:mm')}
              </Text>
            </Group>
          </Stack>
        </Paper>

        {/* Annonces récemment consultées */}
        <RecentViewsSection />
      </Stack>
    </Container>
  )
}

export default UserProfilePage

