import React from 'react'
import { Container, Title, Text, Button, Stack } from '@mantine/core'
import { IconAlertTriangle } from '@tabler/icons-react'
import i18n from '../i18n'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({
      error,
      errorInfo,
    })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container size="md" py="xl">
          <Stack align="center" gap="lg">
            <IconAlertTriangle size={64} color="red" />
            <Title order={1} c="red">
              Oups! Une erreur est survenue
            </Title>
            <Text c="dimmed" ta="center">
              Désolé, quelque chose s'est mal passé. Veuillez réessayer.
            </Text>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Stack gap="xs" style={{ width: '100%' }}>
                <Text size="sm" fw={600}>Error:</Text>
                <Text size="sm" c="red" style={{ fontFamily: 'monospace' }}>
                  {this.state.error.toString()}
                </Text>
                {this.state.errorInfo && (
                  <>
                    <Text size="sm" fw={600} mt="md">Stack trace:</Text>
                    <Text size="xs" c="dimmed" style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                      {this.state.errorInfo.componentStack}
                    </Text>
                  </>
                )}
              </Stack>
            )}
            <Button onClick={this.handleReset} size="lg">
              {i18n.t('common.backToHome')}
            </Button>
          </Stack>
        </Container>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
