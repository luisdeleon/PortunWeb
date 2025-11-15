# PortunWeb Development Rules

## Theme & Design Rules

### CRITICAL: DO NOT MODIFY THEME CONFIGURATION
- **NEVER** modify `themeConfig.ts` without explicit approval
- **NEVER** change the existing Vuexy theme design, colors, or layout
- **NEVER** alter the theme configuration in `/src/plugins/vuetify/theme.ts`
- **NEVER** modify the existing SVG logo or loading screen design
- Maintain the current theme settings:
  - ContentWidth: Boxed
  - Navigation: Vertical (AppContentLayoutNav.Vertical)
  - Navbar Type: Sticky with blur
  - Footer Type: Static
  - Skin: Default
  - Theme: System (light/dark mode support)

### Design Consistency
- Follow Vuetify 3 component patterns and Material Design principles
- Use existing Vuexy component library from `@core` when available
- Maintain consistent spacing, colors, and typography as defined in theme
- Use Tabler icons (`tabler-*`) as primary icon set
- Preserve the loader design and animation in `public/loader.css` and `index.html`

## Technology Stack Rules

### Vue 3 Composition API
- **ALWAYS** use Composition API with `<script setup>` syntax
- **NEVER** use Options API unless working with legacy code
- Use TypeScript for all new components and composables
- Leverage auto-imports from `unplugin-auto-import` and `unplugin-vue-components`

### State Management (Pinia)
- Use Pinia stores for global state management
- Define stores in `src/stores/` directory
- Use composition store syntax with `defineStore`
- Keep store logic separate from component logic

### Routing
- Use Vue Router 4 with typed routes (see `typed-router.d.ts`)
- Define routes in `src/plugins/1.router/` directory
- Use route guards in `src/plugins/1.router/guards.ts` for authentication/authorization
- Leverage unplugin-vue-router for file-based routing

### API Communication
- Use the `useApi` composable from `src/composables/useApi.ts`
- Leverage `ofetch` for HTTP requests
- Handle errors consistently across the application
- Use MSW (Mock Service Worker) for API mocking during development

### Internationalization (i18n)
- Support multiple languages as configured: English (en), French (fr), Arabic (ar)
- Use vue-i18n for translations
- Add translation keys to appropriate locale files
- Test RTL support for Arabic language
- Default locale: English (en)

## Code Style & Quality Rules

### TypeScript
- **ALWAYS** use TypeScript for new files
- Define proper types and interfaces
- Avoid `any` type - use `unknown` or proper types
- Use type inference where possible but be explicit when clarity is needed
- Maintain type definitions in `.d.ts` files when appropriate

### ESLint Rules
- Follow the project's ESLint configuration (`.eslintrc.cjs`)
- Run `pnpm lint` before committing
- Use Airbnb base configuration as foundation
- Follow import resolver rules for TypeScript
- Adhere to Vue ESLint plugin recommendations
- Use SonarJS rules for code quality
- Follow unicorn plugin best practices

### Stylelint Rules
- Follow `.stylelintrc.json` configuration
- Use SCSS for styling when needed
- Follow BEM or logical naming conventions
- Maintain idiomatic CSS property order
- Use Vuetify's built-in classes first before custom styles

### File & Folder Structure
- Keep components modular and single-responsibility
- Place reusable components in appropriate directories
- Use composables for shared logic (`src/composables/`)
- Keep plugins organized in `src/plugins/`
- Maintain clear separation of concerns

## Component Development Rules

### Vuetify Components
- Use Vuetify 3 components as primary UI library
- Follow Vuetify's prop conventions and event handling
- Use `v-` prefix components (VBtn, VCard, VTextField, etc.)
- Leverage Vuetify's grid system and breakpoints
- Use Vuetify defaults from `src/plugins/vuetify/defaults.ts`

### Component Best Practices
- Keep components focused and composable
- Use props for parent-child communication
- Emit events for child-parent communication
- Use provide/inject for deep component trees when appropriate
- Implement proper TypeScript prop types with `defineProps<T>()`
- Use `defineEmits<T>()` for typed event emissions

### Performance
- Use `v-memo` for expensive render operations
- Implement virtual scrolling for long lists
- Lazy load routes and heavy components
- Optimize images and assets
- Use Vue 3 Suspense for async components

## Security Rules

### Authentication & Authorization
- Use CASL for ability-based access control
- Implement route guards for protected pages
- Store JWT tokens securely (httpOnly cookies preferred)
- Never expose sensitive data in client-side code
- Validate user permissions before showing UI elements

### Data Handling
- Sanitize user inputs
- Use proper CORS configuration
- Implement CSRF protection
- Follow OWASP security best practices
- Never commit sensitive data (.env files excluded via .gitignore)

## Git & Version Control Rules

### Commits
- Write clear, descriptive commit messages
- Follow conventional commits format when possible
- Keep commits atomic and focused
- Never commit node_modules or build artifacts
- Respect `.gitignore` and `.gitattributes` configurations

### Branches
- Use feature branches for new development
- Keep main/master branch stable
- Review code before merging
- Delete merged branches

## Build & Deployment Rules

### Development
- Use `pnpm dev` for local development
- Hot module replacement (HMR) should work seamlessly
- Test on multiple browsers and devices
- Use Vue DevTools for debugging

### Production
- Run `pnpm build` to create production bundle
- Run `pnpm typecheck` to verify TypeScript types
- Ensure no console errors or warnings
- Test production build with `pnpm preview`
- Optimize bundle size and lazy load when possible

### Docker
- Use `dev.Dockerfile` for development environment
- Use `prod.Dockerfile` for production builds
- Follow docker-compose configurations
- Maintain nginx.conf for production server

## Testing Rules

### Quality Assurance
- Test responsive design at all breakpoints
- Verify dark/light theme switching works correctly
- Test internationalization with all supported languages
- Validate form inputs and error handling
- Test navigation and routing
- Verify API integration and error states

### Browser Compatibility
- Support modern browsers (last 2 versions)
- Test on Chrome, Firefox, Safari, and Edge
- Ensure mobile responsiveness
- Test touch interactions on mobile devices

## Dependencies & Updates

### Package Management
- Use `pnpm` as package manager
- Keep dependencies up to date (security patches)
- Review breaking changes before major updates
- Test thoroughly after dependency updates
- Maintain lock file (`pnpm-lock.yaml`)

### Icons
- Run `pnpm build:icons` after adding new Iconify icons
- Use Tabler icons as primary set
- Use MDI or Font Awesome icons sparingly
- Keep icon usage consistent

## Documentation Rules

### Code Comments
- Document complex logic and algorithms
- Explain "why" not "what" in comments
- Keep comments up to date with code changes
- Use JSDoc for functions and components when appropriate

### README & Docs
- Keep README.md updated with setup instructions
- Document environment variables in `.env.example`
- Maintain changelog for significant changes
- Document API integrations and configurations

## Forbidden Actions

### Never Do These
1. **NEVER** modify the core theme configuration without approval
2. **NEVER** commit `.env` files or sensitive credentials
3. **NEVER** use `any` type in TypeScript without justification
4. **NEVER** bypass ESLint/TypeScript errors with disable comments without good reason
5. **NEVER** modify `node_modules` directly
6. **NEVER** commit large binary files or assets
7. **NEVER** disable security features or authentication
8. **NEVER** use deprecated Vue 2 patterns or Options API for new code
9. **NEVER** hardcode API URLs or configuration (use environment variables)
10. **NEVER** ignore build warnings or TypeScript errors

## Questions & Support

When uncertain about implementation:
1. Review existing codebase for patterns
2. Check Vuexy documentation
3. Consult Vue 3 and Vuetify 3 official docs
4. Ask for clarification before making significant changes
5. Discuss architectural decisions with team

---

**Last Updated**: 2025-11-14
**Project**: PortunWeb (Vuexy Vue.js Admin Template)
**Version**: 9.5.0
