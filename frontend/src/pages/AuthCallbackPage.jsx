import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Stack, Text, Loader } from '@mantine/core'
import { supabase } from '../lib/supabase.js'
import api from '../lib/api'

const AuthCallbackPage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from the URL hash
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
          navigate('/login?error=auth_failed')
          return
        }

        if (session?.user) {
          // Extract username from Google profile if available
          const fullName = session.user.user_metadata?.full_name || 
                          session.user.user_metadata?.name || 
                          session.user.email?.split('@')[0] || 
                          'User'
          
          const username = session.user.user_metadata?.preferred_username ||
                          session.user.user_metadata?.user_name ||
                          fullName.split(' ')[0] ||
                          session.user.email?.split('@')[0] ||
                          'User'

          // Update username in backend if user exists or create user
          try {
            await api.put('/users/me', { username }, {
              headers: {
                Authorization: `Bearer ${session.access_token}`,
              },
            })
          } catch (err) {
            // User might not exist yet, that's okay - it will be created on first API call
            console.log('User might not exist yet, will be created on first API call')
          }

          // Redirect to home page
          navigate('/')
        } else {
          navigate('/login?error=no_session')
        }
      } catch (error) {
        console.error('Error handling auth callback:', error)
        navigate('/login?error=auth_failed')
      }
    }

    handleAuthCallback()
  }, [navigate])

  return (
    <Container size="sm" style={{ paddingTop: '120px', paddingBottom: '48px' }}>
      <Stack align="center" gap="md">
        <Loader size="lg" />
        <Text size="lg" c="dimmed">
          Connexion en cours...
        </Text>
      </Stack>
    </Container>
  )
}

export default AuthCallbackPage


