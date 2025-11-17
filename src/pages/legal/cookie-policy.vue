<script setup lang="ts">
import Footer from '@/views/front-pages/front-page-footer.vue'
import Navbar from '@/views/front-pages/front-page-navbar.vue'
import { useConfigStore } from '@core/stores/config'
import { useI18n } from 'vue-i18n'

const store = useConfigStore()
const { t } = useI18n()

store.skin = 'default'
definePage({
  meta: {
    layout: 'blank',
    public: true,
  },
})

const cookieTypes = [
  {
    title: 'legal.cookiePolicy.types.strictlyNecessary.title',
    icon: 'tabler-lock-check',
    color: 'error',
    desc: 'legal.cookiePolicy.types.strictlyNecessary.description',
    cookies: [
      { name: 'sb-access-token', purpose: 'legal.cookiePolicy.types.strictlyNecessary.cookies.accessToken', duration: 'legal.cookiePolicy.durations.oneHour' },
      { name: 'sb-refresh-token', purpose: 'legal.cookiePolicy.types.strictlyNecessary.cookies.refreshToken', duration: 'legal.cookiePolicy.durations.thirtyDays' },
      { name: 'XSRF-TOKEN', purpose: 'legal.cookiePolicy.types.strictlyNecessary.cookies.xsrf', duration: 'legal.cookiePolicy.durations.session' },
      { name: 'cookieConsent', purpose: 'legal.cookiePolicy.types.strictlyNecessary.cookies.consent', duration: 'legal.cookiePolicy.durations.oneYear' },
    ],
  },
  {
    title: 'legal.cookiePolicy.types.performance.title',
    icon: 'tabler-chart-line',
    color: 'primary',
    desc: 'legal.cookiePolicy.types.performance.description',
    cookies: [
      { name: '_ga', purpose: 'legal.cookiePolicy.types.performance.cookies.ga', duration: 'legal.cookiePolicy.durations.twoYears' },
      { name: '_ga_*', purpose: 'legal.cookiePolicy.types.performance.cookies.gaSession', duration: 'legal.cookiePolicy.durations.twoYears' },
      { name: '_gid', purpose: 'legal.cookiePolicy.types.performance.cookies.gid', duration: 'legal.cookiePolicy.durations.twentyFourHours' },
    ],
  },
  {
    title: 'legal.cookiePolicy.types.functional.title',
    icon: 'tabler-settings',
    color: 'success',
    desc: 'legal.cookiePolicy.types.functional.description',
    cookies: [
      { name: 'i18n_locale', purpose: 'legal.cookiePolicy.types.functional.cookies.locale', duration: 'legal.cookiePolicy.durations.oneYear' },
      { name: 'theme_preference', purpose: 'legal.cookiePolicy.types.functional.cookies.theme', duration: 'legal.cookiePolicy.durations.oneYear' },
      { name: 'user_community', purpose: 'legal.cookiePolicy.types.functional.cookies.community', duration: 'legal.cookiePolicy.durations.thirtyDays' },
    ],
  },
]

const thirdPartyServices = [
  {
    name: 'legal.cookiePolicy.thirdParty.googleAnalytics.name',
    icon: 'tabler-chart-bar',
    color: 'warning',
    purpose: 'legal.cookiePolicy.thirdParty.googleAnalytics.purpose',
    link: 'https://policies.google.com/technologies/cookies',
  },
  {
    name: 'legal.cookiePolicy.thirdParty.aws.name',
    icon: 'tabler-database',
    color: 'success',
    purpose: 'legal.cookiePolicy.thirdParty.aws.purpose',
    link: 'https://aws.amazon.com/privacy/',
  },
  {
    name: 'legal.cookiePolicy.thirdParty.oneSignal.name',
    icon: 'tabler-bell',
    color: 'info',
    purpose: 'legal.cookiePolicy.thirdParty.oneSignal.purpose',
    link: 'https://onesignal.com/privacy_policy',
  },
  {
    name: 'legal.cookiePolicy.thirdParty.sentry.name',
    icon: 'tabler-bug',
    color: 'error',
    purpose: 'legal.cookiePolicy.thirdParty.sentry.purpose',
    link: 'https://sentry.io/privacy/',
  },
  {
    name: 'legal.cookiePolicy.thirdParty.vercel.name',
    icon: 'tabler-brand-vercel',
    color: 'primary',
    purpose: 'legal.cookiePolicy.thirdParty.vercel.purpose',
    link: 'https://vercel.com/legal/privacy-policy',
  },
  {
    name: 'legal.cookiePolicy.thirdParty.cloudflare.name',
    icon: 'tabler-cloud',
    color: 'warning',
    purpose: 'legal.cookiePolicy.thirdParty.cloudflare.purpose',
    link: 'https://www.cloudflare.com/privacypolicy/',
  },
]
</script>

<template>
  <div class="legal-page-wrapper">
    <Navbar />

    <div class="legal-hero">
      <VContainer>
        <div class="text-center pb-16" style="padding-top: 150px;">
          <VChip
            label
            color="warning"
            class="mb-6"
            size="small"
          >
            {{ $t('legal.cookiePolicy.chip') }}
          </VChip>
          <div class="d-flex justify-center align-center mb-6">
            <VIcon
              icon="tabler-cookie"
              size="48"
              color="warning"
              class="me-4"
            />
            <h1 class="text-h3 text-warning">
              {{ $t('legal.cookiePolicy.title') }}
            </h1>
          </div>
          <p class="text-body-1 text-medium-emphasis mb-2">
            {{ $t('legal.lastUpdated') }}: {{ new Date().toLocaleDateString($i18n.locale, { year: 'numeric', month: 'long', day: 'numeric' }) }}
          </p>
          <p class="text-body-2 text-medium-emphasis">
            {{ $t('legal.cookiePolicy.subtitle') }}
          </p>
        </div>
      </VContainer>
    </div>

    <VContainer class="legal-content">
      <VRow>
        <VCol cols="12">
          <!-- What are Cookies -->
          <section class="legal-section mb-12">
            <VCard
              elevation="2"
              border="warning md"
            >
              <VCardText>
                <div class="text-center py-8">
                  <VIcon
                    icon="tabler-cookie-man"
                    size="64"
                    color="warning"
                    class="mb-4"
                  />
                  <h2 class="text-h4 mb-4">
                    {{ $t('legal.cookiePolicy.intro.title') }}
                  </h2>
                  <p class="text-body-1 text-medium-emphasis mx-auto"
                     style="max-width: 800px;">
                    {{ $t('legal.cookiePolicy.intro.description') }}
                  </p>
                </div>
              </VCardText>
            </VCard>
          </section>

          <!-- Cookie Types -->
          <section class="legal-section mb-12">
            <div class="text-center mb-8">
              <VChip
                label
                color="primary"
                class="mb-4"
                size="small"
              >
                {{ $t('legal.cookiePolicy.types.chip') }}
              </VChip>
              <h2 class="text-h3 mb-2">
                {{ $t('legal.cookiePolicy.types.title') }}
              </h2>
              <p class="text-body-1 text-medium-emphasis">
                {{ $t('legal.cookiePolicy.types.subtitle') }}
              </p>
            </div>

            <VRow>
              <VCol
                v-for="type in cookieTypes"
                :key="type.title"
                cols="12"
              >
                <VCard elevation="2">
                  <VCardText>
                    <div class="d-flex align-center mb-4">
                      <VAvatar
                        :color="type.color"
                        variant="tonal"
                        size="56"
                        class="me-4"
                      >
                        <VIcon
                          :icon="type.icon"
                          size="32"
                        />
                      </VAvatar>
                      <div class="flex-grow-1">
                        <h3 class="text-h5 mb-1">
                          {{ $t(type.title) }}
                        </h3>
                        <p class="text-body-2 text-medium-emphasis mb-0">
                          {{ $t(type.desc) }}
                        </p>
                      </div>
                      <VChip
                        v-if="type.color === 'error'"
                        color="error"
                        variant="tonal"
                        size="small"
                      >
                        {{ $t('legal.cookiePolicy.labels.required') }}
                      </VChip>
                      <VChip
                        v-else
                        color="success"
                        variant="tonal"
                        size="small"
                      >
                        {{ $t('legal.cookiePolicy.labels.optional') }}
                      </VChip>
                    </div>

                    <VTable density="compact">
                      <thead>
                        <tr>
                          <th class="text-left">
                            {{ $t('legal.cookiePolicy.table.name') }}
                          </th>
                          <th class="text-left">
                            {{ $t('legal.cookiePolicy.table.purpose') }}
                          </th>
                          <th class="text-left">
                            {{ $t('legal.cookiePolicy.table.duration') }}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="cookie in type.cookies"
                          :key="cookie.name"
                        >
                          <td><code class="text-body-2">{{ cookie.name }}</code></td>
                          <td class="text-body-2">
                            {{ $t(cookie.purpose) }}
                          </td>
                          <td class="text-body-2">
                            {{ $t(cookie.duration) }}
                          </td>
                        </tr>
                      </tbody>
                    </VTable>
                  </VCardText>
                </VCard>
              </VCol>
            </VRow>
          </section>

          <!-- Third-Party Services -->
          <section class="legal-section mb-12">
            <VCard elevation="2">
              <VCardText>
                <div class="text-center mb-8">
                  <VAvatar
                    color="primary"
                    variant="tonal"
                    size="72"
                    class="mb-4"
                  >
                    <VIcon
                      icon="tabler-plug-connected"
                      size="40"
                    />
                  </VAvatar>
                  <h2 class="text-h4 mb-3">
                    {{ $t('legal.cookiePolicy.thirdParty.title') }}
                  </h2>
                  <p class="text-body-1 text-medium-emphasis">
                    {{ $t('legal.cookiePolicy.thirdParty.subtitle') }}
                  </p>
                </div>

                <VRow>
                  <VCol
                    v-for="service in thirdPartyServices"
                    :key="service.name"
                    cols="12"
                    sm="6"
                  >
                    <VCard
                      variant="tonal"
                      :color="service.color"
                      class="h-100"
                    >
                      <VCardText>
                        <div class="d-flex align-center mb-3">
                          <VIcon
                            :icon="service.icon"
                            size="32"
                            class="me-3"
                          />
                          <h4 class="text-h6">
                            {{ $t(service.name) }}
                          </h4>
                        </div>
                        <p class="text-body-2 mb-4">
                          {{ $t(service.purpose) }}
                        </p>
                        <VBtn
                          :href="service.link"
                          target="_blank"
                          :color="service.color"
                          variant="outlined"
                          size="small"
                          append-icon="tabler-external-link"
                        >
                          {{ $t('legal.cookiePolicy.thirdParty.privacyPolicy') }}
                        </VBtn>
                      </VCardText>
                    </VCard>
                  </VCol>
                </VRow>
              </VCardText>
            </VCard>
          </section>

          <!-- How to Manage Cookies -->
          <section class="legal-section mb-12">
            <div class="text-center mb-8">
              <VChip
                label
                color="success"
                class="mb-4"
                size="small"
              >
                {{ $t('legal.cookiePolicy.management.chip') }}
              </VChip>
              <h2 class="text-h3 mb-2">
                {{ $t('legal.cookiePolicy.management.title') }}
              </h2>
              <p class="text-body-1 text-medium-emphasis">
                {{ $t('legal.cookiePolicy.management.subtitle') }}
              </p>
            </div>

            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <VCard
                  elevation="2"
                  color="primary"
                  variant="tonal"
                  class="h-100"
                >
                  <VCardText>
                    <div class="text-center">
                      <VIcon
                        icon="tabler-adjustments"
                        size="64"
                        color="primary"
                        class="mb-4"
                      />
                      <h3 class="text-h5 mb-4">
                        {{ $t('legal.cookiePolicy.management.banner.title') }}
                      </h3>
                      <p class="text-body-2 mb-6">
                        {{ $t('legal.cookiePolicy.management.banner.description') }}
                      </p>
                      <VBtn
                        color="primary"
                        variant="elevated"
                        prepend-icon="tabler-settings"
                        block
                      >
                        {{ $t('legal.cookiePolicy.management.banner.button') }}
                      </VBtn>
                    </div>
                  </VCardText>
                </VCard>
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VCard
                  elevation="2"
                  color="success"
                  variant="tonal"
                  class="h-100"
                >
                  <VCardText>
                    <div class="text-center">
                      <VIcon
                        icon="tabler-browser"
                        size="64"
                        color="success"
                        class="mb-4"
                      />
                      <h3 class="text-h5 mb-4">
                        {{ $t('legal.cookiePolicy.management.browser.title') }}
                      </h3>
                      <p class="text-body-2 mb-4">
                        {{ $t('legal.cookiePolicy.management.browser.description') }}
                      </p>
                      <VList density="compact">
                        <VListItem
                          v-for="browser in [
                            { name: 'Chrome', link: 'https://support.google.com/chrome/answer/95647' },
                            { name: 'Firefox', link: 'https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop' },
                            { name: 'Safari', link: 'https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac' },
                          ]"
                          :key="browser.name"
                          :href="browser.link"
                          target="_blank"
                        >
                          <template #prepend>
                            <VIcon
                              icon="tabler-external-link"
                              color="success"
                              size="20"
                            />
                          </template>
                          <VListItemTitle class="text-body-2">
                            {{ browser.name }} {{ $t('legal.cookiePolicy.management.browser.settings') }}
                          </VListItemTitle>
                        </VListItem>
                      </VList>
                    </div>
                  </VCardText>
                </VCard>
              </VCol>
            </VRow>

            <VAlert
              color="warning"
              variant="tonal"
              class="mt-6"
            >
              <div class="d-flex align-center">
                <VIcon
                  icon="tabler-alert-triangle"
                  class="me-3"
                  size="24"
                />
                <div>
                  {{ $t('legal.cookiePolicy.management.warning') }}
                </div>
              </div>
            </VAlert>
          </section>

          <!-- Mobile Apps -->
          <section class="legal-section mb-12">
            <VCard
              elevation="2"
              color="info"
              variant="tonal"
            >
              <VCardText>
                <div class="d-flex align-center mb-6">
                  <VAvatar
                    color="info"
                    variant="tonal"
                    size="56"
                    class="me-4"
                  >
                    <VIcon
                      icon="tabler-device-mobile"
                      size="32"
                    />
                  </VAvatar>
                  <div>
                    <h2 class="text-h4 mb-1">
                      {{ $t('legal.cookiePolicy.mobileApp.title') }}
                    </h2>
                    <p class="text-body-2 text-medium-emphasis mb-0">
                      {{ $t('legal.cookiePolicy.mobileApp.subtitle') }}
                    </p>
                  </div>
                </div>

                <VRow>
                  <VCol
                    v-for="(platform, idx) in [
                      { name: 'iOS', icon: 'tabler-brand-apple', setting: 'Settings → Privacy → Tracking' },
                      { name: 'Android', icon: 'tabler-brand-android', setting: 'Settings → Privacy → Ads → Opt out' },
                    ]"
                    :key="idx"
                    cols="12"
                    sm="6"
                  >
                    <div class="d-flex align-start pa-4">
                      <VIcon
                        :icon="platform.icon"
                        color="info"
                        size="32"
                        class="me-4 mt-1"
                      />
                      <div>
                        <h5 class="text-h6 mb-2">
                          {{ platform.name }}
                        </h5>
                        <p class="text-body-2 text-medium-emphasis mb-0">
                          {{ platform.setting }}
                        </p>
                      </div>
                    </div>
                  </VCol>
                </VRow>
              </VCardText>
            </VCard>
          </section>

          <!-- Contact -->
          <section class="legal-section">
            <VCard
              elevation="4"
              color="warning"
              class="text-white"
            >
              <VCardText>
                <div class="text-center py-12">
                  <VIcon
                    icon="tabler-cookie"
                    size="72"
                    class="mb-6"
                    color="white"
                  />
                  <h2 class="text-h3 mb-4 text-white">
                    {{ $t('legal.cookiePolicy.contact.title') }}
                  </h2>
                  <p class="text-h6 mb-8 text-white font-weight-regular" style="opacity: 0.9;">
                    {{ $t('legal.cookiePolicy.contact.subtitle') }}
                  </p>
                  <VRow justify="center">
                    <VCol
                      cols="12"
                      sm="4"
                    >
                      <VBtn
                        href="mailto:privacy@portun.app"
                        color="white"
                        size="x-large"
                        variant="elevated"
                        prepend-icon="tabler-mail"
                        block
                      >
                        {{ $t('legal.cookiePolicy.contact.button') }}
                      </VBtn>
                    </VCol>
                  </VRow>
                  <div class="mt-8">
                    <p class="text-body-2 text-white mb-2" style="opacity: 0.75;">
                      {{ $t('legal.cookiePolicy.contact.resources') }}
                    </p>
                    <div class="d-flex justify-center gap-4 flex-wrap">
                      <VBtn
                        href="https://www.allaboutcookies.org/"
                        target="_blank"
                        color="white"
                        variant="text"
                        size="small"
                        append-icon="tabler-external-link"
                      >
                        {{ $t('legal.cookiePolicy.contact.allAboutCookies') }}
                      </VBtn>
                      <VBtn
                        href="https://www.youronlinechoices.com/"
                        target="_blank"
                        color="white"
                        variant="text"
                        size="small"
                        append-icon="tabler-external-link"
                      >
                        {{ $t('legal.cookiePolicy.contact.yourOnlineChoices') }}
                      </VBtn>
                    </div>
                  </div>
                </div>
              </VCardText>
            </VCard>
          </section>
        </VCol>
      </VRow>
    </VContainer>

    <Footer class="mt-16" />
  </div>
</template>

<style lang="scss" scoped>
.legal-page-wrapper {
  background-color: rgb(var(--v-theme-surface));
}

.legal-hero {
  background: linear-gradient(135deg, rgba(var(--v-theme-warning), 0.05) 0%, rgba(var(--v-theme-surface), 1) 100%);
  border-block-end: 1px solid rgba(var(--v-theme-warning), 0.12);
}

.legal-content {
  padding-block: 4rem;
  min-block-size: 100vh;
}

.legal-section {
  scroll-margin-top: 100px;

  .v-card {
    border-radius: 12px;
    transition: all 0.3s ease;

    &:hover:not(.text-white) {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(var(--v-theme-primary), 0.12);
    }
  }

  code {
    background-color: rgba(var(--v-theme-on-surface), 0.08);
    padding: 2px 8px;
    border-radius: 6px;
    font-family: 'Courier New', monospace;
    font-size: 0.9em;
  }
}
</style>
