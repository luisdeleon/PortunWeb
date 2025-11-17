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

const sections = [
  { title: 'legal.termsAndConditions.sections.introduction', icon: 'tabler-info-circle', id: 'intro' },
  { title: 'legal.termsAndConditions.sections.definitions', icon: 'tabler-book', id: 'definitions' },
  { title: 'legal.termsAndConditions.sections.eligibility', icon: 'tabler-user-check', id: 'eligibility' },
  { title: 'legal.termsAndConditions.sections.account', icon: 'tabler-shield-lock', id: 'account' },
  { title: 'legal.termsAndConditions.sections.service', icon: 'tabler-apps', id: 'service' },
  { title: 'legal.termsAndConditions.sections.responsibilities', icon: 'tabler-users', id: 'responsibilities' },
  { title: 'legal.termsAndConditions.sections.payment', icon: 'tabler-credit-card', id: 'payment' },
  { title: 'legal.termsAndConditions.sections.ip', icon: 'tabler-copyright', id: 'ip' },
  { title: 'legal.termsAndConditions.sections.content', icon: 'tabler-upload', id: 'content' },
  { title: 'legal.termsAndConditions.sections.privacy', icon: 'tabler-lock', id: 'privacy' },
  { title: 'legal.termsAndConditions.sections.thirdParty', icon: 'tabler-plug', id: 'third-party' },
  { title: 'legal.termsAndConditions.sections.disclaimers', icon: 'tabler-alert-triangle', id: 'disclaimers' },
  { title: 'legal.termsAndConditions.sections.liability', icon: 'tabler-scale', id: 'liability' },
  { title: 'legal.termsAndConditions.sections.indemnification', icon: 'tabler-gavel', id: 'indemnification' },
  { title: 'legal.termsAndConditions.sections.termination', icon: 'tabler-x-circle', id: 'termination' },
  { title: 'legal.termsAndConditions.sections.dispute', icon: 'tabler-message-circle-2', id: 'dispute' },
  { title: 'legal.termsAndConditions.sections.law', icon: 'tabler-building-bank', id: 'law' },
  { title: 'legal.termsAndConditions.sections.changes', icon: 'tabler-refresh', id: 'changes' },
  { title: 'legal.termsAndConditions.sections.contact', icon: 'tabler-mail', id: 'contact' },
]

const eligibilityRequirements = [
  { icon: 'tabler-calendar-check', text: 'legal.termsAndConditions.content.eligibility.requirements.age' },
  { icon: 'tabler-check', text: 'legal.termsAndConditions.content.eligibility.requirements.capacity' },
  { icon: 'tabler-alert-circle', text: 'legal.termsAndConditions.content.eligibility.requirements.lawful' },
  { icon: 'tabler-file-check', text: 'legal.termsAndConditions.content.eligibility.requirements.accuracy' },
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
            color="primary"
            class="mb-6"
            size="small"
          >
            {{ $t('legal.termsAndConditions.chip') }}
          </VChip>
          <div class="d-flex justify-center align-center mb-6">
            <VIcon
              icon="tabler-file-text"
              size="48"
              color="primary"
              class="me-4"
            />
            <h1 class="text-h3 text-primary">
              {{ $t('legal.termsAndConditions.title') }}
            </h1>
          </div>
          <p class="text-body-1 text-medium-emphasis mb-2">
            {{ $t('legal.lastUpdated') }}: {{ new Date().toLocaleDateString($i18n.locale, { year: 'numeric', month: 'long', day: 'numeric' }) }}
          </p>
          <p class="text-body-2 text-medium-emphasis">
            {{ $t('legal.termsAndConditions.subtitle') }}
          </p>
        </div>
      </VContainer>
    </div>

    <VContainer class="legal-content">
      <VRow>
        <!-- Sidebar Navigation -->
        <VCol
          cols="12"
          md="3"
          class="d-none d-md-block"
        >
          <VCard
            class="sticky-nav"
            elevation="2"
          >
            <VCardText>
              <div class="text-caption text-medium-emphasis mb-3">
                {{ $t('legal.termsAndConditions.navigation') }}
              </div>
              <VList density="compact">
                <VListItem
                  v-for="section in sections"
                  :key="section.id"
                  :to="{ hash: `#${section.id}` }"
                  class="nav-item"
                >
                  <template #prepend>
                    <VIcon
                      :icon="section.icon"
                      size="20"
                      class="me-3"
                    />
                  </template>
                  <VListItemTitle class="text-body-2">
                    {{ $t(section.title) }}
                  </VListItemTitle>
                </VListItem>
              </VList>
            </VCardText>
          </VCard>
        </VCol>

        <!-- Main Content -->
        <VCol
          cols="12"
          md="9"
        >
          <!-- Introduction -->
          <section
            id="intro"
            class="legal-section mb-8"
          >
            <VCard elevation="0">
              <VCardText>
                <div class="d-flex align-center mb-6">
                  <VAvatar
                    color="primary"
                    variant="tonal"
                    size="48"
                    class="me-4"
                  >
                    <VIcon
                      icon="tabler-info-circle"
                      size="28"
                    />
                  </VAvatar>
                  <h2 class="text-h4">
                    1. {{ $t('legal.termsAndConditions.sections.introduction') }}
                  </h2>
                </div>
                <p class="text-body-1 mb-4">
                  {{ $t('legal.termsAndConditions.content.introduction.text') }}
                </p>
                <VAlert
                  color="info"
                  variant="tonal"
                  class="mb-4"
                >
                  <div class="d-flex align-center">
                    <VIcon
                      icon="tabler-bulb"
                      class="me-3"
                    />
                    <div>
                      {{ $t('legal.termsAndConditions.content.introduction.agreement') }}
                    </div>
                  </div>
                </VAlert>
              </VCardText>
            </VCard>
          </section>

          <!-- Definitions -->
          <section
            id="definitions"
            class="legal-section mb-8"
          >
            <VCard elevation="0">
              <VCardText>
                <div class="d-flex align-center mb-6">
                  <VAvatar
                    color="primary"
                    variant="tonal"
                    size="48"
                    class="me-4"
                  >
                    <VIcon
                      icon="tabler-book"
                      size="28"
                    />
                  </VAvatar>
                  <h2 class="text-h4">
                    2. {{ $t('legal.termsAndConditions.sections.definitions') }}
                  </h2>
                </div>
                <VList>
                  <VListItem>
                    <template #prepend>
                      <VIcon
                        icon="tabler-chevron-right"
                        color="primary"
                      />
                    </template>
                    <VListItemTitle class="font-weight-bold">
                      {{ $t('legal.termsAndConditions.content.definitions.service.title') }}
                    </VListItemTitle>
                    <VListItemSubtitle class="mt-1">
                      {{ $t('legal.termsAndConditions.content.definitions.service.description') }}
                    </VListItemSubtitle>
                  </VListItem>
                  <VListItem>
                    <template #prepend>
                      <VIcon
                        icon="tabler-chevron-right"
                        color="primary"
                      />
                    </template>
                    <VListItemTitle class="font-weight-bold">
                      {{ $t('legal.termsAndConditions.content.definitions.user.title') }}
                    </VListItemTitle>
                    <VListItemSubtitle class="mt-1">
                      {{ $t('legal.termsAndConditions.content.definitions.user.description') }}
                    </VListItemSubtitle>
                  </VListItem>
                  <VListItem>
                    <template #prepend>
                      <VIcon
                        icon="tabler-chevron-right"
                        color="primary"
                      />
                    </template>
                    <VListItemTitle class="font-weight-bold">
                      {{ $t('legal.termsAndConditions.content.definitions.community.title') }}
                    </VListItemTitle>
                    <VListItemSubtitle class="mt-1">
                      {{ $t('legal.termsAndConditions.content.definitions.community.description') }}
                    </VListItemSubtitle>
                  </VListItem>
                  <VListItem>
                    <template #prepend>
                      <VIcon
                        icon="tabler-chevron-right"
                        color="primary"
                      />
                    </template>
                    <VListItemTitle class="font-weight-bold">
                      {{ $t('legal.termsAndConditions.content.definitions.resident.title') }}
                    </VListItemTitle>
                    <VListItemSubtitle class="mt-1">
                      {{ $t('legal.termsAndConditions.content.definitions.resident.description') }}
                    </VListItemSubtitle>
                  </VListItem>
                  <VListItem>
                    <template #prepend>
                      <VIcon
                        icon="tabler-chevron-right"
                        color="primary"
                      />
                    </template>
                    <VListItemTitle class="font-weight-bold">
                      {{ $t('legal.termsAndConditions.content.definitions.administrator.title') }}
                    </VListItemTitle>
                    <VListItemSubtitle class="mt-1">
                      {{ $t('legal.termsAndConditions.content.definitions.administrator.description') }}
                    </VListItemSubtitle>
                  </VListItem>
                  <VListItem>
                    <template #prepend>
                      <VIcon
                        icon="tabler-chevron-right"
                        color="primary"
                      />
                    </template>
                    <VListItemTitle class="font-weight-bold">
                      {{ $t('legal.termsAndConditions.content.definitions.guard.title') }}
                    </VListItemTitle>
                    <VListItemSubtitle class="mt-1">
                      {{ $t('legal.termsAndConditions.content.definitions.guard.description') }}
                    </VListItemSubtitle>
                  </VListItem>
                </VList>
              </VCardText>
            </VCard>
          </section>

          <!-- Eligibility -->
          <section
            id="eligibility"
            class="legal-section mb-8"
          >
            <VCard elevation="0">
              <VCardText>
                <div class="d-flex align-center mb-6">
                  <VAvatar
                    color="success"
                    variant="tonal"
                    size="48"
                    class="me-4"
                  >
                    <VIcon
                      icon="tabler-user-check"
                      size="28"
                    />
                  </VAvatar>
                  <h2 class="text-h4">
                    3. {{ $t('legal.termsAndConditions.sections.eligibility') }}
                  </h2>
                </div>
                <p class="text-body-1 mb-4">
                  {{ $t('legal.termsAndConditions.content.eligibility.intro') }}
                </p>
                <VRow>
                  <VCol
                    v-for="(item, index) in eligibilityRequirements"
                    :key="index"
                    cols="12"
                    sm="6"
                  >
                    <div class="d-flex align-start">
                      <VIcon
                        :icon="item.icon"
                        color="success"
                        class="mt-1 me-3"
                      />
                      <div class="text-body-1">
                        {{ $t(item.text) }}
                      </div>
                    </div>
                  </VCol>
                </VRow>
              </VCardText>
            </VCard>
          </section>

          <!-- Account & Security -->
          <section
            id="account"
            class="legal-section mb-8"
          >
            <VCard elevation="0">
              <VCardText>
                <div class="d-flex align-center mb-6">
                  <VAvatar
                    color="warning"
                    variant="tonal"
                    size="48"
                    class="me-4"
                  >
                    <VIcon
                      icon="tabler-shield-lock"
                      size="28"
                    />
                  </VAvatar>
                  <h2 class="text-h4">
                    4. {{ $t('legal.termsAndConditions.sections.account') }}
                  </h2>
                </div>
                <p class="text-body-1 mb-4">
                  {{ $t('legal.termsAndConditions.content.account.intro') }}
                </p>
                <VExpansionPanels>
                  <VExpansionPanel>
                    <VExpansionPanelTitle>
                      <VIcon
                        icon="tabler-user-plus"
                        class="me-3"
                      />
                      {{ $t('legal.termsAndConditions.content.account.registration.title') }}
                    </VExpansionPanelTitle>
                    <VExpansionPanelText>
                      <ul class="mt-4">
                        <li class="mb-2">
                          {{ $t('legal.termsAndConditions.content.account.registration.items.accurate') }}
                        </li>
                        <li class="mb-2">
                          {{ $t('legal.termsAndConditions.content.account.registration.items.maintain') }}
                        </li>
                        <li class="mb-2">
                          {{ $t('legal.termsAndConditions.content.account.registration.items.security') }}
                        </li>
                        <li class="mb-2">
                          {{ $t('legal.termsAndConditions.content.account.registration.items.responsibility') }}
                        </li>
                        <li>{{ $t('legal.termsAndConditions.content.account.registration.items.notify') }}</li>
                      </ul>
                    </VExpansionPanelText>
                  </VExpansionPanel>
                  <VExpansionPanel>
                    <VExpansionPanelTitle>
                      <VIcon
                        icon="tabler-lock"
                        class="me-3"
                      />
                      {{ $t('legal.termsAndConditions.content.account.suspension.title') }}
                    </VExpansionPanelTitle>
                    <VExpansionPanelText>
                      <VAlert
                        color="warning"
                        variant="tonal"
                        class="mt-4"
                      >
                        {{ $t('legal.termsAndConditions.content.account.suspension.warning') }}
                      </VAlert>
                    </VExpansionPanelText>
                  </VExpansionPanel>
                </VExpansionPanels>
              </VCardText>
            </VCard>
          </section>

          <!-- Continue with simplified cards for remaining sections -->
          <VCard
            v-for="(section, idx) in sections.slice(4, -1)"
            :id="section.id"
            :key="section.id"
            elevation="0"
            class="legal-section mb-8"
          >
            <VCardText>
              <div class="d-flex align-center mb-4">
                <VAvatar
                  :color="idx % 3 === 0 ? 'primary' : idx % 3 === 1 ? 'success' : 'info'"
                  variant="tonal"
                  size="48"
                  class="me-4"
                >
                  <VIcon
                    :icon="section.icon"
                    size="28"
                  />
                </VAvatar>
                <h2 class="text-h4">
                  {{ idx + 5 }}. {{ $t(section.title) }}
                </h2>
              </div>
              <div class="text-body-1">
                <!-- Content continues here based on section... -->
                <p class="mb-4">
                  {{ $t('legal.termsAndConditions.content.generic.description', { section: $t(section.title).toLowerCase() }) }}
                </p>
                <VAlert
                  color="info"
                  variant="tonal"
                  density="compact"
                >
                  <div class="d-flex align-center">
                    <VIcon
                      icon="tabler-info-circle"
                      size="20"
                      class="me-2"
                    />
                    <span class="text-body-2">{{ $t('legal.termsAndConditions.content.generic.alert', { section: $t(section.title).toLowerCase() }) }}</span>
                  </div>
                </VAlert>
              </div>
            </VCardText>
          </VCard>

          <!-- Contact Section -->
          <section
            id="contact"
            class="legal-section"
          >
            <VCard
              elevation="2"
              color="primary"
              class="text-white"
            >
              <VCardText>
                <div class="text-center py-8">
                  <VIcon
                    icon="tabler-mail"
                    size="64"
                    class="mb-4"
                    color="white"
                  />
                  <h2 class="text-h4 mb-4 text-white">
                    {{ $t('legal.termsAndConditions.contactSection.title') }}
                  </h2>
                  <p class="text-body-1 mb-6 text-white" style="opacity: 0.9;">
                    {{ $t('legal.termsAndConditions.contactSection.description') }}
                  </p>
                  <VRow justify="center">
                    <VCol
                      cols="12"
                      sm="4"
                    >
                      <VBtn
                        href="mailto:legal@portun.app"
                        color="white"
                        variant="elevated"
                        prepend-icon="tabler-mail"
                        block
                      >
                        {{ $t('legal.termsAndConditions.contactSection.legal') }}
                      </VBtn>
                    </VCol>
                    <VCol
                      cols="12"
                      sm="4"
                    >
                      <VBtn
                        href="mailto:support@portun.app"
                        color="white"
                        variant="elevated"
                        prepend-icon="tabler-help"
                        block
                      >
                        {{ $t('legal.termsAndConditions.contactSection.support') }}
                      </VBtn>
                    </VCol>
                  </VRow>
                  <p class="text-body-2 mt-6 text-white" style="opacity: 0.75;">
                    {{ $t('legal.termsAndConditions.content.footer') }}
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
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.05) 0%, rgba(var(--v-theme-surface), 1) 100%);
  border-block-end: 1px solid rgba(var(--v-theme-primary), 0.12);
}

.legal-content {
  padding-block: 4rem;
  min-block-size: 100vh;
}

.sticky-nav {
  position: sticky;
  inset-block-start: 100px;
  max-block-size: calc(100vh - 120px);
  overflow-y: auto;
}

.nav-item {
  border-radius: 8px;
  margin-block-end: 4px;

  &:hover {
    background-color: rgba(var(--v-theme-primary), 0.08);
  }
}

.legal-section {
  scroll-margin-top: 100px;

  .v-card {
    border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
    transition: all 0.3s ease;

    &:hover {
      border-color: rgba(var(--v-theme-primary), 0.24);
      box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.08);
    }
  }
}
</style>
