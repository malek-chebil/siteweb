import { Container, Title, SimpleGrid, Paper, Text, Stack, Group, Badge, Divider, Box, Tabs } from '@mantine/core'
import { AreaChart, LineChart } from '@mantine/charts'
import { useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { IconUsers, IconListCheck, IconCheck, IconX, IconHourglass, IconEye, IconTrendingUp, IconChartBar } from '@tabler/icons-react'

const AdminDashboard = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { data: stats, isLoading } = useQuery(
    'admin-stats',
    async () => {
      const response = await api.get('/admin/stats')
      return response.data
    }
  )

  const { data: chartsData, isLoading: chartsLoading } = useQuery(
    'admin-charts',
    async () => {
      const response = await api.get('/admin/stats/charts?days=30')
      return response.data
    }
  )

  if (isLoading) {
    return (
      <Container>
        <Text>{t('common.loading')}</Text>
      </Container>
    )
  }

  return (
    <Container size="xl" fluid style={{ maxWidth: '95%', padding: '0 2rem' }}>
      <Stack gap="xl">
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
          {t('admin.dashboard')}
        </Title>

        <SimpleGrid 
          cols={{ base: 1, sm: 2, lg: 5 }} 
          spacing="xl"
          mb="xl"
        >
          <Paper 
            p="xl" 
            radius="lg" 
            withBorder
            style={{
              background: 'linear-gradient(135deg, rgba(255, 195, 0, 0.15) 0%, rgba(255, 179, 0, 0.08) 100%)',
              border: '2px solid rgba(255, 195, 0, 0.3)',
              boxShadow: '0 4px 20px rgba(255, 195, 0, 0.15)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
            }}
            className="fade-in"
            onClick={() => navigate('/admin/moderation?status=pending')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)'
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(255, 195, 0, 0.25)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)'
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(255, 195, 0, 0.15)'
            }}
          >
            <Group gap="md" mb="md" justify="space-between">
              <Box
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(255, 195, 0, 0.2) 0%, rgba(255, 179, 0, 0.15) 100%)',
                  boxShadow: '0 4px 12px rgba(255, 195, 0, 0.2)',
                }}
              >
                <IconListCheck size={28} style={{ color: '#FFC300' }} />
              </Box>
            </Group>
            <Text size="sm" c="dimmed" fw={600} mb="xs" tt="uppercase" style={{ letterSpacing: '0.5px' }}>
              {t('admin.pendingListings')}
            </Text>
            <Text size="3rem" fw={800} c="yellow.6" lh={1} style={{
              background: 'linear-gradient(135deg, #FFC300 0%, #ffb300 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              {stats?.pending_listings || 0}
            </Text>
          </Paper>

          <Paper 
            p="xl" 
            radius="lg" 
            withBorder
            style={{
              background: 'linear-gradient(135deg, rgba(81, 207, 102, 0.15) 0%, rgba(64, 192, 87, 0.08) 100%)',
              border: '2px solid rgba(81, 207, 102, 0.3)',
              boxShadow: '0 4px 20px rgba(81, 207, 102, 0.15)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
            }}
            className="fade-in"
            onClick={() => navigate('/admin/moderation?status=approved')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)'
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(81, 207, 102, 0.25)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)'
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(81, 207, 102, 0.15)'
            }}
          >
            <Group gap="md" mb="md" justify="space-between">
              <Box
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(81, 207, 102, 0.2) 0%, rgba(64, 192, 87, 0.15) 100%)',
                  boxShadow: '0 4px 12px rgba(81, 207, 102, 0.2)',
                }}
              >
                <IconCheck size={28} style={{ color: '#51cf66' }} />
              </Box>
            </Group>
            <Text size="sm" c="dimmed" fw={600} mb="xs" tt="uppercase" style={{ letterSpacing: '0.5px' }}>
              {t('admin.approvedListings')}
            </Text>
            <Text size="3rem" fw={800} c="green.6" lh={1} style={{
              background: 'linear-gradient(135deg, #51cf66 0%, #40c057 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              {stats?.approved_listings || 0}
            </Text>
          </Paper>

          <Paper 
            p="xl" 
            radius="lg" 
            withBorder
            style={{
              background: 'linear-gradient(135deg, rgba(250, 82, 82, 0.15) 0%, rgba(230, 73, 73, 0.08) 100%)',
              border: '2px solid rgba(250, 82, 82, 0.3)',
              boxShadow: '0 4px 20px rgba(250, 82, 82, 0.15)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
            }}
            className="fade-in"
            onClick={() => navigate('/admin/moderation?status=rejected')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)'
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(250, 82, 82, 0.25)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)'
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(250, 82, 82, 0.15)'
            }}
          >
            <Group gap="md" mb="md" justify="space-between">
              <Box
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(250, 82, 82, 0.2) 0%, rgba(230, 73, 73, 0.15) 100%)',
                  boxShadow: '0 4px 12px rgba(250, 82, 82, 0.2)',
                }}
              >
                <IconX size={28} style={{ color: '#fa5252' }} />
              </Box>
            </Group>
            <Text size="sm" c="dimmed" fw={600} mb="xs" tt="uppercase" style={{ letterSpacing: '0.5px' }}>
              {t('admin.rejectedListings')}
            </Text>
            <Text size="3rem" fw={800} c="red.6" lh={1} style={{
              background: 'linear-gradient(135deg, #fa5252 0%, #e64949 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              {stats?.rejected_listings || 0}
            </Text>
          </Paper>

          <Paper 
            p="xl" 
            radius="lg" 
            withBorder
            style={{
              background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.15) 0%, rgba(245, 124, 0, 0.08) 100%)',
              border: '2px solid rgba(255, 152, 0, 0.3)',
              boxShadow: '0 4px 20px rgba(255, 152, 0, 0.15)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
            }}
            className="fade-in"
            onClick={() => navigate('/admin/moderation?status=expired')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)'
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(255, 152, 0, 0.25)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)'
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(255, 152, 0, 0.15)'
            }}
          >
            <Group gap="md" mb="md" justify="space-between">
              <Box
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.2) 0%, rgba(245, 124, 0, 0.15) 100%)',
                  boxShadow: '0 4px 12px rgba(255, 152, 0, 0.2)',
                }}
              >
                <IconHourglass size={28} style={{ color: '#ff9800' }} />
              </Box>
            </Group>
            <Text size="sm" c="dimmed" fw={600} mb="xs" tt="uppercase" style={{ letterSpacing: '0.5px' }}>
              Annonces expirées
            </Text>
            <Text size="3rem" fw={800} c="orange.6" lh={1} style={{
              background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              {stats?.expired_listings || 0}
            </Text>
          </Paper>

          <Paper 
            p="xl" 
            radius="lg" 
            withBorder
            style={{
              background: 'linear-gradient(135deg, rgba(74, 144, 226, 0.15) 0%, rgba(37, 99, 235, 0.08) 100%)',
              border: '2px solid rgba(74, 144, 226, 0.3)',
              boxShadow: '0 4px 20px rgba(74, 144, 226, 0.15)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
            }}
            className="fade-in"
            onClick={() => navigate('/admin/users')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)'
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(74, 144, 226, 0.25)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)'
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(74, 144, 226, 0.15)'
            }}
          >
            <Group gap="md" mb="md" justify="space-between">
              <Box
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(74, 144, 226, 0.2) 0%, rgba(37, 99, 235, 0.15) 100%)',
                  boxShadow: '0 4px 12px rgba(74, 144, 226, 0.2)',
                }}
              >
                <IconUsers size={28} style={{ color: '#4a90e2' }} />
              </Box>
            </Group>
            <Text size="sm" c="dimmed" fw={600} mb="xs" tt="uppercase" style={{ letterSpacing: '0.5px' }}>
              {t('admin.users')}
            </Text>
            <Text size="3rem" fw={800} c="blue.6" lh={1} style={{
              background: 'linear-gradient(135deg, #4a90e2 0%, #2563eb 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              {stats?.total_users || 0}
            </Text>
          </Paper>
        </SimpleGrid>

        {/* Statistics Section */}
        <Paper 
          p="xl" 
          radius="lg" 
          withBorder
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
          }}
        >
          <Stack gap="lg">
            <Group gap="md" align="center">
              <IconChartBar size={32} style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 2px 4px rgba(102, 126, 234, 0.3))',
              }} />
              <Title order={2} size="h3" style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Statistiques de Visites
              </Title>
            </Group>
            
            <Divider />
            
            <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="xl">
              <Paper 
                p="xl" 
                radius="lg" 
                withBorder
                style={{
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(79, 70, 229, 0.08) 100%)',
                  border: '2px solid rgba(99, 102, 241, 0.3)',
                  boxShadow: '0 4px 20px rgba(99, 102, 241, 0.15)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                className="fade-in"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)'
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(99, 102, 241, 0.25)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)'
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(99, 102, 241, 0.15)'
                }}
              >
                <Group gap="md" mb="md" justify="space-between">
                  <Box
                    style={{
                      padding: '12px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(79, 70, 229, 0.15) 100%)',
                      boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
                    }}
                  >
                    <IconEye size={28} style={{ color: '#6366f1' }} />
                  </Box>
                </Group>
                <Text size="sm" c="dimmed" fw={600} mb="xs" tt="uppercase" style={{ letterSpacing: '0.5px' }}>
                  Total des Vues
                </Text>
                <Text size="3rem" fw={800} c="indigo.6" lh={1} style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  {stats?.total_views?.toLocaleString() || 0}
                </Text>
                <Text size="xs" c="dimmed" mt="sm" fw={500}>
                  Toutes les annonces
                </Text>
              </Paper>

              <Paper 
                p="xl" 
                radius="lg" 
                withBorder
                style={{
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(124, 58, 237, 0.08) 100%)',
                  border: '2px solid rgba(139, 92, 246, 0.3)',
                  boxShadow: '0 4px 20px rgba(139, 92, 246, 0.15)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                className="fade-in"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)'
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(139, 92, 246, 0.25)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)'
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(139, 92, 246, 0.15)'
                }}
              >
                <Group gap="md" mb="md" justify="space-between">
                  <Box
                    style={{
                      padding: '12px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(124, 58, 237, 0.15) 100%)',
                      boxShadow: '0 4px 12px rgba(139, 92, 246, 0.2)',
                    }}
                  >
                    <IconChartBar size={28} style={{ color: '#8b5cf6' }} />
                  </Box>
                </Group>
                <Text size="sm" c="dimmed" fw={600} mb="xs" tt="uppercase" style={{ letterSpacing: '0.5px' }}>
                  Vues Moyennes
                </Text>
                <Text size="3rem" fw={800} c="violet.6" lh={1} style={{
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  {stats?.avg_views ? Math.round(stats.avg_views) : 0}
                </Text>
                <Text size="xs" c="dimmed" mt="sm" fw={500}>
                  Par annonce
                </Text>
              </Paper>

              <Paper 
                p="xl" 
                radius="lg" 
                withBorder
                style={{
                  background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(219, 39, 119, 0.08) 100%)',
                  border: '2px solid rgba(236, 72, 153, 0.3)',
                  boxShadow: '0 4px 20px rgba(236, 72, 153, 0.15)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                className="fade-in"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)'
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(236, 72, 153, 0.25)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)'
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(236, 72, 153, 0.15)'
                }}
              >
                <Group gap="md" mb="md" justify="space-between">
                  <Box
                    style={{
                      padding: '12px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(219, 39, 119, 0.15) 100%)',
                      boxShadow: '0 4px 12px rgba(236, 72, 153, 0.2)',
                    }}
                  >
                    <IconTrendingUp size={28} style={{ color: '#ec4899' }} />
                  </Box>
                </Group>
                <Text size="sm" c="dimmed" fw={600} mb="xs" tt="uppercase" style={{ letterSpacing: '0.5px' }}>
                  Annonce la Plus Vue
                </Text>
                {stats?.most_viewed_listing ? (
                  <Stack gap={6}>
                    <Text size="md" fw={700} c="pink.6" lineClamp={2} title={stats.most_viewed_listing.title} style={{
                      background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}>
                      {stats.most_viewed_listing.title}
                    </Text>
                    <Text size="xs" c="dimmed" fw={500}>
                      Par: <Text component="span" fw={600} c="pink.6">{stats.most_viewed_listing.username || stats.most_viewed_listing.user_email || 'Utilisateur'}</Text>
                    </Text>
                    <Badge 
                      color="pink" 
                      variant="light" 
                      size="sm" 
                      mt={4}
                      style={{
                        width: 'fit-content',
                        boxShadow: '0 2px 8px rgba(236, 72, 153, 0.2)',
                      }}
                    >
                      {stats.most_viewed_listing.views_count?.toLocaleString() || 0} vues
                    </Badge>
                  </Stack>
                ) : (
                  <Text size="lg" c="dimmed" fw={500}>
                    Aucune donnée
                  </Text>
                )}
              </Paper>

              <Paper 
                p="xl" 
                radius="lg" 
                withBorder
                style={{
                  background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(2, 132, 199, 0.08) 100%)',
                  border: '2px solid rgba(14, 165, 233, 0.3)',
                  boxShadow: '0 4px 20px rgba(14, 165, 233, 0.15)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                className="fade-in"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)'
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(14, 165, 233, 0.25)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)'
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(14, 165, 233, 0.15)'
                }}
              >
                <Group gap="md" mb="md" justify="space-between">
                  <Box
                    style={{
                      padding: '12px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.2) 0%, rgba(2, 132, 199, 0.15) 100%)',
                      boxShadow: '0 4px 12px rgba(14, 165, 233, 0.2)',
                    }}
                  >
                    <IconListCheck size={28} style={{ color: '#0ea5e9' }} />
                  </Box>
                </Group>
                <Text size="sm" c="dimmed" fw={600} mb="xs" tt="uppercase" style={{ letterSpacing: '0.5px' }}>
                  Total Annonces
                </Text>
                <Text size="3rem" fw={800} c="sky.6" lh={1} style={{
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  {stats?.total_listings || 0}
                </Text>
                <Text size="xs" c="dimmed" mt="sm" fw={500}>
                  Tous statuts confondus
                </Text>
              </Paper>
            </SimpleGrid>

            {/* Charts Section */}
            <Paper 
              p="xl" 
              radius="lg" 
              withBorder
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
                marginTop: '2rem',
              }}
            >
              <Stack gap="lg">
                <Group gap="md" align="center">
                  <IconChartBar size={32} style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 2px 4px rgba(102, 126, 234, 0.3))',
                  }} />
                  <Title order={2} size="h3" style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>
                    Graphiques d'Évolution
                  </Title>
                </Group>
                
                <Divider />
                
                <Tabs defaultValue="views">
                  <Tabs.List>
                    <Tabs.Tab value="views" leftSection={<IconEye size={18} />}>
                      Total des Vues
                    </Tabs.Tab>
                    <Tabs.Tab value="listings" leftSection={<IconListCheck size={18} />}>
                      Nombre d'Annonces
                    </Tabs.Tab>
                  </Tabs.List>

                  <Tabs.Panel value="views" pt="xl">
                    {chartsLoading ? (
                      <Text c="dimmed" ta="center" py="xl">Chargement des données...</Text>
                    ) : chartsData?.views_over_time?.length > 0 ? (
                      <AreaChart
                        h={400}
                        data={chartsData.views_over_time}
                        dataKey="date"
                        series={[
                          {
                            name: 'views',
                            label: 'Vues',
                            color: 'indigo.6',
                          },
                        ]}
                        curveType="natural"
                        withGradient
                        withLegend
                        withTooltip
                        withDots={false}
                        tickLine="xy"
                        gridAxis="xy"
                        xAxisProps={{
                          tickFormatter: (value) => {
                            const date = new Date(value)
                            return `${date.getDate()}/${date.getMonth() + 1}`
                          },
                        }}
                        tooltipProps={{
                          content: ({ label, payload }) => {
                            if (!payload || payload.length === 0) return null
                            const date = new Date(label)
                            return (
                              <Paper p="sm" withBorder>
                                <Text size="sm" fw={600} mb={4}>
                                  {date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </Text>
                                <Text size="sm" c="indigo.6">
                                  {payload[0].value?.toLocaleString() || 0} vues
                                </Text>
                              </Paper>
                            )
                          },
                        }}
                      />
                    ) : (
                      <Text c="dimmed" ta="center" py="xl">Aucune donnée disponible</Text>
                    )}
                  </Tabs.Panel>

                  <Tabs.Panel value="listings" pt="xl">
                    {chartsLoading ? (
                      <Text c="dimmed" ta="center" py="xl">Chargement des données...</Text>
                    ) : chartsData?.listings_over_time?.length > 0 ? (
                      <LineChart
                        h={400}
                        data={chartsData.listings_over_time}
                        dataKey="date"
                        series={[
                          {
                            name: 'count',
                            label: 'Annonces',
                            color: 'violet.6',
                          },
                        ]}
                        curveType="natural"
                        withLegend
                        withTooltip
                        withDots
                        withActiveDots
                        strokeWidth={2}
                        tickLine="xy"
                        gridAxis="xy"
                        xAxisProps={{
                          tickFormatter: (value) => {
                            const date = new Date(value)
                            return `${date.getDate()}/${date.getMonth() + 1}`
                          },
                        }}
                        tooltipProps={{
                          content: ({ label, payload }) => {
                            if (!payload || payload.length === 0) return null
                            const date = new Date(label)
                            return (
                              <Paper p="sm" withBorder>
                                <Text size="sm" fw={600} mb={4}>
                                  {date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </Text>
                                <Text size="sm" c="violet.6">
                                  {payload[0].value || 0} annonces
                                </Text>
                              </Paper>
                            )
                          },
                        }}
                      />
                    ) : (
                      <Text c="dimmed" ta="center" py="xl">Aucune donnée disponible</Text>
                    )}
                  </Tabs.Panel>
                </Tabs>
              </Stack>
            </Paper>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  )
}

export default AdminDashboard

