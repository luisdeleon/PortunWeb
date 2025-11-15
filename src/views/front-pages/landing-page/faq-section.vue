<script setup lang="ts">
import boyWithLogo from '@images/front-pages/landing-page/faq-boy-with-logos.png'

const faqData = [
  {
    question: 'How does the QR code access control system work?',
    answer: 'Residents create QR codes through the mobile app for their visitors. When the visitor arrives at the gate, the security guard scans the QR code, which is validated in real-time against our secure database. The system verifies the code is active, not expired, and within entry limits. Entry is logged automatically with photos and timestamps, and residents receive instant notifications when their visitors arrive.',
  },
  {
    question: 'What do visitors need to enter the community?',
    answer: 'Visitors simply need to show the QR code they received via WhatsApp, SMS, or email to the security guard. No app installation is required on the visitor side - the QR code works as a simple image. Guards scan it in seconds, and visitors are on their way. This creates a fast, professional entry experience that takes less than 30 seconds from arrival to gate opening.',
  },
  {
    question: 'How long does it take to get started?',
    answer: 'You can be up and running in less than 24 hours. Start with our 30-day free trial - no credit card required. We provide dedicated onboarding support for Professional and Enterprise plans, including CSV bulk import of your existing resident data, guard training materials, and live setup assistance to ensure a smooth transition.',
  },
  {
    question: 'Can residents track their HOA payments through the app?',
    answer: 'Yes! Residents can upload payment receipts directly through the app with automatic photo compression. Admins receive notifications to verify payments, and residents can view their complete payment history with status indicators (verified, pending, or rejected). This eliminates manual tracking and reduces administrative overhead.',
  },
  {
    question: 'Is my community data secure?',
    answer: 'Absolutely. We use bank-level encryption for all data transmission and storage. QR codes are validated server-side to prevent tampering, all entry logs are encrypted, and payment receipts are hashed for integrity verification. Our infrastructure is hosted on enterprise-grade servers with automatic backups and 99.9% uptime guarantee.',
  },
  {
    question: 'Can I manage multiple properties from one account?',
    answer: 'Yes! Our Professional and Enterprise plans include multi-community management. You can switch between properties from a single dashboard, view consolidated reports across all communities, and manage residents, guards, and payments for each property independently while maintaining centralized oversight.',
  },
  {
    question: 'Does this work with my existing gates and access control hardware?',
    answer: 'Absolutely! Our system integrates seamlessly with your current infrastructure - no expensive gate replacements needed. We support most major gate manufacturers including LiftMaster, DoorKing, BFT, Nice, Came, FAAC, Linear, and Viking, plus any gate controller with network connectivity. When a QR code is validated, our system can automatically trigger your existing gates and doors to open. Our technical team will help configure the integration during onboarding at no extra cost.',
  },
]
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
            FAQ
          </VChip>
          <h4 class="d-flex align-center text-h4 mb-1 flex-wrap justify-center">
            Frequently Asked
            <div class="position-relative ms-2">
              <div class="section-title">
                questions
              </div>
            </div>
          </h4>
          <p class="text-body-1 mb-0">
            Browse through these FAQs to find answers to commonly asked questions.
          </p>
        </div>
        <VRow>
          <VCol
            cols="12"
            md="5"
          >
            <div class="pt-10 d-flex align-center justify-center h-100">
              <VImg
                :src="boyWithLogo"
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
                v-for="faq in faqData"
                :key="faq.question"
              >
                <VExpansionPanelTitle>
                  {{ faq.question }}
                </VExpansionPanelTitle>
                <VExpansionPanelText>
                  {{ faq.answer }}
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
