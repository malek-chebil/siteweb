import { Outlet } from 'react-router-dom'
import { AppShell, Group, Button, Text, ActionIcon, Tooltip, Burger, Drawer, Stack, Box, useMantineTheme } from '@mantine/core'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '../components/LanguageSwitcher'
import { useIsAdmin } from '../hooks/useIsAdmin'
import Footer from '../components/Footer'
import { 
  IconHome, 
  IconPlus, 
  IconList, 
  IconLogout, 
  IconLogin, 
  IconUserPlus,
  IconSettings,
  IconHeart,
  IconUserCircle
} from '@tabler/icons-react'

export const Layout = () => {
  const { isAuthenticated, signOut } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { isAdmin } = useIsAdmin()
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false)
  const theme = useMantineTheme()
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`)

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/')
      closeDrawer()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleNavigate = (path) => {
    navigate(path)
    closeDrawer()
  }

  // Mobile menu items
  const mobileMenuItems = (
    <Stack gap="md" p="md">
      <Button 
        fullWidth
        color="yellow"
        onClick={() => {
          if (isAuthenticated) {
            handleNavigate('/listing/new')
          } else {
            handleNavigate('/register')
          }
        }}
        leftSection={<IconPlus size={18} />}
        style={{
          background: 'linear-gradient(135deg, #FFC300 0%, #ffb300 100%)',
          border: 'none',
        }}
      >
        {t('listing.addListing')}
      </Button>

      {isAuthenticated ? (
        <>
          {isAdmin && (
            <Button 
              fullWidth
              variant="light" 
              onClick={() => handleNavigate('/admin')}
              color="orange"
              leftSection={<IconSettings size={18} />}
            >
              {t('admin.adminPanel')}
            </Button>
          )}
          <Button 
            fullWidth
            variant="light" 
            onClick={() => handleNavigate('/my-listings')}
            leftSection={<IconList size={18} />}
          >
            {t('listing.myListings')}
          </Button>
          <Button 
            fullWidth
            variant="light" 
            onClick={() => handleNavigate('/favorites')}
            color="red"
            leftSection={<IconHeart size={18} />}
          >
            {t('listing.favorites')}
          </Button>
            <Button 
              fullWidth
              variant="light" 
              onClick={() => handleNavigate('/profile')}
              color="blue"
              leftSection={<IconUserCircle size={18} />}
            >
              {t('profile.myProfile')}
            </Button>
          <Box p="xs">
            <LanguageSwitcher />
          </Box>
          <Button 
            fullWidth
            variant="light" 
            onClick={handleLogout}
            color="red"
            leftSection={<IconLogout size={18} />}
          >
            {t('auth.logout')}
          </Button>
        </>
      ) : (
        <>
          <Box p="xs">
            <LanguageSwitcher />
          </Box>
          <Button 
            fullWidth
            variant="light" 
            onClick={() => handleNavigate('/login')}
            leftSection={<IconLogin size={18} />}
          >
            {t('auth.login')}
          </Button>
          <Button 
            fullWidth
            variant="filled"
            onClick={() => handleNavigate('/register')}
            leftSection={<IconUserPlus size={18} />}
          >
            {t('auth.register')}
          </Button>
        </>
      )}
    </Stack>
  )

  // Desktop menu items
  const desktopMenuItems = (
    <Group gap="xs">
      <Button 
        color="yellow"
        onClick={() => {
          if (isAuthenticated) {
            navigate('/listing/new')
          } else {
            navigate('/register')
          }
        }}
        size="sm"
        leftSection={<IconPlus size={18} />}
        visibleFrom="sm"
        style={{
          background: 'linear-gradient(135deg, #FFC300 0%, #ffb300 100%)',
          border: 'none',
        }}
      >
        {t('listing.addListing')}
      </Button>

      {isAuthenticated ? (
        <>
          {isAdmin && (
            <Tooltip label={t('admin.adminPanel')} withArrow>
              <Button 
                variant="subtle" 
                onClick={() => navigate('/admin')}
                size="sm"
                color="orange"
                leftSection={<IconSettings size={18} />}
                visibleFrom="sm"
              >
                {t('admin.adminPanel')}
              </Button>
            </Tooltip>
          )}
          <Tooltip label={t('listing.myListings')} withArrow>
            <Button 
              variant="subtle" 
              onClick={() => navigate('/my-listings')}
              size="sm"
              leftSection={<IconList size={18} />}
              visibleFrom="sm"
            >
              {t('listing.myListings')}
            </Button>
          </Tooltip>
          <Tooltip label={t('listing.favorites')} withArrow>
            <ActionIcon
              variant="light"
              color="red"
              size="lg"
              onClick={() => navigate('/favorites')}
              visibleFrom="sm"
            >
              <IconHeart size={20} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={t('profile.myProfile')} withArrow>
            <ActionIcon
              variant="light"
              color="blue"
              size="lg"
              onClick={() => navigate('/profile')}
              visibleFrom="sm"
            >
              <IconUserCircle size={20} />
            </ActionIcon>
          </Tooltip>
          <Box visibleFrom="sm">
            <LanguageSwitcher />
          </Box>
          <Tooltip label={t('auth.logout')} withArrow>
            <Button 
              variant="subtle" 
              onClick={handleLogout}
              size="sm"
              leftSection={<IconLogout size={18} />}
              visibleFrom="sm"
            >
              {t('auth.logout')}
            </Button>
          </Tooltip>
        </>
      ) : (
        <>
          <Box visibleFrom="sm">
            <LanguageSwitcher />
          </Box>
          <Button 
            variant="subtle" 
            onClick={() => navigate('/login')}
            size="sm"
            leftSection={<IconLogin size={18} />}
            visibleFrom="sm"
          >
            {t('auth.login')}
          </Button>
          <Button 
            variant="subtle"
            onClick={() => navigate('/register')}
            size="sm"
            leftSection={<IconUserPlus size={18} />}
            visibleFrom="sm"
          >
            {t('auth.register')}
          </Button>
        </>
      )}
    </Group>
  )

  return (
    <Box style={{ width: '100%', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppShell
        padding={0}
        header={{ height: { base: 60, sm: 80 } }}
        style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
      >
        <AppShell.Header
          p={0}
          style={{
            backgroundColor: 'rgba(250, 248, 243, 0.95)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(233, 236, 239, 0.5)',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
            paddingLeft: '4px',
            paddingRight: '4px',
            paddingTop: '8px',
            paddingBottom: '8px',
          }}
        >
          <Group justify="space-between" style={{ height: '100%', width: '100%' }}>
            <Group gap={{ base: 'xs', sm: 'md' }}>
              <Burger
                opened={drawerOpened}
                onClick={toggleDrawer}
                hiddenFrom="sm"
                size="sm"
              />
              <ActionIcon
                variant="subtle"
                color="yellow"
                size={isMobile ? "md" : "lg"}
                onClick={() => navigate('/')}
                style={{ cursor: 'pointer' }}
              >
                <IconHome size={isMobile ? 20 : 24} />
              </ActionIcon>
              <Text
                size="xl"
                fw={700}
                hiddenFrom="sm"
                style={{ 
                  cursor: 'pointer',
                  letterSpacing: '-0.5px',
                  background: 'linear-gradient(135deg, #FFC300 0%, #ffb300 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontSize: '1rem',
                }}
                onClick={() => navigate('/')}
              >
                {t('home.title')}
              </Text>
              <Text
                size="xl"
                fw={700}
                visibleFrom="sm"
                style={{ 
                  cursor: 'pointer',
                  letterSpacing: '-0.5px',
                  background: 'linear-gradient(135deg, #FFC300 0%, #ffb300 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
                onClick={() => navigate('/')}
              >
                {t('home.title')}
              </Text>
            </Group>
            {desktopMenuItems}
          </Group>
        </AppShell.Header>

        <Drawer
          opened={drawerOpened}
          onClose={closeDrawer}
          title={t('home.title')}
          padding="md"
          size="xs"
          zIndex={1000000}
        >
          {mobileMenuItems}
        </Drawer>

        <AppShell.Main
          style={{
            backgroundColor: 'transparent',
            minHeight: 'calc(100vh - 80px)',
            display: 'flex',
            flexDirection: 'column',
            padding: 0,
            paddingTop: 0,
            paddingBottom: '24px',
            flex: 1,
          }}
        >
          <div style={{ flex: 1, width: '100%' }}>
            <Outlet />
          </div>
        </AppShell.Main>
      </AppShell>
      <Footer />
    </Box>
  )
}
