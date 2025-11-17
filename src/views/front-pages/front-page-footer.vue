<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import appleImg from '@images/front-pages/landing-page/apple-icon.png'
import googlePlayImg from '@images/front-pages/landing-page/google-play-icon.png'

import footerDarkBg from '@images/front-pages/backgrounds/footer-bg-dark.png'
import footerLightBg from '@images/front-pages/backgrounds/footer-bg-light.png'

import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'

const { t } = useI18n()

interface Menu {
  name: string
  to: any
}

const footerBg = useGenerateImageVariant(footerLightBg, footerDarkBg)

// Navigation items from header (matches landing page order)
const navigationList: Menu[] = [
  { name: 'Home', to: { path: '/', hash: '#home' } },
  { name: 'Features', to: { path: '/', hash: '#features' } },
  { name: 'Reviews', to: { path: '/', hash: '#reviews' } },
  { name: 'Pricing', to: { path: '/', hash: '#pricing' } },
  { name: 'FAQ', to: { path: '/', hash: '#faq' } },
  { name: 'Contact', to: { path: '/', hash: '#contact' } },
]

// Legal pages
const legalList: Menu[] = [
  { name: 'termsAndConditions', to: '/legal/terms-and-conditions' },
  { name: 'termsOfService', to: '/legal/terms-of-service' },
  { name: 'privacyPolicy', to: '/legal/privacy-policy' },
  { name: 'cookiePolicy', to: '/legal/cookie-policy' },
]
</script>

<template>
  <div class="footer">
    <div
      class="footer-top pt-11"
      :style="{ 'background-image': `url(${footerBg})` }"
    >
      <VContainer>
        <VRow>
          <!-- 👉 Footer  -->
          <VCol
            cols="12"
            md="5"
          >
            <div
              class="mb-4"
              :class="$vuetify.display.smAndDown ? 'w-100' : 'w-75'"
            >
              <div class="app-logo mb-6">
                <VNodeRenderer :nodes="themeConfig.app.logo" />
                <h1 class="app-logo-title text-white">
                  {{ themeConfig.app.title }}
                </h1>
              </div>

              <div
                class="mb-6"
                :class="$vuetify.theme.current.dark ? 'text-body-1' : 'text-white-variant'"
              >
                {{ $t('landing.footer.slogan') }}
              </div>
              <VForm class="subscribe-form d-flex align-center">
                <AppTextField
                  :label="$t('landing.footer.newsletter')"
                  :placeholder="$t('landing.footer.newsletterPlaceholder')"
                />
                <VBtn class="align-self-end rounded-s-0">
                  {{ $t('landing.footer.subscribe') }}
                </VBtn>
              </VForm>
            </div>
          </VCol>

          <!-- 👉 Navigation  -->
          <VCol
            md="2"
            sm="4"
            xs="6"
          >
            <div class="footer-links">
              <h6 class="footer-title text-h6 mb-6">
                {{ $t('landing.footer.navigation') }}
              </h6>
              <ul style="list-style: none;">
                <li
                  v-for="(item, index) in navigationList"
                  :key="index"
                  class="mb-4"
                >
                  <RouterLink
                    :class="$vuetify.theme.current.dark ? 'text-body-1' : 'text-white-variant'"
                    :to="item.to"
                  >
                    {{ $t(`landing.nav.${item.name.toLowerCase()}`) }}
                  </RouterLink>
                </li>
              </ul>
            </div>
          </VCol>

          <!-- 👉 Legal  -->
          <VCol
            md="2"
            sm="4"
            xs="6"
          >
            <div class="footer-links">
              <h6 class="footer-title text-h6 mb-6">
                {{ $t('landing.footer.legal') }}
              </h6>
              <ul style="list-style: none;">
                <li
                  v-for="(item, index) in legalList"
                  :key="index"
                  class="mb-4"
                >
                  <RouterLink
                    :class="$vuetify.theme.current.dark ? 'text-body-1' : 'text-white-variant'"
                    :to="item.to"
                  >
                    {{ $t(`landing.footer.${item.name}`) }}
                  </RouterLink>
                </li>
              </ul>
            </div>
          </VCol>

          <!-- 👉 Download App -->
          <VCol
            cols="12"
            md="3"
            sm="4"
          >
            <div>
              <h6 class="footer-title text-h6 mb-6">
                {{ $t('landing.footer.downloadApp') }}
              </h6>

              <div>
                <VBtn
                  v-for="(item, index) in [
                    { image: appleImg, storeKey: 'appStore' },
                    { image: googlePlayImg, storeKey: 'googlePlay' },
                  ]"
                  :key="index"
                  color="#282c3e"
                  height="56"
                  class="mb-4 d-block"
                >
                  <template #default>
                    <div class="d-flex align-center gap-x-8 footer-logo-buttons">
                      <VImg
                        :src="item.image"
                        height="34"
                        width="34"
                      />
                      <div class="d-flex flex-column justify-content-start">
                        <div :class="$vuetify.theme.current.dark ? 'text-body-2' : 'text-white-variant text-body-2'">
                          {{ $t('landing.footer.downloadOn') }}
                        </div>
                        <h6
                          class="text-h6 text-start"
                          :class="$vuetify.theme.current.dark ? 'text-body-1' : 'footer-title'"
                        >
                          {{ $t(`landing.footer.${item.storeKey}`) }}
                        </h6>
                      </div>
                    </div>
                  </template>
                </VBtn>
              </div>
            </div>
          </VCol>
        </VRow>
      </VContainer>
    </div>

    <!-- 👉 Footer Line -->
    <div class="footer-line w-100">
      <VContainer>
        <div class="d-flex justify-space-between flex-wrap gap-y-5 align-center">
          <div class="text-body-1 text-white-variant text-wrap me-4">
            Copyright &copy; {{ new Date().getFullYear() }} <a href="https://webzy.io" target="_blank" rel="noopener noreferrer" class="webzy-link">Webzy LLC</a>. All rights reserved.
          </div>

          <div class="d-flex gap-x-6">
            <template
              v-for="(item, index) in [
                { title: 'github', icon: 'tabler-brand-github-filled', href: 'https://github.com/pixinvent' },
                { title: 'facebook', icon: 'tabler-brand-facebook-filled', href: 'https://www.facebook.com/pixinvents/' },
                { title: 'twitter', icon: 'tabler-brand-twitter-filled', href: 'https://twitter.com/pixinvents' },
                { title: 'google', icon: 'tabler-brand-youtube-filled', href: 'https://www.youtube.com/channel/UClOcB3o1goJ293ri_Hxpklg' },
              ]"
              :key="index"
            >
              <a
                :href="item.href"
                target="_blank"
                rel="noopener noreferrer"
              >
                <VIcon
                  :icon="item.icon"
                  size="16"
                  color="white"
                />
              </a>
            </template>
          </div>
        </div>
      </VContainer>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.footer-title {
  color: rgba(255, 255, 255, 92%);
}

.footer-top {
  border-radius: 60px 60px 0 0;
  background-size: cover;
  color: #fff;
}

.footer-links {
  .text-white-variant,
  .text-body-1 {
    &:hover {
      color: #fff;
    }
  }
}

.footer-line {
  background: #282c3e;

  .webzy-link {
    color: inherit;
    text-decoration: none;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.8;
    }
  }
}
</style>

<style lang="scss">
.subscribe-form {
  .v-label {
    color: rgba(225, 222, 245, 90%) !important;
  }

  .v-field {
    border-end-end-radius: 0;
    border-end-start-radius: 10px;
    border-start-end-radius: 0;
    border-start-start-radius: 10px;

    input.v-field__input::placeholder {
      color: rgba(225, 222, 245, 40%) !important;
    }

    input.v-field__input {
      color: rgba(255, 255, 255, 78%);
    }
  }
}

.footer {
  border-radius: 50%;

  @media (min-width: 600px) and (max-width: 960px) {
    .v-container {
      padding-inline: 2rem !important;
    }

    .footer-logo-buttons {
      gap: 0.75rem;
    }
  }
}
</style>
