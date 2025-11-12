import { Container, Group, Stack, Text, Button, Anchor, Box, SimpleGrid } from '@mantine/core'
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
        backgroundColor: 'rgba(248, 249, 250, 0.95)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(233, 236, 239, 0.5)',
        marginTop: 'auto',
      }}
    >
      <Container size="xl">
        <Stack gap={{ base: 'lg', sm: 'xl' }}>
          <Group align="flex-start" gap={{ base: 'md', sm: 'xl' }} wrap>
            {/* Logo Section */}
            <Box className="footer-logo-section">
              <Stack gap="sm" align="flex-start" className="footer-logo-stack">
                <img 
                  src="/assets/home5.jpg" 
                  alt="Carthage Wellness Spa" 
                  className="footer-logo"
                  style={{
                    width: '100%',
                    height: 'auto',
                    objectPosition: 'left center',
                  }}
                />
                <Text 
                  size="xs" 
                  c="dimmed" 
                  className="footer-description"
                  style={{ lineHeight: 1.5 }}
                >
                  {t('footer.description')}
                </Text>
              </Stack>
            </Box>

            {/* Content Section */}
            <Box className="footer-content-section">
              <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing={{ base: 'md', sm: 'lg' }}>
              {/* Popular Categories */}
              <Stack gap="sm">
                <Text fw={600} size="md" c="yellow.7">
                  {t('footer.popularCategories')}
                </Text>
                <Stack gap={4}>
                  {categories.slice(0, 5).map((category) => (
                    <Anchor
                      key={category}
                      onClick={() => handleCategoryClick(category)}
                      style={{
                        cursor: 'pointer',
                        color: '#495057',
                        textDecoration: 'none',
                        transition: 'color 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#FFC300'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#495057'
                      }}
                    >
                      {category}
                    </Anchor>
                  ))}
                </Stack>
              </Stack>

              {/* Popular Places */}
              <Stack gap="sm">
                <Text fw={600} size="md" c="yellow.7">
                  {t('footer.popularCities')}
                </Text>
                <SimpleGrid cols={2} spacing="xs" verticalSpacing={4}>
                  {popularCities.slice(0, 8).map((city) => (
                    <Anchor
                      key={city}
                      onClick={() => handleCityClick(city)}
                      style={{
                        cursor: 'pointer',
                        color: '#495057',
                        textDecoration: 'none',
                        transition: 'color 0.2s ease',
                        fontSize: '0.75rem',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#FFC300'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#495057'
                      }}
                    >
                      {city}
                    </Anchor>
                  ))}
                </SimpleGrid>
              </Stack>

              {/* Create Listing CTA */}
              <Stack gap="sm">
                <Text fw={600} size="md" c="yellow.7">
                  {t('footer.createListing')}
                </Text>
                <Box
                  p="sm"
                  style={{
                    backgroundColor: 'rgba(255, 195, 0, 0.08)',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 195, 0, 0.2)',
                  }}
                >
                  <Text size="xs" c="dimmed" mb="sm" style={{ lineHeight: 1.5 }}>
                    {t('footer.createListingDescription')}
                  </Text>
                  <Button
                    leftSection={<IconPlus size={16} />}
                    onClick={() => navigate(isAuthenticated ? '/listing/new' : '/login')}
                    size="xs"
                    style={{
                      background: 'linear-gradient(135deg, #FFC300 0%, #ffb300 100%)',
                      border: 'none',
                      fontWeight: 600,
                    }}
                    fullWidth
                  >
                    {isAuthenticated ? t('footer.createListingButton') : t('footer.loginButton')}
                  </Button>
                </Box>
              </Stack>
              </SimpleGrid>
            </Box>
          </Group>

          {/* Copyright */}
          <Box mt={{ base: 'md', sm: 'lg' }} pt={{ base: 'sm', sm: 'md' }} style={{ borderTop: '1px solid #e9ecef' }}>
            <Stack gap="xs" className="footer-copyright">
              <Text size="xs" c="dimmed" className="footer-copyright-text">
                {t('footer.copyright', { year: new Date().getFullYear() })}
              </Text>
              <Group justify="flex-end" gap="sm" wrap="wrap" className="footer-links">
                <Anchor size="xs" c="dimmed" href="#" style={{ textDecoration: 'none' }}>
                  {t('footer.conditions')}
                </Anchor>
                <Anchor size="xs" c="dimmed" href="#" style={{ textDecoration: 'none' }}>
                  {t('footer.privacy')}
                </Anchor>
              </Group>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}

export default Footer

