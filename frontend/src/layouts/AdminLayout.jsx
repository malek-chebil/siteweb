import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { AppShell, Group, Text, Button, NavLink, Stack, Divider, Badge, Burger, Drawer } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '../components/LanguageSwitcher'
import { 
  IconDashboard, 
  IconClock, 
  IconCheck, 
  IconX, 
  IconUsers, 
  IconHome,
  IconLogout,
  IconHourglass
} from '@tabler/icons-react'

export const AdminLayout = () => {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false)

  const handleLogout = async () => {
    await signOut()
    navigate('/')
    closeDrawer()
  }

  const handleNavigate = (path) => {
    navigate(path)
    closeDrawer()
  }

  const isActive = (path, query) => {
    if (path === '/admin') {
      return location.pathname === '/admin'
    }
    if (location.pathname.startsWith(path)) {
      if (query) {
        // Check if the query parameter matches
        const urlParams = new URLSearchParams(location.search)
        const statusParam = urlParams.get('status')
        const expectedStatus = query.split('status=')[1]
        return statusParam === expectedStatus
      }
      return true
    }
    return false
  }

  const navItems = [
    {
      label: t('admin.dashboard'),
      icon: IconDashboard,
      path: '/admin',
      color: 'blue'
    },
    {
      label: t('admin.pendingListings'),
      icon: IconClock,
      path: '/admin/moderation',
      color: 'yellow',
      query: '?status=pending'
    },
    {
      label: t('admin.approvedListings'),
      icon: IconCheck,
      path: '/admin/moderation',
      color: 'green',
      query: '?status=approved'
    },
    {
      label: t('admin.rejectedListings'),
      icon: IconX,
      path: '/admin/moderation',
      color: 'red',
      query: '?status=rejected'
    },
    {
      label: 'Annonces expirées',
      icon: IconHourglass,
      path: '/admin/moderation',
      color: 'orange',
      query: '?status=expired'
    },
    {
      label: t('admin.users'),
      icon: IconUsers,
      path: '/admin/users',
      color: 'violet'
    },
  ]

  // Navigation menu items
  const navMenuItems = (
    <Stack gap={4}>
      <Text 
        size="lg" 
        fw={700} 
        c="yellow.6" 
        mb="md"
        style={{
          background: 'linear-gradient(135deg, #FFC300 0%, #ffb300 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {t('admin.dashboard')}
      </Text>
      {navItems.map((item) => {
        const Icon = item.icon
        const active = isActive(item.path, item.query)
        const fullPath = item.query ? `${item.path}${item.query}` : item.path
        
        return (
          <NavLink
            key={item.path + (item.query || '')}
            label={item.label}
            leftSection={<Icon size={18} />}
            active={active}
            onClick={() => handleNavigate(fullPath)}
            style={{
              borderRadius: '8px',
              transition: 'all 0.2s ease',
              fontWeight: active ? 600 : 400,
            }}
            styles={{
              root: {
                '&[data-active]': {
                  backgroundColor: `var(--mantine-color-${item.color}-1)`,
                  color: `var(--mantine-color-${item.color}-7)`,
                  borderLeft: `3px solid var(--mantine-color-${item.color}-6)`,
                },
                '&:hover': {
                  backgroundColor: `var(--mantine-color-${item.color}-0)`,
                  transform: 'translateX(4px)',
                }
              }
            }}
          />
        )
      })}
    </Stack>
  )

  // Footer menu items
  const footerMenuItems = (
    <Stack gap="sm">
      <Button 
        fullWidth 
        variant="light" 
        onClick={() => handleNavigate('/')}
        leftSection={<IconHome size={18} />}
        style={{
          borderRadius: '8px',
        }}
            >
              {t('admin.viewSite')}
            </Button>
      <Button 
        fullWidth 
        variant="subtle" 
        onClick={handleLogout}
        leftSection={<IconLogout size={18} />}
        color="red"
        style={{
          borderRadius: '8px',
        }}
      >
        {t('auth.logout')}
      </Button>
    </Stack>
  )

  return (
    <>
      <AppShell
        padding={{ base: 'xs', sm: 'md' }}
        navbar={{ width: 280, breakpoint: 'sm' }}
        header={{ height: { base: 60, sm: 70 } }}
      >
        <AppShell.Navbar 
          p="md" 
          visibleFrom="sm"
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderRight: '1px solid rgba(233, 236, 239, 0.5)'
          }}
        >
          <AppShell.Section>
            {navMenuItems}
          </AppShell.Section>
          <Divider my="md" />
          <AppShell.Section mt="auto">
            {footerMenuItems}
          </AppShell.Section>
        </AppShell.Navbar>

        <AppShell.Header 
        p={{ base: 'xs', sm: 'md' }}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(233, 236, 239, 0.5)',
        }}
      >
          <Group justify="space-between" style={{ height: '100%' }}>
            <Group gap="md">
              <Burger
                opened={drawerOpened}
                onClick={toggleDrawer}
                hiddenFrom="sm"
                size="sm"
              />
            <Text 
              size="xl"
              fw={700}
              hiddenFrom="sm"
              style={{
                background: 'linear-gradient(135deg, #FFC300 0%, #ffb300 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '1rem',
              }}
            >
              {t('admin.dashboard')}
            </Text>
            <Text 
              size="xl"
              fw={700}
              visibleFrom="sm"
              style={{
                background: 'linear-gradient(135deg, #FFC300 0%, #ffb300 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {t('admin.dashboard')}
            </Text>
            </Group>
            <LanguageSwitcher />
          </Group>
        </AppShell.Header>

        <AppShell.Main style={{ backgroundColor: 'transparent' }}>
          <Outlet />
        </AppShell.Main>
      </AppShell>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        title={t('admin.dashboard')}
        padding="md"
        size="xs"
        zIndex={1000000}
        hiddenFrom="sm"
      >
        <Stack gap="md">
          {navMenuItems}
          <Divider />
          {footerMenuItems}
        </Stack>
      </Drawer>
    </>
  )
}
