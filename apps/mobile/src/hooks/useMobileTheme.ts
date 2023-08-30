import { theme } from '~/helpers/theme'
import { useMobilePersistStore } from '~/store/persist'

export const useMobileTheme = () => {
  const currentTheme = useMobilePersistStore((state) => state.theme)
  const setTheme = useMobilePersistStore((state) => state.setTheme)

  const toggleTheme = (t: keyof typeof theme) => {
    setTheme(t)
  }

  return { toggleTheme, themeConfig: theme[currentTheme], currentTheme }
}
