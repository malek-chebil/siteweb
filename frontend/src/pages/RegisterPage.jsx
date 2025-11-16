import { useState } from 'react'
import { Container, Paper, TextInput, PasswordInput, Button, Stack, Title, Text, Anchor, Divider } from '@mantine/core'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { showNotification } from '@mantine/notifications'
import { useAuth } from '../context/AuthContext'
import { IconBrandGoogle } from '@tabler/icons-react'

const RegisterPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { signUp, signInWithGoogle } = useAuth()
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      showNotification({
        title: t('error'),
        message: 'Passwords do not match',
        color: 'red',
      })
      return
    }

    if (!username || username.length < 3) {
      showNotification({
        title: t('error'),
        message: 'Username must be at least 3 characters',
        color: 'red',
      })
      return
    }

    setLoading(true)

    try {
      await signUp(email, password, username)
      showNotification({
        title: t('success'),
        message: 'Registration successful! Please check your email to verify your account.',
        color: 'green',
      })
      navigate('/login')
    } catch (error) {
      showNotification({
        title: t('error'),
        message: error.message || 'Registration failed',
        color: 'red',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    try {
      await signInWithGoogle()
      // Note: User will be redirected to Google, then back to /auth/callback
    } catch (error) {
      showNotification({
        title: t('error'),
        message: error.message || 'Google sign in failed',
        color: 'red',
      })
      setGoogleLoading(false)
    }
  }

  return (
    <Container size={420} my={60}>
      <Stack gap="md" align="center" className="fade-in">
        <Title 
          ta="center" 
          order={1} 
          fw={700}
          style={{
            background: 'linear-gradient(135deg, #FFC300 0%, #ffb300 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontSize: 'clamp(2rem, 5vw, 2.5rem)',
          }}
        >
          {t('auth.register')}
        </Title>
        <Text c="dimmed" size="sm" ta="center">
          {t('auth.alreadyHaveAccount')}{' '}
          <Anchor size="sm" component={Link} to="/login" c="yellow.6" fw={500}>
            {t('auth.login')}
          </Anchor>
        </Text>

        <Paper 
          withBorder 
          shadow="lg" 
          p={40} 
          radius="lg"
          style={{
            width: '100%',
            backgroundColor: '#faf8f3',
            border: '1px solid #e9ecef',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          }}
        >
          <form onSubmit={handleSubmit}>
            <Stack gap="lg">
              <Button
                type="button"
                fullWidth
                variant="outline"
                color="gray"
                size="md"
                radius="md"
                leftSection={<IconBrandGoogle size={18} />}
                onClick={handleGoogleSignIn}
                loading={googleLoading}
                style={{
                  borderColor: '#e0e0e0',
                  color: '#333',
                }}
              >
                {t('auth.continueWithGoogle')}
              </Button>

              <Divider label={t('auth.or')} labelPosition="center" />

              <TextInput
                label={t('auth.email')}
                placeholder={t('auth.email')}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                size="md"
                radius="md"
              />
              <TextInput
                label={t('auth.username')}
                placeholder={t('auth.username')}
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                minLength={3}
                maxLength={50}
                size="md"
                radius="md"
              />
              <PasswordInput
                label={t('auth.password')}
                placeholder={t('auth.password')}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                size="md"
                radius="md"
              />
              <PasswordInput
                label={t('auth.confirmPassword')}
                placeholder={t('auth.confirmPassword')}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                size="md"
                radius="md"
              />
              <Button 
                type="submit" 
                fullWidth 
                mt="md" 
                loading={loading}
                color="yellow"
                size="md"
                radius="md"
                style={{
                  background: 'linear-gradient(135deg, #FFC300 0%, #ffb300 100%)',
                  border: 'none',
                  fontWeight: 600,
                }}
              >
                {t('auth.register')}
              </Button>
            </Stack>
          </form>
        </Paper>
      </Stack>
    </Container>
  )
}

export default RegisterPage

