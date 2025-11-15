import { setupWorker } from 'msw/browser'

// Handlers
import { handlerAppBarSearch } from '@db/app-bar-search/index'
import { handlerAppsAcademy } from '@db/apps/academy/index'
import { handlerAppsCalendar } from '@db/apps/calendar/index'
import { handlerAppsChat } from '@db/apps/chat/index'
import { handlerAppsEcommerce } from '@db/apps/ecommerce/index'
import { handlerAppsEmail } from '@db/apps/email/index'
import { handlerAppsInvoice } from '@db/apps/invoice/index'
import { handlerAppsKanban } from '@db/apps/kanban/index'
import { handlerAppLogistics } from '@db/apps/logistics/index'
import { handlerAppsPermission } from '@db/apps/permission/index'
import { handlerAppsUsers } from '@db/apps/users/index'
import { handlerAuth } from '@db/auth/index'
import { handlerDashboard } from '@db/dashboard/index'
import { handlerPagesDatatable } from '@db/pages/datatable/index'
import { handlerPagesFaq } from '@db/pages/faq/index'
import { handlerPagesHelpCenter } from '@db/pages/help-center/index'
import { handlerPagesProfile } from '@db/pages/profile/index'

const worker = setupWorker(
  ...handlerAppsEcommerce,
  ...handlerAppsAcademy,
  ...handlerAppsInvoice,
  ...handlerAppsUsers,
  ...handlerAppsEmail,
  ...handlerAppsCalendar,
  ...handlerAppsChat,
  ...handlerAppsPermission,
  ...handlerPagesHelpCenter,
  ...handlerPagesProfile,
  ...handlerPagesFaq,
  ...handlerPagesDatatable,
  ...handlerAppBarSearch,
  ...handlerAppLogistics,
  ...handlerAuth,
  ...handlerAppsKanban,
  ...handlerDashboard,
)

export default function () {
  // MSW temporarily disabled to fix page loading issue
  // TODO: Re-enable and debug service worker initialization
  console.log('MSW is currently disabled')

  /*
  const workerUrl = `${import.meta.env.BASE_URL ?? '/'}mockServiceWorker.js`

  // Only enable MSW in development
  if (import.meta.env.DEV) {
    worker.start({
      serviceWorker: {
        url: workerUrl,
      },
      onUnhandledRequest(request, print) {
        // Ignore Vite internal requests (HMR, modules, etc.)
        const url = new URL(request.url)

        // Skip Vite internal paths
        if (
          url.pathname.includes('node_modules') ||
          url.pathname.includes('@vite') ||
          url.pathname.includes('__vite') ||
          url.searchParams.has('v') // Vite version query param
        ) {
          return // Silently bypass
        }

        // For other unhandled requests, use default bypass behavior
        print.warning()
      },
    }).catch((error) => {
      console.error('Failed to start MSW:', error)
    })
  }
  */
}
