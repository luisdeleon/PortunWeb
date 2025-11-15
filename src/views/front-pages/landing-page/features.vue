<script setup lang="ts">
const featuresData = [
  { title: 'QR Access Control', desc: 'Create visitor QR codes in seconds. Guards validate instantly at the gate.', icon: 'tabler-qrcode' },
  { title: 'Payment Tracking', desc: 'Upload payment receipts. Admins verify with one click. Full payment history.', icon: 'tabler-receipt' },
  { title: 'Real-time Notifications', desc: 'Know the moment your guest arrives. Complete audit trail with photos.', icon: 'tabler-bell' },
  { title: 'Offline Mode', desc: 'Guards can validate QR codes even without internet. Syncs when online.', icon: 'tabler-cloud-off' },
  { title: 'Admin Dashboard', desc: 'Manage residents, verify payments, and review entry logs from one place.', icon: 'tabler-dashboard' },
  { title: 'Secure & Compliant', desc: 'Enterprise-grade security with biometric auth and encrypted data.', icon: 'tabler-shield-check' },
]
</script>

<template>
  <VContainer id="features">
    <div class="feature-cards">
      <div class="headers d-flex justify-center flex-column align-center mb-12">
        <VChip
          label
          color="primary"
          class="mb-4"
          size="small"
        >
          Key Features
        </VChip>
        <div class="d-flex text-h4 mb-1 align-center flex-wrap justify-center">
          <div class="position-relative me-2">
            <div class="section-title">
              Everything you need
            </div>
          </div>
          for smart community access
        </div>
        <p class="text-body-1 mb-0">
          Powerful visitor management and payment tracking designed for residential communities.
        </p>
      </div>
      <VRow>
        <VCol
          v-for="(data, index) in featuresData"
          :key="index"
          cols="12"
          md="4"
          sm="6"
        >
          <div class="d-flex flex-column align-center justify-center gap-4 mx-auto">
            <VIcon
              :icon="data.icon"
              size="64"
              color="primary"
            />
            <div class="text-center">
              <h5 class="text-h5 mb-2">
                {{ data.title }}
              </h5>
              <p
                class="text-body-1 mb-6"
                style="max-inline-size: 310px;"
              >
                {{ data.desc }}
              </p>
            </div>
          </div>
        </VCol>
      </VRow>
    </div>
  </VContainer>
</template>

<style lang="scss" scoped>
.feature-cards {
  margin-block: 3.75rem;
}

.section-title::after {
  position: absolute;
  background: url("../../../assets/images/front-pages/icons/section-title-icon.png") no-repeat left bottom;
  background-size: contain;
  block-size: 100%;
  content: "";
  inline-size: 120%;
  inset-block-end: 0;
  inset-inline-start: -12%;
}

.section-title {
  font-size: 24px;
  font-weight: 800;
  line-height: 36px;
}

.feature {
  .v-avatar {
    &.v-avatar--variant-outlined {
      border: 2px solid rgba(var(--v-theme-primary), 0.32);

      &:hover {
        background: rgba(var(--v-theme-primary), 0.16);
        cursor: pointer;
      }
    }
  }
}
</style>
