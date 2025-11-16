import { Group, Stack, Text, Button, Anchor, Box, SimpleGrid, Image, Grid, Container } from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconPlus } from '@tabler/icons-react'
import { categories } from '../utils/categoryIcons'
import { useAuth } from '../context/AuthContext'

const Footer = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { isAuthenticated } = useAuth()

  const popularCities = [
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
  ]

  const handleCategoryClick = (category) => {
    navigate(`/?category=${encodeURIComponent(category)}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCityClick = (city) => {
    navigate(`/?city=${encodeURIComponent(city)}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <Box
      component="footer"
      className="app-footer"
      style={{
        backgroundColor: '#faf8f3',
        borderTop: '1px solid #e9ecef',
        marginTop: 'auto',
        padding: '16px 0 12px',
        width: '100%',
        maxWidth: '100%',
        marginLeft: 0,
        marginRight: 0,
        boxSizing: 'border-box',
      }}
    >
      {/* Main Footer Content - Horizontal Layout: Image 1/3, Content 2/3 */}
      <Container size="xl" style={{ paddingBottom: '12px', paddingLeft: '0', paddingRight: '0' }}>
        <Grid gutter="md" align="flex-start">
          {/* Left Section - Image (1/3) */}
          <Grid.Col span={{ base: 12, sm: 12, md: 4 }}>
            <Stack gap={4}>
              <Image
                src="/assets/home2.jpg"
                alt="Carthage Wellness Spa"
                fit="cover"
                radius="sm"
                style={{
                  width: '100%',
                  aspectRatio: '2/1',
                  objectFit: 'cover',
                  borderRadius: '6px',
                }}
              />
              <Text size="xs" c="dimmed" style={{ lineHeight: 1.4, fontSize: '11px' }}>
                {t('footer.description')}
              </Text>
            </Stack>
          </Grid.Col>

          {/* Right Section - Content (2/3) */}
          <Grid.Col span={{ base: 12, sm: 12, md: 8 }}>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="sm" style={{ width: '100%' }}>
              {/* Popular Categories */}
              <Stack gap="sm">
                <Text fw={600} size="sm" mb="md" style={{ fontSize: '14px' }}>
                  {t('footer.popularCategories')}
                </Text>
                <SimpleGrid cols={2} spacing="sm" verticalSpacing="md">
                  {categories.map((category) => (
                    <Anchor
                      key={category}
                      onClick={() => handleCategoryClick(category)}
                      size="sm"
                      c="dimmed"
                      style={{
                        textDecoration: 'none',
                        transition: 'color 0.2s ease',
                        fontSize: '13px',
                        lineHeight: 1.6,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#FFC300'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = undefined
                      }}
                    >
                      {category}
                    </Anchor>
                  ))}
                </SimpleGrid>
              </Stack>

              {/* Popular Cities */}
              <Stack gap="sm">
                <Text fw={600} size="sm" mb="md" style={{ fontSize: '14px' }}>
                  {t('footer.popularCities')}
                </Text>
                <SimpleGrid cols={2} spacing="sm" verticalSpacing="md">
                  {popularCities.map((city) => (
                    <Anchor
                      key={city}
                      onClick={() => handleCityClick(city)}
                      size="sm"
                      c="dimmed"
                      style={{
                        textDecoration: 'none',
                        transition: 'color 0.2s ease',
                        fontSize: '13px',
                        lineHeight: 1.6,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#FFC300'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = undefined
                      }}
                    >
                      {city}
                    </Anchor>
                  ))}
                </SimpleGrid>
              </Stack>

              {/* Create Listing CTA */}
              <Stack gap="sm">
                <Text fw={600} size="sm" mb="md" style={{ fontSize: '14px' }}>
                  {t('footer.createListing')}
                </Text>
                <Box
                  p="xs"
                  style={{
                    backgroundColor: 'rgba(255, 195, 0, 0.08)',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 195, 0, 0.2)',
                  }}
                >
                  <Text size="sm" c="dimmed" mb="md" style={{ lineHeight: 1.6, fontSize: '13px' }}>
                    {t('footer.createListingDescription')}
                  </Text>
                  <Button
                    leftSection={<IconPlus size={12} />}
                    onClick={() => navigate(isAuthenticated ? '/listing/new' : '/login')}
                    size="xs"
                    color="yellow"
                    variant="filled"
                    fullWidth
                    style={{ height: '28px', fontSize: '11px' }}
                  >
                    {isAuthenticated ? t('footer.createListingButton') : t('footer.loginButton')}
                  </Button>
                </Box>
              </Stack>
            </SimpleGrid>
          </Grid.Col>
        </Grid>
      </Container>

      {/* Copyright Section */}
      <Container size="xl" style={{ paddingLeft: '0', paddingRight: '0' }}>
        <Box 
          pt={8} 
          mt="sm"
          style={{ 
            borderTop: '1px solid #e9ecef',
            width: '100%',
          }}
        >
        <Group justify="space-between" wrap="wrap" gap="sm">
          <Text size="xs" c="dimmed" style={{ fontSize: '11px' }}>
            {`${new Date().getFullYear()} ${t('footer.copyrightText')}`}
          </Text>
          <Group gap="sm" wrap="wrap">
            <Anchor 
              size="xs" 
              href="#" 
              c="dimmed"
              style={{ textDecoration: 'none', fontSize: '11px' }}
            >
              {t('footer.conditions')}
            </Anchor>
            <Anchor 
              size="xs" 
              href="#" 
              c="dimmed"
              style={{ textDecoration: 'none', fontSize: '11px' }}
            >
              {t('footer.privacy')}
            </Anchor>
          </Group>
        </Group>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer

