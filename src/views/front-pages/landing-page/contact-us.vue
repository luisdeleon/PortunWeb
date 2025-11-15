<script setup lang="ts">
import ConnectImg from '@images/front-pages/landing-page/contact-customer-service.png'

const name = ref('')
const email = ref('')
const message = ref('')
const pricingPlan = ref('')
const isLoading = ref(false)
const submitted = ref(false)

// Validation errors
const errors = ref({
  name: '',
  email: '',
  pricingPlan: '',
  message: '',
})

// Validation messages
const validationMessages = {
  nameRequired: () => $t('landing.contact.validation.nameRequired'),
  nameMinLength: () => $t('landing.contact.validation.nameMinLength'),
  emailRequired: () => $t('landing.contact.validation.emailRequired'),
  emailInvalid: () => $t('landing.contact.validation.emailInvalid'),
  planRequired: () => $t('landing.contact.validation.planRequired'),
  messageRequired: () => $t('landing.contact.validation.messageRequired'),
}

const pricingPlans = [
  { title: 'Starter', value: 'Starter' },
  { title: 'Professional', value: 'Professional' },
  { title: 'Enterprise', value: 'Enterprise' },
]

// Load selected plan from pricing section
onMounted(() => {
  const selectedPlan = sessionStorage.getItem('selectedPricingPlan')
  if (selectedPlan) {
    pricingPlan.value = selectedPlan
    sessionStorage.removeItem('selectedPricingPlan')
  }
})

// Validation functions
const validateName = () => {
  if (!name.value.trim()) {
    errors.value.name = validationMessages.nameRequired()
    return false
  }
  if (name.value.trim().length < 3) {
    errors.value.name = validationMessages.nameMinLength()
    return false
  }
  errors.value.name = ''
  return true
}

const validateEmail = () => {
  if (!email.value.trim()) {
    errors.value.email = validationMessages.emailRequired()
    return false
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    errors.value.email = validationMessages.emailInvalid()
    return false
  }
  errors.value.email = ''
  return true
}

const validatePricingPlan = () => {
  if (!pricingPlan.value) {
    errors.value.pricingPlan = validationMessages.planRequired()
    return false
  }
  errors.value.pricingPlan = ''
  return true
}

const validateMessage = () => {
  if (!message.value.trim()) {
    errors.value.message = validationMessages.messageRequired()
    return false
  }
  errors.value.message = ''
  return true
}

const validateForm = () => {
  const isNameValid = validateName()
  const isEmailValid = validateEmail()
  const isPlanValid = validatePricingPlan()
  const isMessageValid = validateMessage()

  return isNameValid && isEmailValid && isPlanValid && isMessageValid
}

const submitForm = async () => {
  if (!validateForm()) {
    return
  }

  isLoading.value = true
  try {
    // Call Supabase Edge Function to send email via AWS SES
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    const response = await fetch(`${supabaseUrl}/functions/v1/portun-web-send-contact-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        message: message.value,
        pricingPlan: pricingPlan.value,
      }),
    })

    if (response.ok) {
      submitted.value = true
      // Reset form
      name.value = ''
      email.value = ''
      message.value = ''
      pricingPlan.value = ''
      errors.value = { name: '', email: '', pricingPlan: '', message: '' }

      // Clear success message after 5 seconds
      setTimeout(() => {
        submitted.value = false
      }, 5000)
    } else {
      console.error('Failed to send email')
    }
  } catch (error) {
    console.error('Error sending email:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <VContainer id="contact">
    <!-- 👉 Headers  -->
    <div class="contact-us-section">
      <div class="headers d-flex justify-center flex-column align-center pb-16">
        <VChip
          label
          color="primary"
          class="mb-4"
          size="small"
        >
          {{ $t('landing.contact.chip') }}
        </VChip>
        <h4 class="d-flex align-center text-h4 mb-1 flex-wrap justify-center">
          <div class="position-relative me-2">
            <div class="section-title">
              {{ $t('landing.contact.title1') }}
            </div>
          </div>
          {{ $t('landing.contact.title2') }}
        </h4>
        <p class="text-body-1 mb-0">
          {{ $t('landing.contact.subtitle') }}
        </p>
      </div>

      <div class="mb-15">
        <VRow class="match-height">
          <VCol
            cols="12"
            md="5"
          >
            <div class="contact-card h-100">
              <VCard
                variant="outlined"
                border
                class="pa-2"
                :style="{ borderRadius: '3.75rem 0.375rem 0.375rem 0.375rem' }"
              >
                <VImg
                  :src="ConnectImg"
                  :style="{ borderRadius: '3.75rem 0.375rem 0.375rem 0.375rem' }"
                />
                <VCardText class="pa-4 pb-1">
                  <div class="d-flex justify-center">
                    <div class="d-flex gap-x-3 align-center">
                      <div>
                        <VAvatar
                          size="36"
                          color="primary"
                          variant="tonal"
                          class="rounded-sm"
                        >
                          <VIcon
                            icon="tabler-mail"
                            size="24"
                          />
                        </VAvatar>
                      </div>

                      <div>
                        <div class="text-body-1">
                          {{ $t('landing.contact.email') }}
                        </div>
                        <h6 class="text-h6">
                          hello@portun.app
                        </h6>
                      </div>
                    </div>
                  </div>
                </VCardText>
              </VCard>
            </div>
          </VCol>

          <VCol
            cols="12"
            md="7"
          >
            <VCard>
              <VCardItem class="pb-0">
                <h4 class="text-h4 mb-1">
                  {{ $t('landing.contact.formTitle') }}
                </h4>
              </VCardItem>

              <VCardText>
                <p class="mb-6">
                  {{ $t('landing.contact.formDescription') }}
                </p>

                <VAlert
                  v-if="submitted"
                  type="success"
                  class="mb-6"
                  closable
                  variant="tonal"
                >
                  <div class="d-flex align-center gap-2">
                    <VIcon icon="tabler-circle-check" size="24" />
                    <div>
                      <div class="text-h6 mb-1">
                        {{ $t('landing.contact.successTitle') }}
                      </div>
                      <div class="text-body-2">
                        {{ $t('landing.contact.successMessage') }}
                      </div>
                    </div>
                  </div>
                </VAlert>

                <VForm @submit.prevent="submitForm">
                  <VRow>
                    <VCol
                      cols="12"
                      md="6"
                    >
                      <AppTextField
                        v-model="name"
                        :placeholder="$t('landing.contact.namePlaceholder')"
                        :label="$t('landing.contact.fullName')"
                        :error-messages="errors.name"
                        @blur="validateName"
                        @input="errors.name = ''"
                      />
                    </VCol>

                    <VCol
                      cols="12"
                      md="6"
                    >
                      <AppTextField
                        v-model="email"
                        :placeholder="$t('landing.contact.emailPlaceholder')"
                        :label="$t('landing.contact.emailLabel')"
                        type="email"
                        :error-messages="errors.email"
                        @blur="validateEmail"
                        @input="errors.email = ''"
                      />
                    </VCol>

                    <VCol
                      cols="12"
                      md="6"
                    >
                      <AppSelect
                        v-model="pricingPlan"
                        :label="$t('landing.contact.planLabel')"
                        :items="pricingPlans"
                        item-title="title"
                        item-value="value"
                        :error-messages="errors.pricingPlan"
                        @blur="validatePricingPlan"
                        @update:model-value="errors.pricingPlan = ''"
                      />
                    </VCol>

                    <VCol cols="12">
                      <AppTextarea
                        v-model="message"
                        :placeholder="$t('landing.contact.messagePlaceholder')"
                        rows="3"
                        :label="$t('landing.contact.messageLabel')"
                        :error-messages="errors.message"
                        @blur="validateMessage"
                        @input="errors.message = ''"
                      />
                    </VCol>

                    <VCol>
                      <VBtn
                        type="submit"
                        :loading="isLoading"
                        :disabled="isLoading"
                      >
                        {{ $t('landing.contact.submitButton') }}
                      </VBtn>
                    </VCol>
                  </VRow>
                </VForm>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </div>
    </div>
  </VContainer>
</template>

<style lang="scss" scoped>
.contact-us-section {
  margin-block: 5.25rem;
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
  inline-size: 120%;
  inset-block-end: 12%;
  inset-inline-start: -12%;
}

.contact-card {
  position: relative;
}

.contact-card::before {
  position: absolute;
  content: url("@images/front-pages/icons/contact-border.png");
  inset-block-start: -2.5rem;
  inset-inline-start: -2.5rem;
}

@media screen and (max-width: 999px) {
  .contact-card::before {
    display: none;
  }
}
</style>
