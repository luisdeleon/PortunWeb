<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'
import type { RouteLocationRaw } from 'vue-router/auto'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { useDisplay } from 'vuetify'
import { useI18n } from 'vue-i18n'
import navImg from '@images/front-pages/misc/nav-item-col-img.png'

import LanguageSwitcher from '@/layouts/components/LanguageSwitcher.vue'
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'

const props = defineProps({
  activeId: String,
})

const display = useDisplay()
const { locale } = useI18n()

interface navItem {
  name: string
  to: RouteLocationRaw
}

interface MenuItem {
  listTitle: string
  listIcon: string
  navItems: navItem[]
}
const { y } = useWindowScroll()

const route = useRoute()
const router = useRouter()

const sidebar = ref(false)

// CMD Portal URL with language parameter
const cmdPortalUrl = computed(() => `https://cmd.portun.app?lang=${locale.value}`)

watch(() => display, () => {
  return display.mdAndUp ? sidebar.value = false : sidebar.value
}, { deep: true })

const isMenuOpen = ref(false)
const isMegaMenuOpen = ref(false)

const menuItems: MenuItem[] = [
  {
    listTitle: 'Page',
    listIcon: 'tabler-layout-grid',
    navItems: [
      { name: 'Pricing', to: { name: 'front-pages-pricing' } },
      { name: 'Payment', to: { name: 'front-pages-payment' } },
      { name: 'Checkout', to: { name: 'front-pages-checkout' } },
      { name: 'Help Center', to: { name: 'front-pages-help-center' } },
    ],
  },
  {
    listTitle: 'Auth Demo',
    listIcon: 'tabler-lock-open',
    navItems: [
      { name: 'Login (Basic)', to: { name: 'pages-authentication-login-v1' } },
      { name: 'Login (Cover)', to: { name: 'pages-authentication-login-v2' } },
      { name: 'Register (Basic)', to: { name: 'pages-authentication-register-v1' } },
      { name: 'Register (Cover)', to: { name: 'pages-authentication-register-v2' } },
      { name: 'Register (Multi-steps)', to: { name: 'pages-authentication-register-multi-steps' } },
      { name: 'Forgot Password (Basic)', to: { name: 'pages-authentication-forgot-password-v1' } },
      { name: 'Forgot Password (Cover)', to: { name: 'pages-authentication-forgot-password-v2' } },
      { name: 'Reset Password (Basic)', to: { name: 'pages-authentication-reset-password-v1' } },
      { name: 'Reset Password (cover  )', to: { name: 'pages-authentication-reset-password-v2' } },
    ],
  },
  {
    listTitle: 'Other',
    listIcon: 'tabler-photo',
    navItems: [
      { name: 'Under Maintenance', to: { name: 'pages-misc-under-maintenance' } },
      { name: 'Coming Soon', to: { name: 'pages-misc-coming-soon' } },
      { name: 'Not Authorized', to: { path: '/not-authorized' } },
      { name: 'Verify Email (Basic)', to: { name: 'pages-authentication-verify-email-v1' } },
      { name: 'Verify Email (Cover)', to: { name: 'pages-authentication-verify-email-v2' } },
      { name: 'Two Steps (Basic)', to: { name: 'pages-authentication-two-steps-v1' } },
      { name: 'Two Steps (Cover)', to: { name: 'pages-authentication-two-steps-v2' } },
    ],
  },
]

const isCurrentRoute = (to: RouteLocationRaw) => {
  return route.matched.some(_route => _route.path.startsWith(router.resolve(to).path))

  // ℹ️ Below is much accurate approach if you don't have any nested routes
  // return route.matched.some(_route => _route.path === router.resolve(to).path)
}

const isPageActive = computed(() => menuItems.some(item => item.navItems.some(listItem => isCurrentRoute(listItem.to))))
</script>

<template>
  <!-- 👉 Navigation drawer for mobile devices  -->
  <VNavigationDrawer
    v-model="sidebar"
    width="275"
    data-allow-mismatch
    disable-resize-watcher
  >
    <PerfectScrollbar
      :options="{ wheelPropagation: false }"
      class="h-100"
    >
      <!-- Nav items -->
      <div>
        <div class="d-flex flex-column gap-y-4 pa-4">
          <RouterLink
            v-for="(item, index) in ['home', 'features', 'reviews', 'pricing', 'faq', 'contact']"
            :key="index"
            :to="{ path: '/', hash: `#${item}` }"
            class="nav-link font-weight-medium"
            :class="[props.activeId === item ? 'active-link' : '']"
          >
            {{ $t(`landing.nav.${item}`) }}
          </RouterLink>
        </div>
      </div>

      <!-- Navigation drawer close icon -->
      <VIcon
        id="navigation-drawer-close-btn"
        icon="tabler-x"
        size="20"
        @click="sidebar = !sidebar"
      />
    </PerfectScrollbar>
  </VNavigationDrawer>

  <!-- 👉 Navbar for desktop devices  -->
  <div class="front-page-navbar">
    <div class="front-page-navbar">
      <VAppBar
        :color="$vuetify.theme.current.dark ? 'rgba(var(--v-theme-surface),0.38)' : 'rgba(var(--v-theme-surface), 0.38)'"
        :class="y > 10 ? 'app-bar-scrolled' : [$vuetify.theme.current.dark ? 'app-bar-dark' : 'app-bar-light', 'elevation-0']"
        class="navbar-blur"
      >
        <!-- toggle icon for mobile device -->
        <IconBtn
          id="vertical-nav-toggle-btn"
          class="ms-n3 me-2 d-inline-block d-md-none"
          @click="sidebar = !sidebar"
        >
          <VIcon
            size="26"
            icon="tabler-menu-2"
            color="rgba(var(--v-theme-on-surface))"
          />
        </IconBtn>
        <!-- Title and Landing page sections -->
        <div class="d-flex align-center">
          <VAppBarTitle class="me-6">
            <RouterLink
              to="/"
              class="d-flex gap-x-4"
              :class="$vuetify.display.mdAndUp ? 'd-none' : 'd-block'"
            >
              <div class="app-logo">
                <VNodeRenderer :nodes="themeConfig.app.logo" />
                <h1 class="app-logo-title">
                  {{ themeConfig.app.title }}
                </h1>
              </div>
            </RouterLink>
          </VAppBarTitle>

          <!-- landing page sections -->
          <div class="text-base align-center d-none d-md-flex">
            <RouterLink
              v-for="(item, index) in ['home', 'features', 'reviews', 'pricing', 'faq', 'contact']"
              :key="index"
              :to="{ path: '/', hash: `#${item}` }"
              class="nav-link font-weight-medium py-2 px-2 px-lg-4"
              :class="[props.activeId === item ? 'active-link' : '']"
            >
              {{ $t(`landing.nav.${item}`) }}
            </RouterLink>
          </div>
        </div>

        <VSpacer />

        <div class="d-flex gap-x-4">
          <LanguageSwitcher />
          <NavbarThemeSwitcher />

          <VBtn
            v-if="$vuetify.display.lgAndUp"
            prepend-icon="tabler-login-2"
            variant="elevated"
            color="primary"
            :href="cmdPortalUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ $t('landing.nav.cmdPortal') }}
          </VBtn>

          <VBtn
            v-else
            rounded
            icon
            variant="elevated"
            color="primary"
            :href="cmdPortalUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            <VIcon icon="tabler-login-2" />
          </VBtn>
        </div>
      </VAppBar>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.nav-menu {
  display: flex;
  gap: 2rem;
}

.nav-link {
  &:not(:hover) {
    color: rgb(var(--v-theme-on-surface));
  }
}

.page-link {
  &:hover {
    color: rgb(var(--v-theme-primary)) !important;
  }
}

@media (max-width: 1280px) {
  .nav-menu {
    gap: 2.25rem;
  }
}

@media (min-width: 1920px) {
  .front-page-navbar {
    .v-toolbar {
      max-inline-size: calc(1440px - 32px);
    }
  }
}

@media (min-width: 1280px) and (max-width: 1919px) {
  .front-page-navbar {
    .v-toolbar {
      max-inline-size: calc(1200px - 32px);
    }
  }
}

@media (min-width: 960px) and (max-width: 1279px) {
  .front-page-navbar {
    .v-toolbar {
      max-inline-size: calc(900px - 32px);
    }
  }
}

@media (min-width: 600px) and (max-width: 959px) {
  .front-page-navbar {
    .v-toolbar {
      max-inline-size: calc(100% - 64px);
    }
  }
}

@media (max-width: 600px) {
  .front-page-navbar {
    .v-toolbar {
      max-inline-size: calc(100% - 32px);
    }
  }
}

.nav-item-img {
  border: 10px solid rgb(var(--v-theme-background));
  border-radius: 10px;
}

.active-link {
  color: rgb(var(--v-theme-primary)) !important;
}

.app-bar-light {
  border: 2px solid rgba(var(--v-theme-surface), 68%);
  border-radius: 0.5rem;
  background-color: rgba(var(--v-theme-surface), 38%);
  transition: all 0.1s ease-in-out;
}

.app-bar-dark {
  border: 2px solid rgba(var(--v-theme-surface), 68%);
  border-radius: 0.5rem;
  background-color: rgba(255, 255, 255, 4%);
  transition: all 0.1s ease-in-out;
}

.app-bar-scrolled {
  border: 2px solid rgb(var(--v-theme-surface));
  border-radius: 0.5rem;
  background-color: rgb(var(--v-theme-surface)) !important;
  transition: all 0.1s ease-in-out;
}

.front-page-navbar::after {
  position: fixed;
  z-index: 2;
  backdrop-filter: saturate(100%) blur(6px);
  block-size: 5rem;
  content: "";
  inline-size: 100%;
}
</style>

<style lang="scss">
@use "@layouts/styles/mixins" as layoutMixins;

.mega-menu {
  position: fixed !important;
  inset-block-start: 5.4rem;
  inset-inline-start: 50%;
  transform: translateX(-50%);

  @include layoutMixins.rtl {
    transform: translateX(50%);
  }
}

.front-page-navbar {
  .v-toolbar__content {
    padding-inline: 30px !important;
  }

  .v-toolbar {
    inset-inline: 0 !important;
    margin-block-start: 1rem !important;
    margin-inline: auto !important;
  }
}

.mega-menu-item {
  &:hover {
    color: rgb(var(--v-theme-primary)) !important;
  }
}

#navigation-drawer-close-btn {
  position: absolute;
  cursor: pointer;
  inset-block-start: 0.5rem;
  inset-inline-end: 1rem;
}
</style>
