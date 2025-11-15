<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const showBanner = ref(false)

const checkCookieConsent = () => {
  const consent = localStorage.getItem('portun-cookie-consent')
  if (!consent) {
    showBanner.value = true
  }
}

const acceptCookies = () => {
  localStorage.setItem('portun-cookie-consent', 'accepted')
  localStorage.setItem('portun-cookie-consent-date', new Date().toISOString())
  showBanner.value = false
}

const declineCookies = () => {
  localStorage.setItem('portun-cookie-consent', 'declined')
  localStorage.setItem('portun-cookie-consent-date', new Date().toISOString())
  showBanner.value = false
}

onMounted(() => {
  // Show banner after 1 second to avoid flash on page load
  setTimeout(() => {
    checkCookieConsent()
  }, 1000)
})
</script>

<template>
  <Transition name="slide-up">
    <div
      v-if="showBanner"
      class="cookie-consent-banner"
    >
      <VCard
        class="cookie-consent-card"
        elevation="8"
      >
        <VCardText class="pa-6">
          <div class="d-flex flex-column flex-md-row align-start align-md-center gap-4">
            <!-- Icon -->
            <div class="cookie-icon">
              <VIcon
                icon="tabler-cookie"
                size="40"
                color="primary"
              />
            </div>

            <!-- Content -->
            <div class="flex-grow-1">
              <h6 class="text-h6 mb-2">
                {{ $t('cookies.title') }}
              </h6>
              <p class="text-body-2 mb-0">
                {{ $t('cookies.description') }}
                <a
                  href="#"
                  class="text-primary text-decoration-none"
                  @click.prevent
                >
                  {{ $t('cookies.learnMore') }}
                </a>
              </p>
            </div>

            <!-- Actions -->
            <div class="d-flex gap-2 flex-shrink-0">
              <VBtn
                color="primary"
                variant="elevated"
                @click="acceptCookies"
              >
                {{ $t('cookies.accept') }}
              </VBtn>
              <VBtn
                color="secondary"
                variant="outlined"
                @click="declineCookies"
              >
                {{ $t('cookies.decline') }}
              </VBtn>
            </div>
          </div>
        </VCardText>
      </VCard>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.cookie-consent-banner {
  position: fixed;
  inset-block-end: 0;
  inset-inline: 0;
  z-index: 1000;
  padding: 1rem;
  background: linear-gradient(
    to top,
    rgba(var(--v-theme-surface), 0.95) 0%,
    rgba(var(--v-theme-surface), 0.9) 50%,
    transparent 100%
  );
  backdrop-filter: blur(10px);
}

.cookie-consent-card {
  max-inline-size: 1200px;
  margin-inline: auto;
  border-radius: 12px !important;
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.1) !important;
}

.cookie-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(var(--v-theme-primary), 0.12);
  border-radius: 50%;
  block-size: 64px;
  inline-size: 64px;
}

@media (max-width: 960px) {
  .cookie-consent-card {
    .d-flex.flex-md-row {
      text-align: center;

      .cookie-icon {
        margin-inline: auto;
      }

      .flex-grow-1 {
        text-align: center;
      }

      .d-flex.gap-2 {
        flex-direction: column;
        inline-size: 100%;

        .v-btn {
          inline-size: 100%;
        }
      }
    }
  }
}

// Slide up animation
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
}

.slide-up-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
