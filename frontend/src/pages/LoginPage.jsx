import { useState } from 'react'
import { Container, Paper, TextInput, PasswordInput, Button, Stack, Title, Text, Anchor, Divider, Group, Alert } from '@mantine/core'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { showNotification } from '@mantine/notifications'
import { useAuth } from '../context/AuthContext'
import { IconBrandGoogle, IconAlertCircle } from '@tabler/icons-react'

const LoginPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { signIn, signInWithGoogle } = useAuth()
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailNotVerifiedError, setEmailNotVerifiedError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setEmailNotVerifiedError('') // Reset error message

    try {
      await signIn(email, password)
      showNotification({
        title: t('success'),
        message: t('auth.loginSuccess'),
        color: 'green',
      })
      navigate('/')
    } catch (error) {
      // Check if error is related to email not verified
      const errorMessage = error.message || ''
      const isEmailNotVerified = 
        errorMessage.toLowerCase().includes('email not confirmed') ||
        errorMessage.toLowerCase().includes('email not verified') ||
        errorMessage.toLowerCase().includes('email_not_confirmed') ||
        error.code === 'email_not_confirmed'
      
      if (isEmailNotVerified) {
        setEmailNotVerifiedError(t('auth.emailNotVerified') || 'Votre email n\'est pas vérifié. Veuillez vérifier votre boîte de réception.')
      }
      
      showNotification({
        title: t('error'),
        message: error.message || 'Login failed',
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
    <Container size={420} style={{ paddingTop: '120px', paddingBottom: '60px' }}>
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
          {t('auth.login')}
        </Title>
        <Text c="dimmed" size="sm" ta="center">
          {t('auth.noAccount')}{' '}
          <Anchor size="sm" component={Link} to="/register" c="yellow.6" fw={500}>
            {t('auth.register')}
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
              <PasswordInput
                label={t('auth.password')}
                placeholder={t('auth.password')}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                {t('auth.login')}
              </Button>
              
              {emailNotVerifiedError && (
                <Alert
                  icon={<IconAlertCircle size={16} />}
                  title={t('error')}
                  color="red"
                  radius="md"
                  mt="xs"
                >
                  {emailNotVerifiedError}
                </Alert>
              )}
            </Stack>
          </form>
        </Paper>
      </Stack>
    </Container>
  )
}

export default LoginPage

