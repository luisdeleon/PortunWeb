<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const statData = [
  { key: 'propertiesSecured', value: '500+', icon: 'tabler-building-community', color: 'primary' },
  { key: 'activeResidents', value: '25k+', icon: 'tabler-users-group', color: 'success' },
  { key: 'qrCodesDaily', value: '10k+', icon: 'tabler-qrcode', color: 'info' },
  { key: 'avgEntryTime', value: '<30s', icon: 'tabler-clock-hour-3', color: 'warning' },
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
                  {{ $t(`landing.stats.${product.key}`) }}
                </p>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </div>
    </VContainer>
  </div>
</template>
