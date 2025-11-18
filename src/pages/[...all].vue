<script setup lang="ts">
import Footer from '@/views/front-pages/front-page-footer.vue'
import Navbar from '@/views/front-pages/front-page-navbar.vue'
import { useConfigStore } from '@core/stores/config'
import notFoundImage from '@images/pages/404.png'
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

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="not-found-page-wrapper">
    <!-- 👉 Navbar -->
    <Navbar />

    <!-- 👉 404 Content with Hero Background -->
    <div class="not-found-hero">
      <VContainer class="not-found-content">
        <VRow class="justify-center align-center" style="min-block-size: 60vh; padding-block-start: 120px;">
          <VCol
            cols="12"
            md="8"
            lg="6"
            class="text-center"
          >
            <!-- 404 Image -->
            <VImg
              :src="notFoundImage"
              alt="Page not found"
              max-width="200"
              class="mx-auto mb-6"
            />

          <!-- Heading -->
          <h1 class="text-h3 text-md-h1 font-weight-bold mb-4">
            {{ t('landing.notFound.title', 'Page Not Found') }}
          </h1>

          <!-- Description -->
          <p class="text-h6 text-medium-emphasis mb-8">
            {{ t('landing.notFound.description', 'Sorry, we couldn\'t find the page you\'re looking for. It might have been moved or deleted.') }}
          </p>

          <!-- Actions -->
          <div class="d-flex flex-wrap gap-4 justify-center">
            <VBtn
              size="large"
              color="primary"
              @click="goHome"
            >
              <VIcon
                start
                icon="tabler-home"
              />
              {{ t('landing.notFound.goHome', 'Go to Home') }}
            </VBtn>

            <VBtn
              size="large"
              variant="outlined"
              color="primary"
              :to="{ path: '/', hash: '#contact' }"
            >
              <VIcon
                start
                icon="tabler-mail"
              />
              {{ t('landing.notFound.contactUs', 'Contact Us') }}
            </VBtn>
          </div>
        </VCol>
      </VRow>
    </VContainer>
    </div>

    <!-- 👉 Footer -->
    <Footer />
  </div>
</template>

<style lang="scss" scoped>
.not-found-page-wrapper {
  display: flex;
  flex-direction: column;
  background-color: rgb(var(--v-theme-surface));
  min-block-size: 100vh;
}

.not-found-hero {
  border-radius: 0 0 50px 50px;
  background: url("@images/front-pages/backgrounds/hero-bg.png") center no-repeat, linear-gradient(138.18deg, #eae8fd 90%, #fce5e6 94.44%);
  background-size: cover;
}

// Dark mode background
:deep(.v-theme--dark) .not-found-hero {
  background-color: #25293c;
  background-image: url("@images/front-pages/backgrounds/hero-bg.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.not-found-content {
  display: flex;
  flex: 1;
  align-items: center;
}

// Responsive adjustments
@media (max-width: 600px) {
  .not-found-content {
    padding-block: 2rem;
  }
}
</style>
