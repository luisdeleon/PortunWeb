<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import sittingGirlWithLaptop from '@images/illustrations/sitting-girl-with-laptop.png'

const { t } = useI18n()

const faqKeys = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7']
</script>

<template>
  <div id="faq">
    <VContainer>
      <!-- 👉 Header  -->
      <div class="faq-section">
        <div class="headers d-flex justify-center flex-column align-center">
          <VChip
            label
            color="primary"
            size="small"
            class="mb-4"
          >
            {{ $t('landing.faq.chip') }}
          </VChip>
          <h4 class="d-flex align-center text-h4 mb-1 flex-wrap justify-center">
            {{ $t('landing.faq.title') }}
            <div class="position-relative ms-2">
              <div class="section-title">
                {{ $t('landing.faq.subtitle') }}
              </div>
            </div>
          </h4>
          <p class="text-body-1 mb-0">
            {{ $t('landing.faq.description') }}
          </p>
        </div>
        <VRow>
          <VCol
            cols="12"
            md="5"
          >
            <div class="pt-10 d-flex align-center justify-center h-100">
              <VImg
                :src="sittingGirlWithLaptop"
                height="330"
                width="330"
              />
            </div>
          </VCol>
          <VCol
            cols="12"
            md="7"
          >
            <VExpansionPanels class="pt-16">
              <VExpansionPanel
                v-for="faqKey in faqKeys"
                :key="faqKey"
              >
                <VExpansionPanelTitle>
                  {{ $t(`landing.faq.questions.${faqKey}.question`) }}
                </VExpansionPanelTitle>
                <VExpansionPanelText>
                  {{ $t(`landing.faq.questions.${faqKey}.answer`) }}
                </VExpansionPanelText>
              </VExpansionPanel>
            </VExpansionPanels>
          </VCol>
        </VRow>
      </div>
    </VContainer>
  </div>
</template>

<style lang="scss" scoped>
.faq-section {
  margin-block: 5.25rem;
}

@media (max-width: 600px) {
  .faq-section {
    margin-block: 4rem;
  }
}

#faq {
  border-radius: 3.75rem 3.75rem 0 0;
  background-color: rgba(var(--v-theme-background));
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
  font-weight: 800;
  inline-size: 130%;
  inset-block-end: 12%;
  inset-inline-start: -12%;
}
</style>
