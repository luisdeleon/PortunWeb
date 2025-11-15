import { useI18n } from 'vue-i18n'
import { onMounted, watch } from 'vue'

export function useAutoLanguageDetection() {
  const { locale } = useI18n()

  const detectBrowserLanguage = () => {
    // Get browser language
    const browserLang = navigator.language || (navigator as any).userLanguage

    // Extract the base language code (e.g., 'es' from 'es-MX', 'pt' from 'pt-BR')
    const baseLang = browserLang.split('-')[0].toLowerCase()

    // Map browser languages to our supported locales
    const languageMap: Record<string, string> = {
      'es': 'es', // Spanish (any variant)
      'pt': 'pt', // Portuguese (any variant)
      'en': 'en', // English (default)
    }

    // Check if we have a saved preference in localStorage
    const savedLang = localStorage.getItem('portun-language')
    if (savedLang && ['en', 'es', 'pt'].includes(savedLang)) {
      locale.value = savedLang
      console.log('Using saved language preference:', savedLang)
      return
    }

    // Check URL parameter (?lang=es, ?lang=pt, etc.)
    const urlParams = new URLSearchParams(window.location.search)
    const urlLang = urlParams.get('lang')
    if (urlLang && ['en', 'es', 'pt'].includes(urlLang)) {
      locale.value = urlLang
      localStorage.setItem('portun-language', urlLang)
      console.log('Using URL language parameter:', urlLang)
      return
    }

    // Use browser language if supported, otherwise default to English
    const detectedLang = languageMap[baseLang] || 'en'
    locale.value = detectedLang
    localStorage.setItem('portun-language', detectedLang)

    console.log('Browser language detected:', browserLang, '→ Using:', detectedLang)
  }

  onMounted(() => {
    detectBrowserLanguage()
  })

  // Watch for language changes and save to localStorage
  watch(() => locale.value, (newLang) => {
    localStorage.setItem('portun-language', newLang)

    // Update URL parameter
    const url = new URL(window.location.href)
    url.searchParams.set('lang', newLang)
    window.history.replaceState({}, '', url.toString())
  })

  return {
    locale,
    detectBrowserLanguage
  }
}
