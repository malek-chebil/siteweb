import { Button, Group } from '@mantine/core'
import { useTranslation } from 'react-i18next'

const LanguageSwitcher = () => {
  const { i18n } = useTranslation()

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
    // Update document direction for RTL
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = lng
  }

  return (
    <Group spacing="xs">
      <Button
        variant={i18n.language === 'fr' ? 'filled' : 'subtle'}
        size="xs"
        onClick={() => changeLanguage('fr')}
      >
        FR
      </Button>
      <Button
        variant={i18n.language === 'ar' ? 'filled' : 'subtle'}
        size="xs"
        onClick={() => changeLanguage('ar')}
      >
        AR
      </Button>
    </Group>
  )
}

export default LanguageSwitcher

