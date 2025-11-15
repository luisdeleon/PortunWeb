<script setup lang="ts">
import { register } from 'swiper/element/bundle'

import avatar1 from '@images/avatars/avatar-1.png'
import avatar2 from '@images/avatars/avatar-2.png'
import avatar3 from '@images/avatars/avatar-3.png'
import avatar4 from '@images/avatars/avatar-4.png'
import avatar5 from '@images/avatars/avatar-5.png'

register()

// Community logos (text-based)
const communityLogos = [
  { name: 'Palm Gardens', location: 'Miami, FL' },
  { name: 'Residencial Las Palmas', location: 'Ciudad de México' },
  { name: 'Sunset Hills HOA', location: 'Austin, TX' },
  { name: 'Conjunto El Parque', location: 'Bogotá, Colombia' },
  { name: 'Los Jardines', location: 'Buenos Aires, Argentina' },
]

// Customer Review Data
const reviewData = [
  {
    desc: 'Portun transformed our visitor management. Creating QR codes takes 10 seconds, and guards validate instantly. No more phone calls at the gate!',
    community: 'Palm Gardens',
    rating: 5,
    name: 'Jennifer Martinez',
    position: 'HOA President, Miami Gardens FL',
    avatar: avatar1,
  },
  {
    desc: 'Finally, a payment tracking system that actually works. Residents upload receipts, I verify with one click. Saved me 15 hours per month!',
    community: 'Residencial Las Palmas',
    rating: 5,
    name: 'Carlos Hernández',
    position: 'Property Manager, Ciudad de México',
    avatar: avatar2,
  },
  {
    desc: 'The offline mode is a game-changer. Our internet goes down sometimes, but guards can still validate QR codes. Security never stops.',
    community: 'Conjunto El Parque',
    rating: 5,
    name: 'Sofia Rodríguez',
    position: 'Security Supervisor, Bogotá Colombia',
    avatar: avatar3,
  },
  {
    desc: 'We switched from Residentfy and cut our costs by 60%. Same features, better price. The transparent pricing sold me immediately.',
    community: 'Sunset Hills HOA',
    rating: 5,
    name: 'Michael Anderson',
    position: 'Board Member, Austin TX',
    avatar: avatar4,
  },
  {
    desc: 'I love getting real-time notifications when my visitors arrive. The photos give me peace of mind. Portun just works beautifully.',
    community: 'Residencial Las Palmas',
    rating: 5,
    name: 'María González',
    position: 'Resident, Guadalajara México',
    avatar: avatar5,
  },
  {
    desc: 'Setup was incredibly easy. We had 120 residents onboarded in one week. The WhatsApp sharing makes it simple for everyone.',
    community: 'Los Jardines',
    rating: 5,
    name: 'Juan Pablo Morales',
    position: 'Community Admin, Buenos Aires Argentina',
    avatar: avatar1,
  },
  {
    desc: 'As a guard, this app is so much better than paper logbooks. Scan the QR, take a photo, done. My shift is less stressful now.',
    community: 'Residencial Las Palmas',
    rating: 5,
    name: 'Diego Ramírez',
    position: 'Security Guard, Monterrey México',
    avatar: avatar2,
  },
  {
    desc: 'The admin dashboard shows me everything I need. Entry logs, pending payments, resident info - all in one place. Super efficient.',
    community: 'Conjunto El Parque',
    rating: 5,
    name: 'Ana Patricia Torres',
    position: 'Property Manager, Lima Perú',
    avatar: avatar3,
  },
  {
    desc: 'Payment verification used to take days. Now it takes minutes. Residents are happier, and our records are always up to date.',
    community: 'Sunset Hills HOA',
    rating: 5,
    name: 'Robert Chen',
    position: 'HOA Treasurer, Los Angeles CA',
    avatar: avatar4,
  },
  {
    desc: 'Portun\'s customer support is excellent. They helped us migrate from our old system in just two days. Highly recommend!',
    community: 'Palm Gardens',
    rating: 5,
    name: 'Camila Silva',
    position: 'Resident, São Paulo Brasil',
    avatar: avatar5,
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
    id="customer-review"
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
                Trusted by Communities
              </VChip>
              <div class="position-relative mb-1 me-2">
                <div class="section-title">
                  What people say
                </div>
              </div>
              <p class="text-body-1 mb-12">
                Real reviews from residents, property managers, and security guards across US and Latin America.
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
                          :image="data.avatar"
                          size="32"
                        />
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
        <!-- 👉 Community Logos Swiper  -->
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
              v-for="(community, index) in communityLogos"
              :key="index"
            >
              <div class="text-center py-2">
                <div class="d-flex align-center justify-center mb-1">
                  <VIcon
                    icon="tabler-building-community"
                    size="24"
                    color="primary"
                    class="me-2"
                  />
                  <span class="text-h6 font-weight-semibold">{{ community.name }}</span>
                </div>
                <div class="text-body-2 text-disabled">
                  {{ community.location }}
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
