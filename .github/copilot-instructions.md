# Runhub - Angular E-commerce Frontend

## Project Overview
Runhub is an Angular 17 standalone application for an e-commerce platform specializing in plumbing products. It features user authentication, product catalog, shopping cart, admin dashboard, and order management. The app integrates with a backend API at `https://server.ntn.asia/api` and uses local storage for session management.

## Architecture
- **Standalone Components**: All components use Angular's standalone architecture with explicit imports (e.g., `imports: [FormsModule, LucideAngularModule, CommonModule, RouterLink]` in `DetailProductComponent`).
- **Routing Structure**: Public pages under `LayoutPageComponent`, admin routes protected by `AdminGuard` under `AdminLayoutComponent`. Auth routes in a separate layout.
- **Service Layer**: Services extend `BaseService` for API calls. Auth handled via `AuthService` with localStorage for tokens/users.
- **Data Flow**: Components inject services for data fetching. Guards control access. Models define TypeScript interfaces for API payloads.
- **UI Framework**: ng-zorro-antd for components, Tailwind CSS for styling, Lucide Angular for icons.

## Key Patterns
- **API Integration**: Use `BaseService.httpPost()` for POST requests, `httpGet()` for GET. API endpoints are relative paths (e.g., `'auth/login'`). Environment-specific API root in `src/environments/environment.ts`.
- **Authentication**: Check login status with `AuthService.isLoggedIn()`. Store user/token in localStorage. Guards redirect unauthenticated users.
- **Product Handling**: Products have variants (e.g., different SKUs/prices). Cart items include variant details. Use slugs for product URLs (e.g., `/detail-product/:slug`).
- **Admin Features**: CRUD operations for products, categories, brands, orders. Dashboard with charts using ApexCharts.
- **Loading States**: Use `LoadingService` for overlays during API calls.

## Developer Workflows
- **Development Server**: Run `npm start` (ng serve) to start at `http://localhost:4200/`. Auto-reloads on changes.
- **Building**: `npm run build` for production build in `dist/runhub/`. Includes hashing and budgets.
- **Testing**: `npm test` runs Karma/Jasmine unit tests. No e2e tests configured.
- **Code Generation**: Use `ng generate component|service|guard` etc. Prefix is `app`.
- **Dependencies**: Install with `npm install`. Key libs: ng-zorro-antd, Tailwind, CKEditor for admin forms.

## Conventions
- **Component Structure**: Each component in its own folder with `.ts`, `.html`, `.css`, `.spec.ts`. Use `selector: 'app-[name]'`.
- **Service Injection**: Inject services in constructors. Use `providedIn: 'root'` for singletons.
- **Models**: Define interfaces in `src/app/models/` for API requests/responses (e.g., `PagedProductRequest`).
- **Styling**: Combine Tailwind classes with component-specific CSS. Less for themes (`src/theme.less`).
- **Error Handling**: Basic; use RxJS observables. No global error interceptor shown.
- **Naming**: CamelCase for components/services, kebab-case for selectors/files.

## Integration Points
- **Backend API**: RESTful API for auth, products, cart, orders. Base URL configurable per environment.
- **External Libraries**: ng-zorro-antd modals/tables, ApexCharts for analytics, Swiper for carousels, ngx-toastr for notifications.
- **Assets**: Static images in `src/assets/`. Brand assets in `src/assets/brand/`.

Reference files: `src/app/app.routes.ts` (routing), `src/app/services/auth.service.ts` (auth pattern), `src/environments/environment.ts` (config), `src/app/pages/detail-product/detail-product.component.ts` (component example).