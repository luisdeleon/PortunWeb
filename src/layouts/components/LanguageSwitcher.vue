<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale } = useI18n({ useScope: 'global' })

const languages = [
  {
    name: 'English',
    code: 'en',
    icon: 'twemoji:flag-united-states',
  },
  {
    name: 'Español',
    code: 'es',
    icon: 'twemoji:flag-spain',
  },
  {
    name: 'Português',
    code: 'pt',
    icon: 'twemoji:flag-brazil',
  },
]

const selectedLanguage = computed(() => languages.find(lang => lang.code === locale.value))
</script>

<template>
  <IconBtn color="rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity))">
    <VIcon :icon="selectedLanguage?.icon || 'twemoji:flag-united-states'" />

    <VTooltip
      activator="parent"
      open-delay="1000"
      scroll-strategy="close"
    >
      <span>{{ selectedLanguage?.name }}</span>
    </VTooltip>

    <VMenu
      activator="parent"
      offset="12px"
      :width="180"
    >
      <VList
        v-model:selected="locale"
        mandatory
      >
        <VListItem
          v-for="lang in languages"
          :key="lang.code"
          :value="lang.code"
          :prepend-icon="lang.icon"
          color="primary"
          @click="() => { locale = lang.code }"
        >
          <VListItemTitle>
            {{ lang.name }}
          </VListItemTitle>
        </VListItem>
      </VList>
    </VMenu>
  </IconBtn>
</template>
