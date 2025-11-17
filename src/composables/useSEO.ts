import { useI18n } from 'vue-i18n'
import { computed, watch, onMounted } from 'vue'

export interface SEOOptions {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: string
  locale?: string
}

export function useSEO(options: SEOOptions = {}) {
  const { locale, t } = useI18n()

  const defaultTitle = computed(() => t('landing.seo.title'))
  const defaultDescription = computed(() => t('landing.seo.description'))
  const defaultKeywords = computed(() => t('landing.seo.keywords'))

  const currentLocale = computed(() => {
    const langMap: Record<string, string> = {
      'en': 'en_US',
      'es': 'es_MX',
      'pt': 'pt_BR'
    }
    return langMap[locale.value] || 'en_US'
  })

  const seoTitle = computed(() => options.title || defaultTitle.value)
  const seoDescription = computed(() => options.description || defaultDescription.value)
  const seoKeywords = computed(() => options.keywords || defaultKeywords.value)
  const seoImage = computed(() => options.image || 'https://media.portun.app/i/AppIcon.png')
  const seoUrl = computed(() => options.url || 'https://portun.app')
  const seoType = computed(() => options.type || 'website')

  const updateMetaTags = () => {
    // Update document title
    document.title = seoTitle.value

    // Update or create meta tags
    const metaTags = [
      { name: 'description', content: seoDescription.value },
      { name: 'keywords', content: seoKeywords.value },
      { name: 'robots', content: 'index, follow' },
      { name: 'language', content: locale.value },
      { name: 'author', content: 'Webzy LLC' },
      { property: 'og:type', content: seoType.value },
      { property: 'og:url', content: seoUrl.value },
      { property: 'og:title', content: seoTitle.value },
      { property: 'og:description', content: seoDescription.value },
      { property: 'og:image', content: seoImage.value },
      { property: 'og:locale', content: currentLocale.value },
      { property: 'og:site_name', content: 'Portun' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:url', content: seoUrl.value },
      { name: 'twitter:title', content: seoTitle.value },
      { name: 'twitter:description', content: seoDescription.value },
      { name: 'twitter:image', content: seoImage.value },
    ]

    metaTags.forEach(tag => {
      const selector = tag.name ? `meta[name="${tag.name}"]` : `meta[property="${tag.property}"]`
      let element = document.querySelector(selector)

      if (!element) {
        element = document.createElement('meta')
        if (tag.name) element.setAttribute('name', tag.name)
        if (tag.property) element.setAttribute('property', tag.property)
        document.head.appendChild(element)
      }

      element.setAttribute('content', tag.content)
    })

    // Update html lang attribute
    document.documentElement.setAttribute('lang', locale.value)

    // Update or create canonical link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = seoUrl.value

    // Add hreflang tags
    const existingHreflang = document.querySelectorAll('link[rel="alternate"][hreflang]')
    existingHreflang.forEach(el => el.remove())

    const hreflangTags = [
      { lang: 'en', url: `${seoUrl.value}?lang=en` },
      { lang: 'es', url: `${seoUrl.value}?lang=es` },
      { lang: 'pt', url: `${seoUrl.value}?lang=pt` },
      { lang: 'x-default', url: seoUrl.value }
    ]

    hreflangTags.forEach(tag => {
      const link = document.createElement('link')
      link.rel = 'alternate'
      link.hreflang = tag.lang
      link.href = tag.url
      document.head.appendChild(link)
    })

    // Add JSON-LD structured data
    let jsonLdScript = document.querySelector('script[type="application/ld+json"]#structured-data')
    if (!jsonLdScript) {
      jsonLdScript = document.createElement('script')
      jsonLdScript.setAttribute('type', 'application/ld+json')
      jsonLdScript.setAttribute('id', 'structured-data')
      document.head.appendChild(jsonLdScript)
    }

    jsonLdScript.textContent = JSON.stringify([
      {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        'name': 'Portun',
        'applicationCategory': 'BusinessApplication',
        'operatingSystem': 'iOS, Android, Web',
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'USD',
          'description': '30-day free trial'
        },
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': '5',
          'reviewCount': '25000'
        },
        'description': seoDescription.value
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        'name': 'Portun',
        'url': 'https://portun.app',
        'logo': 'https://media.portun.app/i/AppIcon.png',
        'contactPoint': {
          '@type': 'ContactPoint',
          'email': 'hello@portun.app',
          'contactType': 'Customer Service',
          'areaServed': [
            'US', // United States
            'MX', // Mexico
            'GT', // Guatemala
            'BZ', // Belize
            'SV', // El Salvador
            'HN', // Honduras
            'NI', // Nicaragua
            'CR', // Costa Rica
            'PA', // Panama
            'CU', // Cuba
            'DO', // Dominican Republic
            'PR', // Puerto Rico
            'CO', // Colombia
            'VE', // Venezuela
            'EC', // Ecuador
            'PE', // Peru
            'BR', // Brazil
            'BO', // Bolivia
            'PY', // Paraguay
            'UY', // Uruguay
            'AR', // Argentina
            'CL', // Chile
          ],
          'availableLanguage': ['English', 'Spanish', 'Portuguese']
        }
      }
    ])
  }

  onMounted(() => {
    updateMetaTags()
  })

  watch([seoTitle, seoDescription, seoKeywords, locale], () => {
    updateMetaTags()
  })

  return {
    seoTitle,
    seoDescription,
    seoKeywords,
    seoImage,
    seoUrl,
    currentLocale,
    updateMetaTags
  }
}
