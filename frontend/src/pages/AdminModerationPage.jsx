import { useState, useEffect } from 'react'
import { Container, Title, Table, Button, Group, Badge, Text, Modal, Textarea, Stack, Pagination, Center, Paper, Switch, ActionIcon, Tooltip, Image, SimpleGrid, CloseButton, Tabs } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { showNotification } from '@mantine/notifications'
import { IconStar, IconPhoto, IconTrash, IconCheck, IconX, IconEye, IconClock } from '@tabler/icons-react'
import api from '../lib/api'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

const AdminModerationPage = () => {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const status = searchParams.get('status') || 'pending'
  const [page, setPage] = useState(1)
  const [selectedListing, setSelectedListing] = useState(null)
  const [approveModalOpened, setApproveModalOpened] = useState(false)
  const [rejectModalOpened, setRejectModalOpened] = useState(false)
  const [reason, setReason] = useState('')
  const [expirationDate, setExpirationDate] = useState(null)
  const [hasExpiration, setHasExpiration] = useState(false)
  const [isFeatured, setIsFeatured] = useState(false)
  const [imagesModalOpened, setImagesModalOpened] = useState(false)
  const [selectedListingForImages, setSelectedListingForImages] = useState(null)
  const [expirationModalOpened, setExpirationModalOpened] = useState(false)
  const [selectedListingForExpiration, setSelectedListingForExpiration] = useState(null)
  const [expirationDateForEdit, setExpirationDateForEdit] = useState(null)
  const [hasExpirationForEdit, setHasExpirationForEdit] = useState(false)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery(
    ['admin-listings', status, page],
    async () => {
      const response = await api.get('/admin/listings', {
        params: { status, page, page_size: 20 },
      })
      return response.data
    },
    {
      keepPreviousData: true, // Keep previous data while loading new data
    }
  )

  // Fetch stats for all statuses to show counts in tabs
  const { data: stats } = useQuery(
    'admin-stats',
    async () => {
      const response = await api.get('/admin/stats')
      return response.data
    }
  )

  // Automatically mark expired listings when component mounts
  const markExpiredMutation = useMutation(
    async () => {
      const response = await api.post('/admin/listings/mark-expired')
      return response.data
    },
    {
      onSuccess: (data) => {
        if (data.count > 0) {
          showNotification({
            title: t('success'),
            message: `${data.count} annonce(s) marquée(s) comme expirée(s)`,
            color: 'orange',
          })
          queryClient.invalidateQueries(['admin-listings'])
          queryClient.invalidateQueries('admin-stats')
        }
      },
      onError: (error) => {
        console.error('Error marking expired listings:', error)
      },
    }
  )

  // Mark expired listings on mount (only once)
  useEffect(() => {
    markExpiredMutation.mutate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const approveMutation = useMutation(
    async ({ id, reason, expires_at, is_featured }) => {
      const response = await api.post(`/admin/listings/${id}/approve`, {
        reason,
        expires_at: expires_at ? expires_at.toISOString() : null,
        is_featured: isFeatured
      })
      return response.data
    },
    {
      onSuccess: () => {
        showNotification({
          title: t('common.success'),
          message: t('admin.listingApproved'),
          color: 'green',
        })
        queryClient.invalidateQueries(['admin-listings'])
        queryClient.invalidateQueries('admin-stats')
        setApproveModalOpened(false)
        setSelectedListing(null)
            setReason('')
            setExpirationDate(null)
            setHasExpiration(false)
            setIsFeatured(false)
      },
      onError: (error) => {
        showNotification({
          title: t('common.error'),
          message: error.response?.data?.detail || t('admin.failedToApprove'),
          color: 'red',
        })
      },
    }
  )

  const rejectMutation = useMutation(
    async ({ id, reason }) => {
      const response = await api.post(`/admin/listings/${id}/reject`, { reason })
      return response.data
    },
    {
      onSuccess: () => {
        showNotification({
          title: t('common.success'),
          message: t('admin.listingRejected'),
          color: 'yellow',
        })
        queryClient.invalidateQueries(['admin-listings'])
        queryClient.invalidateQueries('admin-stats')
        setRejectModalOpened(false)
        setSelectedListing(null)
        setReason('')
      },
      onError: (error) => {
        const errorMessage = error.response?.data?.detail
        let message = t('admin.failedToReject')
        if (Array.isArray(errorMessage)) {
          // Handle Pydantic validation errors
          message = errorMessage.map(err => err.msg || err.message || JSON.stringify(err)).join(', ')
        } else if (typeof errorMessage === 'string') {
          message = errorMessage
        }
        showNotification({
          title: t('common.error'),
          message,
          color: 'red',
        })
      },
    }
  )

  const togglePremiumMutation = useMutation(
    async ({ id, is_featured }) => {
      const response = await api.patch(`/admin/listings/${id}/premium`, null, {
        params: { is_featured }
      })
      return response.data
    },
    {
      onSuccess: (data) => {
        showNotification({
          title: t('success'),
          message: data.is_featured ? 'Annonce marquée comme premium' : 'Annonce retirée du premium',
          color: 'green',
        })
        queryClient.invalidateQueries(['admin-listings'])
        queryClient.invalidateQueries('admin-stats')
        queryClient.invalidateQueries('listings')
      },
      onError: (error) => {
        showNotification({
          title: t('error'),
          message: error.response?.data?.detail || 'Failed to update premium status',
          color: 'red',
        })
      },
    }
  )

  const updateExpirationMutation = useMutation(
    async ({ id, expires_at }) => {
      const response = await api.patch(`/admin/listings/${id}/expiration`, {
        expires_at: expires_at ? expires_at.toISOString() : null
      })
      return response.data
    },
    {
      onSuccess: () => {
        showNotification({
          title: t('success'),
          message: 'Date d\'expiration mise à jour avec succès',
          color: 'green',
        })
        queryClient.invalidateQueries(['admin-listings'])
        queryClient.invalidateQueries('admin-stats')
        setExpirationModalOpened(false)
        setSelectedListingForExpiration(null)
        setExpirationDateForEdit(null)
        setHasExpirationForEdit(false)
      },
      onError: (error) => {
        showNotification({
          title: t('error'),
          message: error.response?.data?.detail || 'Échec de la mise à jour de la date d\'expiration',
          color: 'red',
        })
      },
    }
  )

  const handleSetExpiration = (listing) => {
    setSelectedListingForExpiration(listing)
    if (listing.expires_at) {
      setExpirationDateForEdit(new Date(listing.expires_at))
      setHasExpirationForEdit(true)
    } else {
      setExpirationDateForEdit(null)
      setHasExpirationForEdit(false)
    }
    setExpirationModalOpened(true)
  }

  const confirmUpdateExpiration = () => {
    if (selectedListingForExpiration) {
      updateExpirationMutation.mutate({
        id: selectedListingForExpiration.id,
        expires_at: hasExpirationForEdit && expirationDateForEdit ? expirationDateForEdit : null
      })
    }
  }

  const deleteImageMutation = useMutation(
    async ({ mediaId, imageUrl }) => {
      // Delete from backend (removes from database)
      const response = await api.delete(`/media/${mediaId}`)
      
      // Also delete from Supabase Storage if it's a Supabase URL
      if (imageUrl && imageUrl.includes('supabase')) {
        try {
          const { supabase } = await import('../lib/supabase')
          // Extract file path from URL
          // URL format: https://xxx.supabase.co/storage/v1/object/public/listing-images/user-id/filename.jpg
          if (imageUrl.includes('/object/public/')) {
            const parts = imageUrl.split('/object/public/')
            if (parts.length > 1) {
              const fullPath = parts[1] // listing-images/user-id/filename.jpg
              // Remove bucket name from path
              const storagePath = fullPath.replace('listing-images/', '')
              await supabase.storage.from('listing-images').remove([storagePath])
            }
          }
        } catch (storageError) {
          console.warn('Failed to delete from storage:', storageError)
          // Continue even if storage deletion fails - DB record is already deleted
        }
      }
      
      return response.data
    },
    {
      onSuccess: (_, variables) => {
        showNotification({
          title: t('common.success'),
          message: t('admin.imageDeleted'),
          color: 'green',
        })
        queryClient.invalidateQueries(['admin-listings'])
        // Update the local state to reflect the deletion
        if (selectedListingForImages) {
          setSelectedListingForImages(prev => ({
            ...prev,
            media: prev.media.filter(m => m.id !== variables.mediaId)
          }))
        }
      },
      onError: (error) => {
        showNotification({
          title: t('common.error'),
          message: error.response?.data?.detail || t('admin.imageDeleteFailed'),
          color: 'red',
        })
      },
    }
  )

  const handleViewImages = (listing) => {
    setSelectedListingForImages(listing)
    setImagesModalOpened(true)
  }

  const handleDeleteImage = (mediaId, imageUrl) => {
    if (window.confirm(t('common.confirmDelete'))) {
      deleteImageMutation.mutate({ mediaId, imageUrl })
    }
  }

  const handleApprove = (listing) => {
    setSelectedListing(listing)
    setExpirationDate(null)
    setHasExpiration(false)
    setIsFeatured(listing.is_featured || false)
    setApproveModalOpened(true)
  }

  const handleReject = (listing) => {
    setSelectedListing(listing)
    setRejectModalOpened(true)
  }

  const confirmApprove = () => {
    if (selectedListing) {
        approveMutation.mutate({
          id: selectedListing.id,
          reason,
          expires_at: hasExpiration && expirationDate ? expirationDate : null,
          is_featured: isFeatured
        })
    }
  }

  const confirmReject = () => {
    if (selectedListing && reason.trim().length >= 5) {
      rejectMutation.mutate({ id: selectedListing.id, reason: reason.trim() })
    } else {
      showNotification({
        title: t('common.error'),
        message: reason.trim() ? t('admin.reasonMinLength') : t('admin.reasonRequired'),
        color: 'red',
      })
    }
  }

  if (isLoading) {
    return (
      <Container style={{ paddingTop: '120px', paddingBottom: '48px' }}>
        <Text>{t('common.loading')}</Text>
      </Container>
    )
  }

      return (
        <Container size="xl" fluid style={{ maxWidth: '100%', padding: '120px 1rem 2rem' }}>
          <Stack gap="lg">
            <Group justify="space-between" align="center" mb="md">
              <Title 
                order={1}
                style={{
                  background: 'linear-gradient(135deg, #FFC300 0%, #ffb300 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  margin: 0,
                }}
              >
                {status === 'pending' ? t('admin.pendingListings') : 
                 status === 'approved' ? t('admin.approvedListings') : 
                 status === 'rejected' ? t('admin.rejectedListings') :
                 status === 'expired' ? t('admin.expiredListings') :
                 t('admin.pendingListings')}
              </Title>
            </Group>

            <Tabs 
              value={status} 
              onChange={(value) => {
                setSearchParams({ status: value || 'pending' })
                setPage(1) // Reset to first page when switching tabs
              }}
              style={{ width: '100%' }}
            >
              <Tabs.List grow>
                <Tabs.Tab 
                  value="pending"
                  rightSection={
                    <Badge size="sm" variant="light" color="yellow" circle style={{ marginLeft: 8 }}>
                      {stats?.pending_listings || 0}
                    </Badge>
                  }
                >
                  {t('admin.pendingListings')}
                </Tabs.Tab>
                <Tabs.Tab 
                  value="approved"
                  rightSection={
                    <Badge size="sm" variant="light" color="green" circle style={{ marginLeft: 8 }}>
                      {stats?.approved_listings || 0}
                    </Badge>
                  }
                >
                  {t('admin.approvedListings')}
                </Tabs.Tab>
                <Tabs.Tab 
                  value="rejected"
                  rightSection={
                    <Badge size="sm" variant="light" color="red" circle style={{ marginLeft: 8 }}>
                      {stats?.rejected_listings || 0}
                    </Badge>
                  }
                >
                  {t('admin.rejectedListings')}
                </Tabs.Tab>
                <Tabs.Tab 
                  value="expired"
                  rightSection={
                    <Badge size="sm" variant="light" color="orange" circle style={{ marginLeft: 8 }}>
                      {stats?.expired_listings || 0}
                    </Badge>
                  }
                >
                  Annonces expirées
                </Tabs.Tab>
              </Tabs.List>
            </Tabs>

        {data?.items?.length === 0 ? (
          <Paper p="xl" radius="md" withBorder>
            <Text ta="center" c="dimmed">
              {t('admin.noListings')}
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
                  <Table.Th style={{ fontWeight: 600, width: '20%' }}>{t('listing.title')}</Table.Th>
                  <Table.Th style={{ fontWeight: 600, width: '10%' }}>{t('listing.city')}</Table.Th>
                  <Table.Th style={{ fontWeight: 600, width: '12%' }}>{t('listing.category')}</Table.Th>
                  <Table.Th style={{ fontWeight: 600, width: '8%' }}>{t('listing.price')}</Table.Th>
                  <Table.Th style={{ fontWeight: 600, width: '12%' }}>User</Table.Th>
                  <Table.Th style={{ fontWeight: 600, width: '7%' }}>Images</Table.Th>
                  <Table.Th style={{ fontWeight: 600, width: '8%' }}>Status</Table.Th>
                  <Table.Th style={{ fontWeight: 600, width: '8%' }}>Premium</Table.Th>
                  <Table.Th style={{ fontWeight: 600, width: '12%' }}>Expiration</Table.Th>
                  <Table.Th style={{ fontWeight: 600, width: '10%' }}>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {data?.items?.map((listing) => (
                  <Table.Tr key={listing.id} style={{ transition: 'all 0.2s ease' }}>
                    <Table.Td>
                      <Text size="sm" fw={500} c="dimmed">
                        #{listing.id}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text fw={500} lineClamp={2}>
                        {listing.title}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="light" color="yellow" size="sm">
                        {listing.city}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="light" color="gray" size="sm">
                        {listing.category}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      {listing.price ? (
                        <Text fw={600} c="green.6">
                          {listing.price} TND
                        </Text>
                      ) : (
                        <Text size="sm" c="dimmed">-</Text>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed" lineClamp={1}>
                        {listing.user?.username || listing.user?.email || 'N/A'}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs" wrap="nowrap">
                        <Badge
                          variant="light"
                          color={listing.media && listing.media.length > 0 ? 'blue' : 'gray'}
                          size="sm"
                          leftSection={<IconPhoto size={12} />}
                        >
                          {listing.media?.length || 0}
                        </Badge>
                        {listing.media && listing.media.length > 0 && (
                          <Tooltip label="Voir les images">
                            <ActionIcon
                              size="sm"
                              variant="light"
                              color="blue"
                              onClick={() => handleViewImages(listing)}
                            >
                              <IconPhoto size={14} />
                            </ActionIcon>
                          </Tooltip>
                        )}
                      </Group>
                    </Table.Td>
                    <Table.Td>
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
                        size="md"
                      >
                        {listing.status === 'expired' ? 'Expiré' : t(`listing.status.${listing.status}`)}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        color={listing.is_featured ? 'yellow' : 'gray'}
                        variant={listing.is_featured ? 'filled' : 'light'}
                        size="sm"
                      >
                        {listing.is_featured ? '⭐ Premium' : 'Standard'}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      {listing.expires_at ? (
                        (() => {
                          const expiresDate = dayjs(listing.expires_at)
                          const now = dayjs()
                          const daysRemaining = expiresDate.diff(now, 'day')
                          const hoursRemaining = expiresDate.diff(now, 'hour')
                          const isExpired = daysRemaining < 0 || hoursRemaining < 0
                          const isExpiringSoon = daysRemaining >= 0 && daysRemaining <= 7
                          
                          // Calculate hours remaining (excluding full days)
                          const hoursOnly = hoursRemaining % 24
                          
                          return (
                            <Stack gap={2}>
                              <Text size="sm" fw={500} c={isExpired ? 'red' : isExpiringSoon ? 'orange' : 'green'}>
                                {isExpired 
                                  ? 'Expiré' 
                                  : daysRemaining > 0
                                  ? `${daysRemaining}j ${Math.abs(hoursOnly)}h`
                                  : `${Math.abs(hoursRemaining)}h`
                                }
                              </Text>
                              <Text size="xs" c="dimmed">
                                {expiresDate.format('DD/MM/YY HH:mm')}
                              </Text>
                              <Badge
                                color={isExpired ? 'red' : isExpiringSoon ? 'orange' : 'green'}
                                variant="light"
                                size="xs"
                              >
                                {isExpired ? 'Expiré' : isExpiringSoon ? 'Bientôt' : 'Actif'}
                              </Badge>
                            </Stack>
                          )
                        })()
                      ) : (
                        <Badge color="gray" variant="light" size="sm">
                          -
                        </Badge>
                      )}
                    </Table.Td>
                        <Table.Td>
                          <Group gap="xs" wrap="nowrap">
                            {listing.status === 'approved' && (
                              <>
                                <Tooltip label={listing.is_featured ? 'Retirer du premium' : 'Marquer comme premium'}>
                                  <ActionIcon
                                    size="md"
                                    color={listing.is_featured ? 'yellow' : 'gray'}
                                    variant={listing.is_featured ? 'filled' : 'light'}
                                    onClick={() => togglePremiumMutation.mutate({ 
                                      id: listing.id, 
                                      is_featured: !listing.is_featured 
                                    })}
                                    loading={togglePremiumMutation.isLoading}
                                  >
                                    <IconStar size={18} fill={listing.is_featured ? 'currentColor' : 'none'} />
                                  </ActionIcon>
                                </Tooltip>
                                <Tooltip label="Définir/modifier la date d'expiration">
                                  <ActionIcon
                                    size="md"
                                    color="orange"
                                    variant="light"
                                    onClick={() => handleSetExpiration(listing)}
                                    style={{
                                      transition: 'all 0.2s ease',
                                    }}
                                  >
                                    <IconClock size={18} />
                                  </ActionIcon>
                                </Tooltip>
                              </>
                            )}
                            <Tooltip label={listing.status === 'approved' ? 'Déjà approuvé' : t('admin.approve')}>
                              <ActionIcon
                                size="lg"
                                color="green"
                                variant={listing.status === 'approved' ? 'light' : 'filled'}
                                onClick={() => handleApprove(listing)}
                                disabled={listing.status === 'approved'}
                                style={{
                                  transition: 'all 0.2s ease',
                                }}
                              >
                                <IconCheck size={18} />
                              </ActionIcon>
                            </Tooltip>
                            <Tooltip label={listing.status === 'rejected' ? 'Déjà rejeté' : t('admin.reject')}>
                              <ActionIcon
                                size="lg"
                                color="red"
                                variant={listing.status === 'rejected' ? 'light' : 'filled'}
                                onClick={() => handleReject(listing)}
                                disabled={listing.status === 'rejected'}
                                style={{
                                  transition: 'all 0.2s ease',
                                }}
                              >
                                <IconX size={18} />
                              </ActionIcon>
                            </Tooltip>
                            <Tooltip label="Voir les détails">
                              <ActionIcon
                                size="lg"
                                color="blue"
                                variant="light"
                                onClick={() => window.open(`/listing/${listing.id}`, '_blank')}
                                style={{
                                  transition: 'all 0.2s ease',
                                }}
                              >
                                <IconEye size={18} />
                              </ActionIcon>
                            </Tooltip>
                          </Group>
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
          opened={approveModalOpened}
              onClose={() => {
                setApproveModalOpened(false)
                setExpirationDate(null)
                setHasExpiration(false)
                setIsFeatured(false)
              }}
          title={t('admin.approve')}
          size="md"
          centered
        >
          <Stack>
            <Textarea
              label={t('admin.reason')}
              placeholder={t('admin.reason')}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <Switch
              label={t('admin.setExpiration')}
              checked={hasExpiration}
              onChange={(e) => {
                setHasExpiration(e.currentTarget.checked)
                if (!e.currentTarget.checked) {
                  setExpirationDate(null)
                }
              }}
              description={t('admin.expirationDescription')}
            />
                {hasExpiration && (
                  <DatePickerInput
                    label={t('admin.expirationDate')}
                    placeholder={t('admin.expirationDate')}
                    value={expirationDate}
                    onChange={setExpirationDate}
                    minDate={new Date()}
                    clearable
                    required={hasExpiration}
                    style={{ width: '100%' }}
                  />
                )}
                <Switch
                  label={t('admin.markAsPremium')}
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.currentTarget.checked)}
                  color="yellow"
                  description={t('admin.premiumDescription')}
                />
                <Group>
              <Button onClick={confirmApprove} loading={approveMutation.isLoading}>
                {t('admin.approve')}
              </Button>
              <Button 
                variant="subtle" 
                onClick={() => {
                  setApproveModalOpened(false)
                  setExpirationDate(null)
                  setHasExpiration(false)
                }}
              >
                {t('common.cancel')}
              </Button>
            </Group>
          </Stack>
        </Modal>

        <Modal
          opened={rejectModalOpened}
          onClose={() => setRejectModalOpened(false)}
          title={t('admin.reject')}
          size="md"
          centered
        >
          <Stack>
            <Textarea
              label={t('admin.reason')}
              placeholder={t('admin.reason')}
              required
              minLength={5}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              error={reason && reason.trim().length > 0 && reason.trim().length < 5 ? t('admin.reasonMinLength') : null}
            />
            <Group>
              <Button
                color="red"
                onClick={confirmReject}
                loading={rejectMutation.isLoading}
              >
                {t('admin.reject')}
              </Button>
              <Button variant="subtle" onClick={() => setRejectModalOpened(false)}>
                {t('common.cancel')}
              </Button>
            </Group>
          </Stack>
        </Modal>

        <Modal
          opened={imagesModalOpened}
          onClose={() => {
            setImagesModalOpened(false)
            setSelectedListingForImages(null)
          }}
          title={`Images - ${selectedListingForImages?.title || ''}`}
          size="xl"
        >
          {selectedListingForImages && (
            <Stack>
              <Text size="sm" c="dimmed">
                {selectedListingForImages.media?.length || 0} image(s) - Cliquez sur 🗑️ pour supprimer
              </Text>
              {selectedListingForImages.media && selectedListingForImages.media.length > 0 ? (
                <SimpleGrid cols={3} spacing="md">
                  {selectedListingForImages.media.map((media) => (
                    <Paper key={media.id} p="xs" radius="md" withBorder pos="relative">
                      <Image
                        src={media.url}
                        alt={`Image ${media.id}`}
                        radius="md"
                        style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                      />
                      <ActionIcon
                        pos="absolute"
                        top={5}
                        right={5}
                        color="red"
                        variant="filled"
                        size="sm"
                        onClick={() => handleDeleteImage(media.id, media.url)}
                        loading={deleteImageMutation.isLoading}
                      >
                        <IconTrash size={14} />
                      </ActionIcon>
                    </Paper>
                  ))}
                </SimpleGrid>
              ) : (
                <Text ta="center" c="dimmed" py="xl">
                  Aucune image
                </Text>
              )}
            </Stack>
          )}
            </Modal>

            <Modal
              opened={expirationModalOpened}
              onClose={() => {
                setExpirationModalOpened(false)
                setSelectedListingForExpiration(null)
                setExpirationDateForEdit(null)
                setHasExpirationForEdit(false)
              }}
              title={`Date d'expiration - ${selectedListingForExpiration?.title || ''}`}
            >
              <Stack>
                <Text size="sm" c="dimmed">
                  Définir ou modifier la date d'expiration pour cette annonce approuvée.
                </Text>
                <Switch
                  label="Définir une date d'expiration"
                  checked={hasExpirationForEdit}
                  onChange={(e) => {
                    setHasExpirationForEdit(e.currentTarget.checked)
                    if (!e.currentTarget.checked) {
                      setExpirationDateForEdit(null)
                    }
                  }}
                  description="L'annonce sera automatiquement masquée après cette date"
                />
                {hasExpirationForEdit && (
                  <DatePickerInput
                    label="Date et heure d'expiration"
                    placeholder="Sélectionner une date et heure"
                    value={expirationDateForEdit}
                    onChange={setExpirationDateForEdit}
                    minDate={new Date()}
                    clearable
                    required={hasExpirationForEdit}
                    style={{ width: '100%' }}
                  />
                )}
                {selectedListingForExpiration?.expires_at && (
                  <Text size="sm" c="dimmed">
                    Date actuelle: {dayjs(selectedListingForExpiration.expires_at).format('DD/MM/YYYY HH:mm')}
                  </Text>
                )}
                <Group>
                  <Button 
                    onClick={confirmUpdateExpiration} 
                    loading={updateExpirationMutation.isLoading}
                    color="orange"
                  >
                    {selectedListingForExpiration?.expires_at ? 'Modifier' : 'Définir'}
                  </Button>
                  <Button 
                    variant="subtle" 
                    onClick={() => {
                      setExpirationModalOpened(false)
                      setExpirationDateForEdit(null)
                      setHasExpirationForEdit(false)
                    }}
                  >
                    {t('common.cancel')}
                  </Button>
                </Group>
              </Stack>
            </Modal>
          </Stack>
        </Container>
      )
    }

    export default AdminModerationPage

