<script setup lang="ts">
import { register } from 'swiper/element/bundle'

register()

// Integration platforms - showing Portun works seamlessly with popular guest invitation platforms
const integrationPlatforms = [
  { name: 'Airbnb', icon: 'tabler-brand-airbnb', description: 'Vacation Rentals' },
  { name: 'Vrbo', icon: 'tabler-home-share', description: 'Holiday Rentals' },
  { name: 'Booking.com', icon: 'tabler-calendar-check', description: 'Travel Bookings' },
  { name: 'WhatsApp', icon: 'tabler-brand-whatsapp', description: 'Instant Messaging' },
  { name: 'Email', icon: 'tabler-mail', description: 'Email Sharing' },
]

// Customer Review Data
const reviewData = [
  {
    desc: 'Portun transformed our visitor management. Creating QR codes takes 10 seconds, and guards validate instantly. No more phone calls at the gate!',
    community: 'Palm Gardens',
    rating: 5,
    name: 'Jennifer Martinez',
    initials: 'JM',
    position: 'HOA President, Miami Gardens FL',
    color: 'primary',
  },
  {
    desc: 'Finally, a payment tracking system that actually works. Residents upload receipts, I verify with one click. Saved me 15 hours per month!',
    community: 'Residencial Las Palmas',
    rating: 5,
    name: 'Carlos Hernández',
    initials: 'CH',
    position: 'Property Manager, Ciudad de México',
    color: 'success',
  },
  {
    desc: 'The offline mode is a game-changer. Our internet goes down sometimes, but guards can still validate QR codes. Security never stops.',
    community: 'Conjunto El Parque',
    rating: 5,
    name: 'Sofia Rodríguez',
    initials: 'SR',
    position: 'Security Supervisor, Bogotá Colombia',
    color: 'warning',
  },
  {
    desc: 'We switched from Residentfy and cut our costs by 60%. Same features, better price. The transparent pricing sold me immediately.',
    community: 'Sunset Hills HOA',
    rating: 5,
    name: 'Michael Anderson',
    initials: 'MA',
    position: 'Board Member, Austin TX',
    color: 'info',
  },
  {
    desc: 'I love getting real-time notifications when my visitors arrive. The photos give me peace of mind. Portun just works beautifully.',
    community: 'Residencial Las Palmas',
    rating: 5,
    name: 'María González',
    initials: 'MG',
    position: 'Resident, Guadalajara México',
    color: 'error',
  },
  {
    desc: 'Setup was incredibly easy. We had 120 residents onboarded in one week. The WhatsApp sharing makes it simple for everyone.',
    community: 'Los Jardines',
    rating: 5,
    name: 'Juan Pablo Morales',
    initials: 'JPM',
    position: 'Community Admin, Buenos Aires Argentina',
    color: 'secondary',
  },
  {
    desc: 'As a guard, this app is so much better than paper logbooks. Scan the QR, take a photo, done. My shift is less stressful now.',
    community: 'Residencial Las Palmas',
    rating: 5,
    name: 'Diego Ramírez',
    initials: 'DR',
    position: 'Security Guard, Monterrey México',
    color: 'primary',
  },
  {
    desc: 'The admin dashboard shows me everything I need. Entry logs, pending payments, resident info - all in one place. Super efficient.',
    community: 'Conjunto El Parque',
    rating: 5,
    name: 'Ana Patricia Torres',
    initials: 'APT',
    position: 'Property Manager, Lima Perú',
    color: 'success',
  },
  {
    desc: 'Payment verification used to take days. Now it takes minutes. Residents are happier, and our records are always up to date.',
    community: 'Sunset Hills HOA',
    rating: 5,
    name: 'Robert Chen',
    initials: 'RC',
    position: 'HOA Treasurer, Los Angeles CA',
    color: 'info',
  },
  {
    desc: 'Portun\'s customer support is excellent. They helped us migrate from our old system in just two days. Highly recommend!',
    community: 'Palm Gardens',
    rating: 5,
    name: 'Camila Silva',
    initials: 'CS',
    position: 'Resident, São Paulo Brasil',
    color: 'warning',
  },
]

const customerReviewSwiper = ref<any>(null)

const slide = (dir: string) => {
  const swiper = customerReviewSwiper.value?.swiper

  if (dir === 'prev')
    swiper.slidePrev()

  swiper.slideNext()
}
</script>

<template>
  <div
    id="reviews"
    class="position-relative"
  >
    <div class="customer-reviews">
      <VContainer>
        <!-- 👉 Headers  -->
        <VRow>
          <VCol
            cols="12"
            md="3"
          >
            <div
              class="headers d-flex justify-center flex-column align-start h-100"
              style="max-inline-size: 275px;"
            >
              <VChip
                label
                color="primary"
                class="mb-4"
                size="small"
              >
                {{ $t('landing.reviews.chip') }}
              </VChip>
              <div class="position-relative mb-1 me-2">
                <div class="section-title">
                  {{ $t('landing.reviews.title') }}
                </div>
              </div>
              <p class="text-body-1 mb-12">
                {{ $t('landing.reviews.subtitle') }}
              </p>
              <div class="position-relative">
                <IconBtn
                  class="reviews-button-prev rounded me-4"
                  variant="tonal"
                  color="primary"
                  @click="slide('prev')"
                >
                  <VIcon
                    icon="tabler-chevron-left"
                    class="flip-in-rtl"
                  />
                </IconBtn>

                <IconBtn
                  class="reviews-button-next rounded"
                  variant="tonal"
                  color="primary"
                  @click="slide('next')"
                >
                  <VIcon
                    icon="tabler-chevron-right"
                    class="flip-in-rtl"
                  />
                </IconBtn>
              </div>
            </div>
          </VCol>

          <VCol
            cols="12"
            md="9"
          >
            <!-- 👉 Customer Review Swiper -->
            <div class="swiper-reviews-carousel">
              <!-- eslint-disable vue/attribute-hyphenation -->
              <swiper-container
                ref="customerReviewSwiper"
                slides-per-view="1"
                space-between="20"
                loop="true"
                autoplay-delay="3000"
                autoplay-disable-on-interaction="false"
                events-prefix="swiper-"
                :injectStyles="[
                  `
                    .swiper{
                      padding-block: 12px;
                      padding-inline: 12px;
                      margin-inline: -12px;
                    }
                    .swiper-button-next, .swiper-button-prev{
                      visibility: hidden;
                    }
                  `,
                ]"
                navigation="{
                  nextEl: '.swiper-button-next',
                  prevEl: '.swiper-button-prev',
                }"
                :breakpoints="{
                  1280: {
                    slidesPerView: 3,
                    spaceBetween: 20,
                  },
                  960: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                  600: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                }"
              >
                <swiper-slide
                  v-for="(data, index) in reviewData"
                  :key="index"
                >
                  <VCard class="d-flex h-100 align-stretch">
                    <VCardText class="pa-6 d-flex flex-column justify-space-between align-start">
                      <div class="community-logo mb-3">
                        <VIcon
                          icon="tabler-building-community"
                          size="20"
                          color="primary"
                          class="me-2"
                        />
                        <span class="text-primary font-weight-semibold">{{ data.community }}</span>
                      </div>
                      <p class="text-body-1">
                        {{ data.desc }}
                      </p>

                      <VRating
                        :model-value="data.rating"
                        color="warning"
                        density="compact"
                        class="mb-4"
                        readonly
                      />
                      <div class="d-flex align-center gap-x-3">
                        <VAvatar
                          :color="data.color"
                          size="32"
                        >
                          <span class="text-sm font-weight-semibold">{{ data.initials }}</span>
                        </VAvatar>
                        <div>
                          <h6 class="text-h6">
                            {{ data.name }}
                          </h6>

                          <div class="text-body-2 text-disabled">
                            {{ data.position }}
                          </div>
                        </div>
                      </div>
                    </VCardText>
                  </VCard>
                </swiper-slide>
              </swiper-container>
            </div>
          </VCol>
        </VRow>
      </VContainer>

      <VDivider class="w-100 swiper-divider" />

      <VContainer>
        <!-- 👉 Integration Header  -->
        <div class="text-center mb-8">
          <h5 class="text-h5 font-weight-semibold mb-2">
            {{ $t('landing.reviews.integration.title') }}
          </h5>
          <p class="text-body-1 text-medium-emphasis">
            {{ $t('landing.reviews.integration.subtitle') }}
          </p>
        </div>

        <!-- 👉 Integration Platforms Swiper  -->
        <div class="swiper-brands-carousel">
          <swiper-container
            slides-per-view="2"
            :space-between="10"
            events-prefix="swiper-"
            :autoplay="{
              delay: 3000,
              disableOnInteraction: true,
            }"
            :breakpoints="{
              992: {
                slidesPerView: 5,
              },
              768: {
                slidesPerView: 3,
              },
            }"
          >
            <swiper-slide
              v-for="(platform, index) in integrationPlatforms"
              :key="index"
            >
              <div class="text-center py-4">
                <div class="d-flex flex-column align-center justify-center">
                  <VIcon
                    :icon="platform.icon"
                    size="40"
                    color="primary"
                    class="mb-3"
                  />
                  <span class="text-h6 font-weight-semibold mb-1">{{ platform.name }}</span>
                  <div class="text-caption text-disabled">
                    {{ platform.description }}
                  </div>
                </div>
              </div>
            </swiper-slide>
          </swiper-container>
        </div>
      </VContainer>
    </div>
  </div>
</template>

<style lang="scss">
@use "swiper/css/bundle";

swiper-container::part(bullet-active) {
  border-radius: 6px;
  background-color: rgba(var(--v-theme-on-background), var(--v-disabled-opacity));
  inline-size: 38px;
}

swiper-container::part(bullet) {
  background-color: rgba(var(--v-theme-on-background));
}

.swiper-divider {
  margin-block: 72px 1rem;
}

.swiper-reviews-carousel {
  swiper-container {
    .swiper {
      padding-block-end: 3rem;
    }

    .swiper-button-next {
      display: none;
    }
  }

  swiper-slide {
    block-size: auto;
    opacity: 1;
  }
}
</style>

<style lang="scss" scoped>
.customer-reviews {
  padding-block: 72px 84px;
}

@media (max-width: 600px) {
  .customer-reviews {
    padding-block: 4rem;
  }
}

#customer-review {
  border-radius: 3.75rem 3.75rem 0 0;
  background-color: rgb(var(--v-theme-background));
}

.section-title {
  font-size: 24px;
  font-weight: 800;
  line-height: 36px;
}

.section-title::after {
  position: absolute;
  background: url("../../../assets/images/front-pages/icons/section-title-icon.png") no-repeat left bottom/contain;
  background-size: contain;
  block-size: 100%;
  content: "";
  font-weight: 800;
  inline-size: 120%;
  inset-block-end: 0;
  inset-inline-start: -12%;
}

.community-logo {
  display: flex;
  align-items: center;
  min-block-size: 1.375rem;
}
</style>
