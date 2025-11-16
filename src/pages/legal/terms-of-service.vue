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

const userRoles = [
  {
    title: 'legal.termsOfService.userRoles.residents.title',
    icon: 'tabler-home',
    color: 'primary',
    features: [
      'legal.termsOfService.userRoles.residents.features.qr',
      'legal.termsOfService.userRoles.residents.features.payments',
      'legal.termsOfService.userRoles.residents.features.logs',
      'legal.termsOfService.userRoles.residents.features.notifications',
    ],
  },
  {
    title: 'legal.termsOfService.userRoles.guards.title',
    icon: 'tabler-shield-check',
    color: 'success',
    features: [
      'legal.termsOfService.userRoles.guards.features.scan',
      'legal.termsOfService.userRoles.guards.features.log',
      'legal.termsOfService.userRoles.guards.features.photo',
      'legal.termsOfService.userRoles.guards.features.offline',
    ],
  },
  {
    title: 'legal.termsOfService.userRoles.admins.title',
    icon: 'tabler-user-cog',
    color: 'warning',
    features: [
      'legal.termsOfService.userRoles.admins.features.manage',
      'legal.termsOfService.userRoles.admins.features.verify',
      'legal.termsOfService.userRoles.admins.features.analytics',
      'legal.termsOfService.userRoles.admins.features.users',
    ],
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
            color="success"
            class="mb-6"
            size="small"
          >
            {{ $t('legal.termsOfService.chip') }}
          </VChip>
          <div class="d-flex justify-center align-center mb-6">
            <VIcon
              icon="tabler-file-check"
              size="48"
              color="success"
              class="me-4"
            />
            <h1 class="text-h3 text-success">
              {{ $t('legal.termsOfService.title') }}
            </h1>
          </div>
          <p class="text-body-1 text-medium-emphasis mb-2">
            {{ $t('legal.lastUpdated') }}: {{ new Date().toLocaleDateString($i18n.locale, { year: 'numeric', month: 'long', day: 'numeric' }) }}
          </p>
          <p class="text-body-2 text-medium-emphasis">
            {{ $t('legal.termsOfService.subtitle') }}
          </p>
        </div>
      </VContainer>
    </div>

    <VContainer class="legal-content">
      <VRow>
        <!-- Main Content -->
        <VCol cols="12">
          <!-- Acceptance -->
          <section class="legal-section mb-12">
            <VCard
              elevation="2"
              class="overflow-visible"
            >
              <VCardText>
                <div class="d-flex align-center mb-6">
                  <VAvatar
                    color="success"
                    variant="tonal"
                    size="56"
                    class="me-4"
                  >
                    <VIcon
                      icon="tabler-checks"
                      size="32"
                    />
                  </VAvatar>
                  <div>
                    <h2 class="text-h4 mb-1">
                      {{ $t('legal.termsOfService.acceptance.title') }}
                    </h2>
                    <p class="text-body-2 text-medium-emphasis mb-0">
                      {{ $t('legal.termsOfService.acceptance.subtitle') }}
                    </p>
                  </div>
                </div>
                <VAlert
                  color="success"
                  variant="tonal"
                  class="mb-0"
                >
                  <div class="d-flex align-start">
                    <VIcon
                      icon="tabler-info-circle"
                      class="me-3 mt-1"
                    />
                    <div>
                      {{ $t('legal.termsOfService.acceptance.message') }}
                    </div>
                  </div>
                </VAlert>
              </VCardText>
            </VCard>
          </section>

          <!-- User Roles -->
          <section class="legal-section mb-12">
            <div class="text-center mb-8">
              <VChip
                label
                color="primary"
                class="mb-4"
                size="small"
              >
                {{ $t('legal.termsOfService.userRoles.chip') }}
              </VChip>
              <h2 class="text-h3 mb-2">
                {{ $t('legal.termsOfService.userRoles.title') }}
              </h2>
              <p class="text-body-1 text-medium-emphasis">
                {{ $t('legal.termsOfService.userRoles.subtitle') }}
              </p>
            </div>

            <VRow>
              <VCol
                v-for="role in userRoles"
                :key="role.title"
                cols="12"
                md="4"
              >
                <VCard
                  elevation="2"
                  class="h-100"
                >
                  <VCardText>
                    <div class="text-center mb-6">
                      <VAvatar
                        :color="role.color"
                        variant="tonal"
                        size="80"
                        class="mb-4"
                      >
                        <VIcon
                          :icon="role.icon"
                          size="40"
                        />
                      </VAvatar>
                      <h3 class="text-h5">
                        {{ $t(role.title) }}
                      </h3>
                    </div>
                    <VList density="compact">
                      <VListItem
                        v-for="(feature, idx) in role.features"
                        :key="idx"
                      >
                        <template #prepend>
                          <VIcon
                            icon="tabler-check"
                            :color="role.color"
                            size="20"
                          />
                        </template>
                        <VListItemTitle class="text-body-2">
                          {{ $t(feature) }}
                        </VListItemTitle>
                      </VListItem>
                    </VList>
                  </VCardText>
                </VCard>
              </VCol>
            </VRow>
          </section>

          <!-- QR Access Control -->
          <section class="legal-section mb-12">
            <VCard elevation="2">
              <VCardText>
                <div class="d-flex align-center mb-6">
                  <VAvatar
                    color="primary"
                    variant="tonal"
                    size="56"
                    class="me-4"
                  >
                    <VIcon
                      icon="tabler-qrcode"
                      size="32"
                    />
                  </VAvatar>
                  <div>
                    <h2 class="text-h4 mb-1">
                      {{ $t('legal.termsOfService.qrSection.title') }}
                    </h2>
                    <p class="text-body-2 text-medium-emphasis mb-0">
                      {{ $t('legal.termsOfService.qrSection.subtitle') }}
                    </p>
                  </div>
                </div>

                <VExpansionPanels>
                  <VExpansionPanel>
                    <VExpansionPanelTitle>
                      <div class="d-flex align-center">
                        <VIcon
                          icon="tabler-clock"
                          color="primary"
                          class="me-3"
                        />
                        <span class="font-weight-medium">{{ $t('legal.termsOfService.qrSection.validity.title') }}</span>
                      </div>
                    </VExpansionPanelTitle>
                    <VExpansionPanelText>
                      <VList>
                        <VListItem>
                          <template #prepend>
                            <VIcon
                              icon="tabler-circle-check"
                              color="success"
                              size="20"
                            />
                          </template>
                          <VListItemTitle>{{ $t('legal.termsOfService.qrSection.validity.items.dates') }}</VListItemTitle>
                        </VListItem>
                        <VListItem>
                          <template #prepend>
                            <VIcon
                              icon="tabler-circle-check"
                              color="success"
                              size="20"
                            />
                          </template>
                          <VListItemTitle>{{ $t('legal.termsOfService.qrSection.validity.items.limits') }}</VListItemTitle>
                        </VListItem>
                        <VListItem>
                          <template #prepend>
                            <VIcon
                              icon="tabler-circle-check"
                              color="success"
                              size="20"
                            />
                          </template>
                          <VListItemTitle>{{ $t('legal.termsOfService.qrSection.validity.items.expired') }}</VListItemTitle>
                        </VListItem>
                      </VList>
                    </VExpansionPanelText>
                  </VExpansionPanel>

                  <VExpansionPanel>
                    <VExpansionPanelTitle>
                      <div class="d-flex align-center">
                        <VIcon
                          icon="tabler-alert-triangle"
                          color="error"
                          class="me-3"
                        />
                        <span class="font-weight-medium">{{ $t('legal.termsOfService.qrSection.prohibited.title') }}</span>
                      </div>
                    </VExpansionPanelTitle>
                    <VExpansionPanelText>
                      <VAlert
                        color="error"
                        variant="tonal"
                        class="mt-4"
                      >
                        <div class="text-body-2">
                          {{ $t('legal.termsOfService.qrSection.prohibited.message') }}
                        </div>
                      </VAlert>
                    </VExpansionPanelText>
                  </VExpansionPanel>

                  <VExpansionPanel>
                    <VExpansionPanelTitle>
                      <div class="d-flex align-center">
                        <VIcon
                          icon="tabler-cloud-off"
                          color="info"
                          class="me-3"
                        />
                        <span class="font-weight-medium">{{ $t('legal.termsOfService.qrSection.offline.title') }}</span>
                      </div>
                    </VExpansionPanelTitle>
                    <VExpansionPanelText>
                      <div class="mt-4">
                        <p class="text-body-2 mb-3">
                          {{ $t('legal.termsOfService.qrSection.offline.description') }}
                        </p>
                        <VAlert
                          color="warning"
                          variant="tonal"
                          density="compact"
                        >
                          <VIcon
                            icon="tabler-info-circle"
                            size="20"
                            class="me-2"
                          />
                          <span class="text-body-2">{{ $t('legal.termsOfService.qrSection.offline.warning') }}</span>
                        </VAlert>
                      </div>
                    </VExpansionPanelText>
                  </VExpansionPanel>
                </VExpansionPanels>
              </VCardText>
            </VCard>
          </section>

          <!-- Payment Features -->
          <section class="legal-section mb-12">
            <VCard elevation="2">
              <VCardText>
                <div class="d-flex align-center mb-6">
                  <VAvatar
                    color="warning"
                    variant="tonal"
                    size="56"
                    class="me-4"
                  >
                    <VIcon
                      icon="tabler-receipt"
                      size="32"
                    />
                  </VAvatar>
                  <div>
                    <h2 class="text-h4 mb-1">
                      {{ $t('legal.termsOfService.payment.title') }}
                    </h2>
                    <p class="text-body-2 text-medium-emphasis mb-0">
                      {{ $t('legal.termsOfService.payment.subtitle') }}
                    </p>
                  </div>
                </div>

                <VRow>
                  <VCol
                    cols="12"
                    md="6"
                  >
                    <VCard
                      variant="tonal"
                      color="success"
                    >
                      <VCardText>
                        <div class="d-flex align-center mb-4">
                          <VIcon
                            icon="tabler-upload"
                            size="28"
                            class="me-3"
                          />
                          <h4 class="text-h6">
                            {{ $t('legal.termsOfService.payment.upload.title') }}
                          </h4>
                        </div>
                        <VList density="compact">
                          <VListItem>
                            <template #prepend>
                              <VIcon
                                icon="tabler-check"
                                size="18"
                              />
                            </template>
                            <VListItemTitle class="text-body-2">
                              {{ $t('legal.termsOfService.payment.upload.items.clear') }}
                            </VListItemTitle>
                          </VListItem>
                          <VListItem>
                            <template #prepend>
                              <VIcon
                                icon="tabler-check"
                                size="18"
                              />
                            </template>
                            <VListItemTitle class="text-body-2">
                              {{ $t('legal.termsOfService.payment.upload.items.period') }}
                            </VListItemTitle>
                          </VListItem>
                          <VListItem>
                            <template #prepend>
                              <VIcon
                                icon="tabler-check"
                                size="18"
                              />
                            </template>
                            <VListItemTitle class="text-body-2">
                              {{ $t('legal.termsOfService.payment.upload.items.fraud') }}
                            </VListItemTitle>
                          </VListItem>
                        </VList>
                      </VCardText>
                    </VCard>
                  </VCol>
                  <VCol
                    cols="12"
                    md="6"
                  >
                    <VCard
                      variant="tonal"
                      color="info"
                    >
                      <VCardText>
                        <div class="d-flex align-center mb-4">
                          <VIcon
                            icon="tabler-info-circle"
                            size="28"
                            class="me-3"
                          />
                          <h4 class="text-h6">
                            {{ $t('legal.termsOfService.payment.disclaimer.title') }}
                          </h4>
                        </div>
                        <p class="text-body-2 mb-0">
                          {{ $t('legal.termsOfService.payment.disclaimer.message') }}
                        </p>
                      </VCardText>
                    </VCard>
                  </VCol>
                </VRow>
              </VCardText>
            </VCard>
          </section>

          <!-- Contact -->
          <section class="legal-section">
            <VCard
              elevation="4"
              color="success"
              class="text-white"
            >
              <VCardText>
                <div class="text-center py-12">
                  <VIcon
                    icon="tabler-message-circle-2"
                    size="72"
                    class="mb-6"
                    color="white"
                  />
                  <h2 class="text-h3 mb-4 text-white">
                    {{ $t('legal.termsOfService.contact.title') }}
                  </h2>
                  <p class="text-h6 mb-8 text-white font-weight-regular" style="opacity: 0.9;">
                    {{ $t('legal.termsOfService.contact.subtitle') }}
                  </p>
                  <VRow justify="center">
                    <VCol
                      cols="12"
                      sm="4"
                    >
                      <VBtn
                        href="mailto:legal@portun.app"
                        color="white"
                        size="large"
                        variant="elevated"
                        prepend-icon="tabler-file-text"
                        block
                      >
                        {{ $t('legal.termsOfService.contact.legal') }}
                      </VBtn>
                    </VCol>
                    <VCol
                      cols="12"
                      sm="4"
                    >
                      <VBtn
                        href="mailto:support@portun.app"
                        color="white"
                        size="large"
                        variant="elevated"
                        prepend-icon="tabler-lifebuoy"
                        block
                      >
                        {{ $t('legal.termsOfService.contact.support') }}
                      </VBtn>
                    </VCol>
                  </VRow>
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
  background: linear-gradient(135deg, rgba(var(--v-theme-success), 0.05) 0%, rgba(var(--v-theme-surface), 1) 100%);
  border-block-end: 1px solid rgba(var(--v-theme-success), 0.12);
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

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(var(--v-theme-primary), 0.12);
    }
  }
}
</style>
