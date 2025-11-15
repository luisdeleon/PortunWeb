<script setup lang="ts">
import type { I18nLanguage } from '@layouts/types'
import { themeConfig } from '@themeConfig'

const { locale } = useI18n({ useScope: 'global' })

const languages = computed(() => themeConfig.app.i18n.langConfig || [])
</script>

<template>
  <IconBtn color="rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity))">
    <VIcon icon="tabler-language" />

    <VTooltip
      activator="parent"
      open-delay="1000"
      scroll-strategy="close"
    >
      <span class="text-capitalize">{{ languages.find(lang => lang.i18nLang === locale)?.label }}</span>
    </VTooltip>

    <VMenu
      activator="parent"
      offset="12px"
      :width="175"
    >
      <VList
        :selected="[locale]"
        color="primary"
      >
        <VListItem
          v-for="lang in languages"
          :key="lang.i18nLang"
          :value="lang.i18nLang"
          @click="locale = lang.i18nLang"
        >
          <VListItemTitle>
            {{ lang.label }}
          </VListItemTitle>
        </VListItem>
      </VList>
    </VMenu>
  </IconBtn>
</template>
