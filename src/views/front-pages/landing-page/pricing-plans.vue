<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const pricingPlans = [
  {
    key: 'starter',
    icon: 'tabler-building',
    iconColor: 'primary',
    featureKeys: [
      'qrAccess',
      'automatedGate',
      'paymentTracking',
      'adminDashboard',
      'entryLogs',
      'notifications',
      'freeTrial',
      'emailSupport',
    ],
    current: false,
  },
  {
    key: 'professional',
    icon: 'tabler-building-community',
    iconColor: 'success',
    featureKeys: [
      'everythingStarter',
      'multiCommunity',
      'csvImport',
      'paymentReports',
      'phoneVideo',
      'onboarding',
      'priorityEmail',
    ],
    current: true,
  },
  {
    key: 'enterprise',
    icon: 'tabler-building-skyscraper',
    iconColor: 'warning',
    featureKeys: [
      'everythingPro',
      'carPlay',
      'whatsapp',
      'analytics',
      'customBranding',
      'apiAccess',
      'customIntegrations',
    ],
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
            {{ $t('landing.pricing.chip') }}
          </VChip>
          <h4 class="d-flex align-center text-h4 mb-1 flex-wrap justify-center">
            <div class="position-relative me-2">
              <div class="section-title">
                {{ $t('landing.pricing.title') }}
              </div>
            </div>
            {{ $t('landing.pricing.subtitle') }}
          </h4>
          <div class="text-center text-body-1 mb-8">
            <p class="mb-0">
              {{ $t('landing.pricing.description1') }}
            </p>
            <p class="mb-0">
              {{ $t('landing.pricing.description2') }}
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
                  {{ $t(`landing.pricing.${plan.key}.title`) }}
                </h4>
                <p class="text-center text-body-1 text-medium-emphasis mb-8">
                  {{ $t(`landing.pricing.${plan.key}.subtitle`) }}
                </p>
                <VList class="card-list">
                  <VListItem
                    v-for="(featureKey, i) in plan.featureKeys"
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
                        {{ $t(`landing.pricing.${plan.key}.features.${featureKey}`) }}
                      </h6>
                    </template>
                  </VListItem>
                </VList>
                <VBtn
                  block
                  :variant="plan.current ? 'elevated' : 'tonal'"
                  class="mt-8"
                  :to="{ path: '/', hash: '#contact' }"
                >
                  {{ $t('landing.pricing.cta') }}
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
