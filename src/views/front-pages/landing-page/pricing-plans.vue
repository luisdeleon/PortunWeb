<script setup lang="ts">
const pricingPlans = [
  {
    title: 'Starter',
    subtitle: '10-100 units',
    icon: 'tabler-building',
    iconColor: 'primary',
    features: [
      'QR Access Control',
      'Automated Gate Opening',
      'Payment Tracking',
      'Admin Dashboard',
      'Entry Logs with Photos',
      'Real-time Notifications',
      '30-Day Free Trial',
      'Email Support',
    ],
    supportType: 'Email',
    supportMedium: 'Email Support',
    respondTime: 'Response: 24h',
    current: false,
  },
  {
    title: 'Professional',
    subtitle: '101-1000 units',
    icon: 'tabler-building-community',
    iconColor: 'success',
    features: [
      'Everything in Starter',
      'Multi-Community Management',
      'CSV Bulk Import',
      'Payment Reports Export',
      'Phone & Video Support',
      'Dedicated Onboarding',
      'Priority Email Support',
    ],
    supportType: 'Priority',
    supportMedium: 'Email & Chat',
    respondTime: 'Response: 6h',
    current: true,
  },
  {
    title: 'Enterprise',
    subtitle: '1001+ units',
    icon: 'tabler-building-skyscraper',
    iconColor: 'warning',
    features: [
      'Everything in Professional',
      'Offline Mode',
      'WhatsApp Integration',
      'Advanced Analytics',
      'Custom Branding',
      'API Access',
      'Custom Integrations',
    ],
    supportType: 'Premium',
    supportMedium: 'Email, Chat & Phone',
    respondTime: 'Live Support',
    current: false,
  },
]
</script>

<template>
  <div id="pricing">
    <VContainer>
      <div class="pricing-plans">
        <!-- 👉 Headers  -->
        <div class="headers d-flex justify-center flex-column align-center flex-wrap">
          <VChip
            label
            color="primary"
            class="mb-4"
            size="small"
          >
            Choose Your Plan
          </VChip>
          <h4 class="d-flex align-center text-h4 mb-1 flex-wrap justify-center">
            <div class="position-relative me-2">
              <div class="section-title">
                Flexible plans
              </div>
            </div>
            for communities of all sizes
          </h4>
          <div class="text-center text-body-1 mb-8">
            <p class="mb-0">
              Pay only for what you need. All plans include QR access control and payment tracking.
            </p>
            <p class="mb-0">
              Start with a 30-day free trial. No credit card required.
            </p>
          </div>
        </div>
        <VRow>
          <VCol
            v-for="(plan, index) in pricingPlans"
            :key="index"
            cols="12"
            md="4"
          >
            <VCard :style="plan.current ? 'border:2px solid rgb(var(--v-theme-primary))' : ''" class="h-100">
              <VCardText class="pa-8 pt-12">
                <div class="d-flex justify-center mb-8">
                  <VAvatar
                    :color="plan.iconColor"
                    size="88"
                    variant="tonal"
                  >
                    <VIcon
                      :icon="plan.icon"
                      size="48"
                    />
                  </VAvatar>
                </div>
                <h4 class="text-h4 text-center mb-2">
                  {{ plan.title }}
                </h4>
                <p class="text-center text-body-1 text-medium-emphasis mb-8">
                  {{ plan.subtitle }}
                </p>
                <VList class="card-list">
                  <VListItem
                    v-for="(item, i) in plan.features"
                    :key="i"
                  >
                    <template #prepend>
                      <VAvatar
                        size="16"
                        :variant="!plan.current ? 'tonal' : 'elevated'"
                        color="primary"
                        class="me-3"
                      >
                        <VIcon
                          icon="tabler-check"
                          size="12"
                          :color="!plan.current ? 'primary' : 'white'"
                        />
                      </VAvatar>
                      <h6 class="text-h6">
                        {{ item }}
                      </h6>
                    </template>
                  </VListItem>
                </VList>
                <VBtn
                  block
                  :variant="plan.current ? 'elevated' : 'tonal'"
                  class="mt-8"
                  :to="{ name: 'front-pages-payment' }"
                >
                  Get Started
                </VBtn>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </div>
    </VContainer>
  </div>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 12px;
}

#pricing-plan {
  border-radius: 3.75rem;
  background-color: rgb(var(--v-theme-background));
}

.pricing-title {
  font-size: 38px;
  font-weight: 800;
  line-height: 52px;
}

.pricing-plans {
  margin-block: 5.25rem;
}

@media (max-width: 600px) {
  .pricing-plans {
    margin-block: 4rem;
  }
}

.save-upto-chip {
  inset-block-start: -1.5rem;
  inset-inline-end: -7rem;
}

.pricing-plan-arrow {
  inset-block-start: -0.5rem;
  inset-inline-end: -8rem;
}

.section-title {
  font-size: 24px;
  font-weight: 800;
  line-height: 36px;
}

.section-title::after {
  position: absolute;
  background: url("../../../assets/images/front-pages/icons/section-title-icon.png") no-repeat left bottom;
  background-size: contain;
  block-size: 100%;
  content: "";
  font-weight: 700;
  inline-size: 120%;
  inset-block-end: 0;
  inset-inline-start: -12%;
}

.annual-price-text {
  inset-block-end: -40%;
}
</style>
