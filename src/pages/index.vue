<script setup lang="ts">
import Footer from '@/views/front-pages/front-page-footer.vue'
import Navbar from '@/views/front-pages/front-page-navbar.vue'
import Banner from '@/views/front-pages/landing-page/banner.vue'
import ContactUs from '@/views/front-pages/landing-page/contact-us.vue'
import CustomersReview from '@/views/front-pages/landing-page/customers-review.vue'
import FaqSection from '@/views/front-pages/landing-page/faq-section.vue'
import Features from '@/views/front-pages/landing-page/features.vue'
import HeroSection from '@/views/front-pages/landing-page/hero-section.vue'
import OurTeam from '@/views/front-pages/landing-page/our-team.vue'
import PricingPlans from '@/views/front-pages/landing-page/pricing-plans.vue'
import ProductStats from '@/views/front-pages/landing-page/product-stats.vue'
import { useConfigStore } from '@core/stores/config'
import { useSEO } from '@/composables/useSEO'

const store = useConfigStore()

store.skin = 'default'
definePage({
  meta: {
    layout: 'blank',
    public: true,
  },
})

// Initialize SEO with dynamic translations
useSEO()

const activeSectionId = ref()

const refHome = ref()
const refFeatures = ref()
const refPricing = ref()
const refReviews = ref()
const refFaq = ref()
const refContact = ref()

useIntersectionObserver(
  [refHome, refFeatures, refPricing, refReviews, refFaq, refContact],
  ([{ isIntersecting, target }]) => {
    if (isIntersecting)
      activeSectionId.value = target.id
  },
  {
    threshold: 0.25,
  },
)
</script>

<template>
  <div class="landing-page-wrapper">
    <Navbar :active-id="activeSectionId" />

    <!-- 👉 Hero Section  -->
    <HeroSection ref="refHome" />

    <!-- 👉 Useful features  -->
    <div :style="{ 'background-color': 'rgb(var(--v-theme-surface))' }">
      <Features ref="refFeatures" />
    </div>

    <!-- 👉 Customer Review -->
    <div :style="{ 'background-color': 'rgb(var(--v-theme-surface))' }">
      <CustomersReview ref="refReviews" />
    </div>

    <!-- 👉 Pricing Plans -->
    <div :style="{ 'background-color': 'rgb(var(--v-theme-surface))' }">
      <PricingPlans ref="refPricing" />
    </div>

    <!-- 👉 Product stats -->
    <ProductStats />

    <!-- 👉 FAQ Section -->
    <div :style="{ 'background-color': 'rgb(var(--v-theme-surface))' }">
      <FaqSection ref="refFaq" />
    </div>

    <!-- 👉 Banner  -->
    <Banner />

    <!-- 👉 Contact Us  -->
    <ContactUs ref="refContact" />

    <!-- 👉 Footer -->
    <Footer />
  </div>
</template>

<style lang="scss">
@media (max-width: 960px) and (min-width: 600px) {
  .landing-page-wrapper {
    .v-container {
      padding-inline: 2rem !important;
    }
  }
}
</style>
