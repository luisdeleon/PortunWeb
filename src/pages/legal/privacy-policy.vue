<script setup lang="ts">
import Footer from '@/views/front-pages/front-page-footer.vue'
import Navbar from '@/views/front-pages/front-page-navbar.vue'
import { useConfigStore } from '@core/stores/config'
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

const dataWeCollect = [
  {
    title: 'legal.privacyPolicy.dataCollection.account.title',
    icon: 'tabler-user',
    color: 'primary',
    items: [
      'legal.privacyPolicy.dataCollection.account.items.name',
      'legal.privacyPolicy.dataCollection.account.items.email',
      'legal.privacyPolicy.dataCollection.account.items.phone',
      'legal.privacyPolicy.dataCollection.account.items.unit',
    ],
  },
  {
    title: 'legal.privacyPolicy.dataCollection.visitor.title',
    icon: 'tabler-users',
    color: 'success',
    items: [
      'legal.privacyPolicy.dataCollection.visitor.items.names',
      'legal.privacyPolicy.dataCollection.visitor.items.phones',
      'legal.privacyPolicy.dataCollection.visitor.items.vehicles',
      'legal.privacyPolicy.dataCollection.visitor.items.dates',
    ],
  },
  {
    title: 'legal.privacyPolicy.dataCollection.payment.title',
    icon: 'tabler-receipt',
    color: 'warning',
    items: [
      'legal.privacyPolicy.dataCollection.payment.items.receipts',
      'legal.privacyPolicy.dataCollection.payment.items.amounts',
      'legal.privacyPolicy.dataCollection.payment.items.periods',
      'legal.privacyPolicy.dataCollection.payment.items.status',
    ],
  },
  {
    title: 'legal.privacyPolicy.dataCollection.device.title',
    icon: 'tabler-device-mobile',
    color: 'info',
    items: [
      'legal.privacyPolicy.dataCollection.device.items.type',
      'legal.privacyPolicy.dataCollection.device.items.os',
      'legal.privacyPolicy.dataCollection.device.items.ip',
      'legal.privacyPolicy.dataCollection.device.items.analytics',
    ],
  },
]

const yourRights = [
  {
    icon: 'tabler-eye',
    title: 'legal.privacyPolicy.userRights.access.title',
    desc: 'legal.privacyPolicy.userRights.access.description',
    color: 'primary',
  },
  {
    icon: 'tabler-edit',
    title: 'legal.privacyPolicy.userRights.correction.title',
    desc: 'legal.privacyPolicy.userRights.correction.description',
    color: 'success',
  },
  {
    icon: 'tabler-trash',
    title: 'legal.privacyPolicy.userRights.deletion.title',
    desc: 'legal.privacyPolicy.userRights.deletion.description',
    color: 'error',
  },
  {
    icon: 'tabler-download',
    title: 'legal.privacyPolicy.userRights.portability.title',
    desc: 'legal.privacyPolicy.userRights.portability.description',
    color: 'warning',
  },
  {
    icon: 'tabler-ban',
    title: 'legal.privacyPolicy.userRights.object.title',
    desc: 'legal.privacyPolicy.userRights.object.description',
    color: 'info',
  },
  {
    icon: 'tabler-mail-off',
    title: 'legal.privacyPolicy.userRights.optOut.title',
    desc: 'legal.privacyPolicy.userRights.optOut.description',
    color: 'secondary',
  },
]

const securityMeasures = [
  {
    icon: 'tabler-key',
    title: 'legal.privacyPolicy.security.encryption.title',
    desc: 'legal.privacyPolicy.security.encryption.description',
  },
  {
    icon: 'tabler-shield-check',
    title: 'legal.privacyPolicy.security.access.title',
    desc: 'legal.privacyPolicy.security.access.description',
  },
  {
    icon: 'tabler-fingerprint',
    title: 'legal.privacyPolicy.security.auth.title',
    desc: 'legal.privacyPolicy.security.auth.description',
  },
  {
    icon: 'tabler-database-export',
    title: 'legal.privacyPolicy.security.backups.title',
    desc: 'legal.privacyPolicy.security.backups.description',
  },
]
</script>

<template>
  <div class="legal-page-wrapper">
    <Navbar />

    <div class="legal-hero">
      <VContainer>
        <div class="text-center pb-16" style="padding-top: 150px;">
          <VChip
            label
            color="info"
            class="mb-6"
            size="small"
          >
            {{ $t('legal.privacyPolicy.chip') }}
          </VChip>
          <div class="d-flex justify-center align-center mb-6">
            <VIcon
              icon="tabler-shield-lock"
              size="48"
              color="info"
              class="me-4"
            />
            <h1 class="text-h3 text-info">
              {{ $t('legal.privacyPolicy.title') }}
            </h1>
          </div>
          <p class="text-body-1 text-medium-emphasis mb-2">
            {{ $t('legal.lastUpdated') }}: {{ new Date().toLocaleDateString($i18n.locale, { year: 'numeric', month: 'long', day: 'numeric' }) }}
          </p>
          <p class="text-body-2 text-medium-emphasis">
            {{ $t('legal.privacyPolicy.subtitle') }}
          </p>
        </div>
      </VContainer>
    </div>

    <VContainer class="legal-content">
      <VRow>
        <VCol cols="12">
          <!-- Introduction -->
          <section class="legal-section mb-12">
            <VCard
              elevation="2"
              border="primary md"
            >
              <VCardText>
                <div class="text-center py-8">
                  <VIcon
                    icon="tabler-lock-heart"
                    size="64"
                    color="info"
                    class="mb-4"
                  />
                  <h2 class="text-h4 mb-4">
                    {{ $t('legal.privacyPolicy.intro.title') }}
                  </h2>
                  <p class="text-body-1 text-medium-emphasis mb-0">
                    {{ $t('legal.privacyPolicy.intro.description') }}
                  </p>
                </div>
              </VCardText>
            </VCard>
          </section>

          <!-- Data We Collect -->
          <section class="legal-section mb-12">
            <div class="text-center mb-8">
              <VChip
                label
                color="primary"
                class="mb-4"
                size="small"
              >
                {{ $t('legal.privacyPolicy.dataCollection.chip') }}
              </VChip>
              <h2 class="text-h3 mb-2">
                {{ $t('legal.privacyPolicy.dataCollection.title') }}
              </h2>
              <p class="text-body-1 text-medium-emphasis">
                {{ $t('legal.privacyPolicy.dataCollection.subtitle') }}
              </p>
            </div>

            <VRow>
              <VCol
                v-for="category in dataWeCollect"
                :key="category.title"
                cols="12"
                md="6"
              >
                <VCard
                  elevation="2"
                  class="h-100"
                >
                  <VCardText>
                    <div class="d-flex align-center mb-4">
                      <VAvatar
                        :color="category.color"
                        variant="tonal"
                        size="48"
                        class="me-3"
                      >
                        <VIcon
                          :icon="category.icon"
                          size="24"
                        />
                      </VAvatar>
                      <h4 class="text-h6">
                        {{ $t(category.title) }}
                      </h4>
                    </div>
                    <VList density="compact">
                      <VListItem
                        v-for="item in category.items"
                        :key="item"
                      >
                        <template #prepend>
                          <VIcon
                            icon="tabler-point-filled"
                            :color="category.color"
                            size="12"
                          />
                        </template>
                        <VListItemTitle class="text-body-2">
                          {{ $t(item) }}
                        </VListItemTitle>
                      </VListItem>
                    </VList>
                  </VCardText>
                </VCard>
              </VCol>
            </VRow>
          </section>

          <!-- How We Use Data -->
          <section class="legal-section mb-12">
            <VCard elevation="2">
              <VCardText>
                <div class="d-flex align-center mb-6">
                  <VAvatar
                    color="success"
                    variant="tonal"
                    size="56"
                    class="me-4"
                  >
                    <VIcon
                      icon="tabler-target"
                      size="32"
                    />
                  </VAvatar>
                  <div>
                    <h2 class="text-h4 mb-1">
                      {{ $t('legal.privacyPolicy.dataUsage.title') }}
                    </h2>
                    <p class="text-body-2 text-medium-emphasis mb-0">
                      {{ $t('legal.privacyPolicy.dataUsage.subtitle') }}
                    </p>
                  </div>
                </div>

                <VExpansionPanels>
                  <VExpansionPanel>
                    <VExpansionPanelTitle>
                      <div class="d-flex align-center">
                        <VIcon
                          icon="tabler-rocket"
                          color="success"
                          class="me-3"
                        />
                        <span class="font-weight-medium">{{ $t('legal.privacyPolicy.dataUsage.service.title') }}</span>
                      </div>
                    </VExpansionPanelTitle>
                    <VExpansionPanelText>
                      <VList>
                        <VListItem><VListItemTitle>{{ $t('legal.privacyPolicy.dataUsage.service.items.qr') }}</VListItemTitle></VListItem>
                        <VListItem><VListItemTitle>{{ $t('legal.privacyPolicy.dataUsage.service.items.payment') }}</VListItemTitle></VListItem>
                        <VListItem><VListItemTitle>{{ $t('legal.privacyPolicy.dataUsage.service.items.notifications') }}</VListItemTitle></VListItem>
                        <VListItem><VListItemTitle>{{ $t('legal.privacyPolicy.dataUsage.service.items.support') }}</VListItemTitle></VListItem>
                      </VList>
                    </VExpansionPanelText>
                  </VExpansionPanel>

                  <VExpansionPanel>
                    <VExpansionPanelTitle>
                      <div class="d-flex align-center">
                        <VIcon
                          icon="tabler-chart-line"
                          color="primary"
                          class="me-3"
                        />
                        <span class="font-weight-medium">{{ $t('legal.privacyPolicy.dataUsage.improvement.title') }}</span>
                      </div>
                    </VExpansionPanelTitle>
                    <VExpansionPanelText>
                      <p class="text-body-2 mb-0">
                        {{ $t('legal.privacyPolicy.dataUsage.improvement.description') }}
                      </p>
                    </VExpansionPanelText>
                  </VExpansionPanel>

                  <VExpansionPanel>
                    <VExpansionPanelTitle>
                      <div class="d-flex align-center">
                        <VIcon
                          icon="tabler-shield"
                          color="warning"
                          class="me-3"
                        />
                        <span class="font-weight-medium">{{ $t('legal.privacyPolicy.dataUsage.security.title') }}</span>
                      </div>
                    </VExpansionPanelTitle>
                    <VExpansionPanelText>
                      <VAlert
                        color="warning"
                        variant="tonal"
                        class="mt-4"
                      >
                        {{ $t('legal.privacyPolicy.dataUsage.security.description') }}
                      </VAlert>
                    </VExpansionPanelText>
                  </VExpansionPanel>
                </VExpansionPanels>
              </VCardText>
            </VCard>
          </section>

          <!-- Your Rights -->
          <section class="legal-section mb-12">
            <div class="text-center mb-8">
              <VChip
                label
                color="success"
                class="mb-4"
                size="small"
              >
                {{ $t('legal.privacyPolicy.userRights.chip') }}
              </VChip>
              <h2 class="text-h3 mb-2">
                {{ $t('legal.privacyPolicy.userRights.title') }}
              </h2>
              <p class="text-body-1 text-medium-emphasis">
                {{ $t('legal.privacyPolicy.userRights.subtitle') }}
              </p>
            </div>

            <VRow>
              <VCol
                v-for="right in yourRights"
                :key="right.title"
                cols="12"
                sm="6"
                md="4"
              >
                <VCard
                  elevation="0"
                  variant="tonal"
                  :color="right.color"
                  class="h-100"
                >
                  <VCardText class="text-center">
                    <VIcon
                      :icon="right.icon"
                      size="48"
                      class="mb-3"
                    />
                    <h5 class="text-h6 mb-2">
                      {{ $t(right.title) }}
                    </h5>
                    <p class="text-body-2 mb-0">
                      {{ $t(right.desc) }}
                    </p>
                  </VCardText>
                </VCard>
              </VCol>
            </VRow>

            <VCard
              elevation="2"
              color="primary"
              class="mt-8 text-white"
            >
              <VCardText class="text-center py-8">
                <VIcon
                  icon="tabler-mail-forward"
                  size="48"
                  class="mb-4"
                  color="white"
                />
                <h4 class="text-h5 mb-3 text-white">
                  {{ $t('legal.privacyPolicy.userRights.exercise.title') }}
                </h4>
                <p class="text-body-1 mb-6 text-white" style="opacity: 0.9;">
                  {{ $t('legal.privacyPolicy.userRights.exercise.description') }}
                </p>
                <VBtn
                  href="mailto:privacy@portun.app"
                  color="white"
                  size="large"
                  prepend-icon="tabler-send"
                >
                  {{ $t('legal.privacyPolicy.userRights.exercise.button') }}
                </VBtn>
              </VCardText>
            </VCard>
          </section>

          <!-- Security Measures -->
          <section class="legal-section mb-12">
            <VCard elevation="2">
              <VCardText>
                <div class="text-center mb-8">
                  <VAvatar
                    color="error"
                    variant="tonal"
                    size="72"
                    class="mb-4"
                  >
                    <VIcon
                      icon="tabler-lock-cog"
                      size="40"
                    />
                  </VAvatar>
                  <h2 class="text-h4 mb-3">
                    {{ $t('legal.privacyPolicy.security.title') }}
                  </h2>
                  <p class="text-body-1 text-medium-emphasis">
                    {{ $t('legal.privacyPolicy.security.subtitle') }}
                  </p>
                </div>

                <VRow>
                  <VCol
                    v-for="(measure, idx) in securityMeasures"
                    :key="idx"
                    cols="12"
                    sm="6"
                  >
                    <div class="d-flex align-start pa-4">
                      <VIcon
                        :icon="measure.icon"
                        color="error"
                        size="32"
                        class="me-4 mt-1"
                      />
                      <div>
                        <h5 class="text-h6 mb-2">
                          {{ $t(measure.title) }}
                        </h5>
                        <p class="text-body-2 text-medium-emphasis mb-0">
                          {{ $t(measure.desc) }}
                        </p>
                      </div>
                    </div>
                  </VCol>
                </VRow>

                <VAlert
                  color="info"
                  variant="tonal"
                  class="mt-6"
                >
                  <div class="d-flex align-center">
                    <VIcon
                      icon="tabler-bell-ringing"
                      class="me-3"
                    />
                    <div>
                      <strong>{{ $t('legal.privacyPolicy.security.breach.title') }}</strong> {{ $t('legal.privacyPolicy.security.breach.description') }}
                    </div>
                  </div>
                </VAlert>
              </VCardText>
            </VCard>
          </section>

          <!-- Contact -->
          <section class="legal-section">
            <VCard
              elevation="4"
              color="info"
              class="text-white"
            >
              <VCardText>
                <div class="text-center py-12">
                  <VIcon
                    icon="tabler-headset"
                    size="72"
                    class="mb-6"
                    color="white"
                  />
                  <h2 class="text-h3 mb-4 text-white">
                    {{ $t('legal.privacyPolicy.contact.title') }}
                  </h2>
                  <p class="text-h6 mb-8 text-white font-weight-regular" style="opacity: 0.9;">
                    {{ $t('legal.privacyPolicy.contact.subtitle') }}
                  </p>
                  <VRow justify="center">
                    <VCol
                      cols="12"
                      sm="4"
                    >
                      <VBtn
                        href="mailto:privacy@portun.app"
                        color="white"
                        size="x-large"
                        variant="elevated"
                        prepend-icon="tabler-shield-check"
                        block
                      >
                        {{ $t('legal.privacyPolicy.contact.button') }}
                      </VBtn>
                    </VCol>
                  </VRow>
                  <p class="text-body-2 mt-8 text-white" style="opacity: 0.75;">
                    {{ $t('legal.privacyPolicy.contact.company') }}<br>
                    {{ $t('legal.privacyPolicy.contact.compliance') }}
                  </p>
                </div>
              </VCardText>
            </VCard>
          </section>
        </VCol>
      </VRow>
    </VContainer>

    <Footer class="mt-16" />
  </div>
</template>

<style lang="scss" scoped>
.legal-page-wrapper {
  background-color: rgb(var(--v-theme-surface));
}

.legal-hero {
  background: linear-gradient(135deg, rgba(var(--v-theme-info), 0.05) 0%, rgba(var(--v-theme-surface), 1) 100%);
  border-block-end: 1px solid rgba(var(--v-theme-info), 0.12);
}

.legal-content {
  padding-block: 4rem;
  min-block-size: 100vh;
}

.legal-section {
  scroll-margin-top: 100px;

  .v-card {
    border-radius: 12px;
    transition: all 0.3s ease;

    &:hover:not(.text-white) {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(var(--v-theme-primary), 0.12);
    }
  }
}
</style>
