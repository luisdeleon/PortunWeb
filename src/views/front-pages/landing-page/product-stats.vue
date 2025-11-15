<script setup lang="ts">
const statData = [
  { title: 'Properties Secured', value: '500+', icon: 'tabler-building-community', color: 'primary' },
  { title: 'Active Residents', value: '25k+', icon: 'tabler-users-group', color: 'success' },
  { title: 'QR Codes Generated Daily', value: '10k+', icon: 'tabler-qrcode', color: 'info' },
  { title: 'Average Entry Time', value: '<30s', icon: 'tabler-clock-hour-3', color: 'warning' },
]
</script>

<template>
  <div :style="{ 'background-color': 'rgb(var(--v-theme-surface))' }">
    <VContainer>
      <div class="py-12">
        <VRow>
          <VCol
            v-for="(product, index) in statData"
            :key="index"
            cols="12"
            sm="6"
            lg="3"
          >
            <VCard
              flat
              :style="{ border: `1px solid rgba(var(--v-theme-${product.color}))` }"
            >
              <VCardText class="text-center">
                <VIcon
                  :color="product.color"
                  :icon="product.icon"
                  size="64"
                  class="mb-4"
                />
                <h3 class="text-h3">
                  {{ product.value }}
                </h3>
                <p class="text-body-1 font-weight-medium mb-0 text-wrap">
                  {{ product.title }}
                </p>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </div>
    </VContainer>
  </div>
</template>
