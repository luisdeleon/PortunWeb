<script setup lang="ts">
const ctaDashboard = 'https://media.portun.app/i/portun-dashboard-home.png'
</script>

<template>
  <div
    class="landing-cta bg-surface"
    :class="$vuetify.theme.current.dark ? 'banner-bg-dark' : 'banner-bg-light'"
  >
    <VContainer>
      <div class="d-flex justify-center justify-md-space-between flex-wrap gap-6 gap-x-10 position-relative pt-12">
        <div class="align-self-center">
          <div class="banner-title text-primary mb-1">
            {{ $t('landing.banner.title') }}
          </div>
          <h5 class="text-h5 text-medium-emphasis mb-8">
            {{ $t('landing.banner.subtitle') }}
          </h5>
          <VBtn
            color="primary"
            :to="{ path: '/', hash: '#contact' }"
            :size="$vuetify.display.smAndUp ? 'large' : 'default' "
          >
            {{ $t('landing.banner.cta') }}
          </VBtn>
        </div>

        <div class="banner-img">
          <img
            :src="ctaDashboard"
            class="w-100"
          >
        </div>
      </div>
    </VContainer>
  </div>
</template>

<style lang="scss">
.landing-cta {
  background-size: cover;
  margin-block: auto;
}

.banner-img {
  margin-block-end: -22px;
  margin-inline-end: 80px;
  max-inline-size: 250px;

  img {
    border-radius: 12px;
    block-size: auto;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 15%);
    inline-size: 70%;
  }
}

.banner-title {
  font-size: 34px;
  font-weight: 700;
  line-height: 44px;
}

.banner-bg-light {
  background-image: url("@images/front-pages/backgrounds/cta-bg.png");
}

.banner-bg-dark {
  background-image: url("@images/front-pages/backgrounds/cta-bg-dark.png");
}
</style>
