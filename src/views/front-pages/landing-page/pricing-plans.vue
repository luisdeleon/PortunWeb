<script setup lang="ts">
import paperPlane from '@images/front-pages/icons/paper-airplane.png'
import plane from '@images/front-pages/icons/plane.png'
import pricingPlanArrow from '@images/front-pages/icons/pricing-plans-arrow.png'
import shuttleRocket from '@images/front-pages/icons/shuttle-rocket.png'

const annualMonthlyPlanPriceToggler = ref(true)

const pricingPlans = [
  {
    title: 'Starter',
    subtitle: '10-50 units',
    image: paperPlane,
    monthlyPrice: 3,
    yearlyPrice: 2.70,
    features: [
      'QR Access Control',
      'Payment Tracking',
      'Real-time Notifications',
      'Entry Logs with Photos',
      'Admin Dashboard',
      'Email Support',
      '30-Day Free Trial',
    ],
    supportType: 'Email',
    supportMedium: 'Email Support',
    respondTime: 'Response: 24h',
    current: false,
  },
  {
    title: 'Professional',
    subtitle: '51-200 units',
    image: plane,
    monthlyPrice: 2.50,
    yearlyPrice: 2.25,
    features: [
      'Everything in Starter',
      'Offline Mode',
      'WhatsApp Integration',
      'CSV Bulk Import',
      'Payment Reports Export',
      'Priority Email Support',
      'Dedicated Onboarding',
    ],
    supportType: 'Priority',
    supportMedium: 'Email & Chat',
    respondTime: 'Response: 6h',
    current: true,
  },
  {
    title: 'Enterprise',
    subtitle: '201+ units',
    image: shuttleRocket,
    monthlyPrice: 2,
    yearlyPrice: 1.80,
    features: [
      'Everything in Professional',
      'Custom Branding',
      'API Access',
      'Advanced Analytics',
      'Multi-Community Management',
      'Phone & Video Support',
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
  <div id="pricing-plan">
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
          <div class="text-center text-body-1">
            <p class="mb-0">
              Pay only for what you need. All plans include QR access control and payment tracking.
            </p>
            <p class="mb-0">
              Start with a 30-day free trial. No credit card required.
            </p>
          </div>
        </div>
        <!-- 👉 Annual and monthly price toggler -->
        <div class="d-flex align-center justify-center mx-auto mt-6 mb-16">
          <VLabel
            for="pricing-plan-toggle"
            class="me-3"
          >
            Monthly Billing
          </VLabel>
          <div class="position-relative">
            <VSwitch
              id="pricing-plan-toggle"
              v-model="annualMonthlyPlanPriceToggler"
            >
              <template #label>
                <div class="text-body-1">
                  Annual Billing
                </div>
              </template>
            </VSwitch>
            <div class="position-absolute pricing-plan-arrow d-md-flex d-none">
              <VImg
                :src="pricingPlanArrow"
                class="flip-in-rtl"
                width="60"
                height="42"
              />
              <div class="text-no-wrap text-body-1 font-weight-medium">
                Save 10%
              </div>
            </div>
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
                <VImg
                  :src="plan.image"
                  width="88"
                  height="88"
                  class="mx-auto mb-8"
                />
                <h4 class="text-h4 text-center">
                  {{ plan.title }}
                </h4>
                <div class="d-flex justify-center mb-8 position-relative">
                  <div class="d-flex align-end">
                    <div class="pricing-title text-primary me-1">
                      ${{ annualMonthlyPlanPriceToggler ? Math.floor(plan.yearlyPrice) / 12 : plan.monthlyPrice }}
                    </div>
                    <span class="text-disabled mb-2">/mo</span>
                  </div>

                  <!-- 👉 Annual Price -->
                  <span
                    v-show="annualMonthlyPlanPriceToggler"
                    class="annual-price-text position-absolute text-sm text-disabled"
                  >
                    {{ plan.yearlyPrice === 0 ? 'free' : `USD ${plan.yearlyPrice}/Year` }}
                  </span>
                </div>
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
