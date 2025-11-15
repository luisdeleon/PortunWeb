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
    errors.value.name = 'Full name is required'
    return false
  }
  if (name.value.trim().length < 3) {
    errors.value.name = 'Full name must be at least 3 characters'
    return false
  }
  errors.value.name = ''
  return true
}

const validateEmail = () => {
  if (!email.value.trim()) {
    errors.value.email = 'Email address is required'
    return false
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    errors.value.email = 'Please enter a valid email address'
    return false
  }
  errors.value.email = ''
  return true
}

const validatePricingPlan = () => {
  if (!pricingPlan.value) {
    errors.value.pricingPlan = 'Please select a community size'
    return false
  }
  errors.value.pricingPlan = ''
  return true
}

const validateMessage = () => {
  if (!message.value.trim()) {
    errors.value.message = 'Message cannot be blank'
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
  <VContainer id="contact-us">
    <!-- 👉 Headers  -->
    <div class="contact-us-section">
      <div class="headers d-flex justify-center flex-column align-center pb-16">
        <VChip
          label
          color="primary"
          class="mb-4"
          size="small"
        >
          Contact Us
        </VChip>
        <h4 class="d-flex align-center text-h4 mb-1 flex-wrap justify-center">
          <div class="position-relative me-2">
            <div class="section-title">
              Ready to secure
            </div>
          </div>
          your community?
        </h4>
        <p class="text-body-1 mb-0">
          Get a personalized demo or start your free trial today
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
                  <div class="d-flex justify-space-between flex-wrap gap-y-4">
                    <div
                      v-for="(item, index) in [
                        { title: 'Email', icon: 'tabler-mail', color: 'primary', value: 'example@gmail.com' },
                        { title: 'Phone', icon: 'tabler-phone-call', color: 'success', value: '+1234 568 963' },
                      ]"
                      :key="index"
                      class="d-flex gap-x-3 align-center"
                    >
                      <div>
                        <VAvatar
                          size="36"
                          :color="item.color"
                          variant="tonal"
                          class="rounded-sm"
                        >
                          <VIcon
                            :icon="item.icon"
                            size="24"
                          />
                        </VAvatar>
                      </div>

                      <div>
                        <div class="text-body-1">
                          {{ item .title }}
                        </div>
                        <h6 class="text-h6">
                          {{ item.value }}
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
                  Get Started Today
                </h4>
              </VCardItem>

              <VCardText>
                <p class="mb-6">
                  Tell us about your community and we'll help you choose the perfect plan. Whether you need a demo, have questions about pricing, or want to discuss custom requirements, our team is here to help.
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
                        Message received! We're on it!
                      </div>
                      <div class="text-body-2">
                        Your inquiry is safely in our inbox. We'll get back to you faster than a resident can scan their QR code - expect to hear from us within 24 hours at hello@portun.app
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
                        placeholder="John Doe"
                        label="Full Name"
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
                        placeholder="johndoe@gmail.com"
                        label="Email address"
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
                        label="Which plan interests you?"
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
                        placeholder="Write a message"
                        rows="3"
                        label="Message"
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
                        Send Inquiry
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
