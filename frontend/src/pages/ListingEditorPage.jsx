import { useParams, useNavigate } from 'react-router-dom'
import { Container, Title, TextInput, Textarea, Select, NumberInput, Button, Stack, Paper, Group, Text } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useTranslation } from 'react-i18next'
import { showNotification } from '@mantine/notifications'
import api from '../lib/api'
import ImageUploader from '../components/ImageUploader'
import { categories, getCategoryIcon } from '../utils/categoryIcons'

const ListingEditorPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const isEdit = !!id


  const cities = [
    'Tunis',
    'Sfax',
    'Sousse',
    'Ettadhamen',
    'Kairouan',
    'Gabès',
    'Bizerte',
    'Ariana',
    'Gafsa',
    'Monastir',
    'Ben Arous',
    'La Goulette',
    'Mars',
    'Nabeul',
    'Zarzis',
    'Médenine',
    'Mahdia',
    'Kasserine',
    'Kebili',
    'Beja',
    'Jendouba',
    'Le Kef',
    'Siliana',
    'Tozeur',
    'Tataouine',
    'Manouba',
    'Autre',
  ]

  const form = useForm({
    initialValues: {
      title: '',
      description: '',
      city: '',
      category: '',
      price: '',
      phone: '',
      whatsapp: '',
      media_urls: [],
    },
    validate: {
      title: (value) => (value.length < 3 ? t('errors.titleRequired') : null),
      description: (value) => (value.length < 10 ? t('errors.descriptionRequired') : null),
      city: (value) => (!value ? t('errors.cityRequired') : null),
      category: (value) => (!value ? t('errors.categoryRequired') : null),
    },
  })

  const { data: listing, isLoading } = useQuery(
    ['listing', id],
    async () => {
      const response = await api.get(`/listings/${id}`)
      return response.data
    },
    {
      enabled: isEdit,
      onSuccess: (data) => {
        form.setValues({
          title: data.title,
          description: data.description,
          city: data.city,
          category: data.category,
          price: data.price?.toString() || '',
          phone: data.phone || '',
          whatsapp: data.whatsapp || '',
          media_urls: data.media?.map(m => m.url) || [],
        })
      },
    }
  )

  const createMutation = useMutation(
    async (values) => {
      const response = await api.post('/listings', {
        ...values,
        price: values.price ? parseFloat(values.price) : null,
        media_urls: values.media_urls,
      })
      return response.data
    },
    {
      onSuccess: () => {
        showNotification({
          title: t('success'),
          message: 'Listing created successfully',
          color: 'green',
        })
        queryClient.invalidateQueries('listings')
        navigate('/my-listings')
      },
      onError: (error) => {
        showNotification({
          title: t('error'),
          message: error.response?.data?.detail || 'Failed to create listing',
          color: 'red',
        })
      },
    }
  )

  const updateMutation = useMutation(
    async (values) => {
      const response = await api.put(`/listings/${id}`, {
        ...values,
        price: values.price ? parseFloat(values.price) : null,
        media_urls: values.media_urls,
      })
      return response.data
    },
    {
      onSuccess: () => {
        showNotification({
          title: t('success'),
          message: 'Listing updated successfully',
          color: 'green',
        })
        queryClient.invalidateQueries('listings')
        queryClient.invalidateQueries(['listing', id])
        navigate('/my-listings')
      },
      onError: (error) => {
        showNotification({
          title: t('error'),
          message: error.response?.data?.detail || 'Failed to update listing',
          color: 'red',
        })
      },
    }
  )

  const handleSubmit = (values) => {
    if (isEdit) {
      updateMutation.mutate(values)
    } else {
      createMutation.mutate(values)
    }
  }

  if (isEdit && isLoading) {
    return (
      <Container>
        <Text>{t('common.loading')}</Text>
      </Container>
    )
  }

  // Check if listing is approved and user is not admin
  if (isEdit && listing && listing.status === 'approved' && !listing.user?.is_admin) {
    return (
      <Container size="md">
        <Paper p="xl" radius="md" withBorder>
          <Stack align="center" gap="md">
            <Text size="xl" fw={600} c="yellow.6">
              ⚠️ Annonce approuvée
            </Text>
            <Text ta="center" c="dimmed">
              Cette annonce a été approuvée et ne peut plus être modifiée.
              Si vous devez apporter des modifications, veuillez contacter le support.
            </Text>
            <Button onClick={() => navigate('/my-listings')}>
              {t('common.backToMyListings')}
            </Button>
          </Stack>
        </Paper>
      </Container>
    )
  }

  return (
    <Container size="md">
      <Paper p="md" radius="md" withBorder>
        <Title order={2} mb="xl">
          {isEdit ? t('listing.editListing') : t('listing.addListing')}
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label={t('listing.title')}
              placeholder={t('listing.title')}
              required
              {...form.getInputProps('title')}
            />

            <Textarea
              label={t('listing.description')}
              placeholder={t('listing.description')}
              required
              minRows={4}
              {...form.getInputProps('description')}
            />

            <Group grow>
              <Select
                label={t('listing.city')}
                placeholder={t('listing.city')}
                data={cities}
                required
                {...form.getInputProps('city')}
              />
              <Select
                label={t('listing.category')}
                placeholder={t('listing.category')}
                data={categories.map(cat => ({
                  value: cat,
                  label: cat,
                }))}
                required
                {...form.getInputProps('category')}
                leftSection={form.values.category ? (() => {
                  const CategoryIcon = getCategoryIcon(form.values.category)
                  return <CategoryIcon size={18} />
                })() : null}
                renderOption={({ option }) => {
                  const CategoryIcon = getCategoryIcon(option.value)
                  return (
                    <Group gap="xs">
                      <CategoryIcon size={18} />
                      <Text>{option.label}</Text>
                    </Group>
                  )
                }}
              />
            </Group>

            <NumberInput
              label={t('listing.price')}
              placeholder={t('listing.price')}
              min={0}
              step={50}
              {...form.getInputProps('price')}
            />

            <Group grow>
              <TextInput
                label={t('listing.phone')}
                placeholder={t('listing.phone')}
                {...form.getInputProps('phone')}
              />
              <TextInput
                label={t('listing.whatsapp')}
                placeholder={t('listing.whatsapp')}
                {...form.getInputProps('whatsapp')}
              />
            </Group>

            <div>
              <Text size="sm" fw={500} mb="xs">
                {t('listing.photos')} (max 10)
              </Text>
              <ImageUploader
                value={form.values.media_urls}
                onChange={(urls) => form.setFieldValue('media_urls', urls)}
                maxImages={10}
              />
            </div>

            <Group mt="md">
              <Button type="submit" loading={createMutation.isLoading || updateMutation.isLoading}>
                {t('common.save')}
              </Button>
              <Button variant="subtle" onClick={() => navigate(-1)}>
                {t('common.cancel')}
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Container>
  )
}

export default ListingEditorPage

