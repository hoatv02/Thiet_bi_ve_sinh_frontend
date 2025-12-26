import { Routes } from '@angular/router';
import { LayoutPageComponent } from './layout/layout-page/layout-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { AdminGuard } from './guards/admin.guard';
import { AdminLayoutComponent } from './pages/admin/admin-layout/admin-layout.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { AdminUsersComponent } from './pages/admin/admin-users/admin-users.component';
import { AdminEventsComponent } from './pages/admin/admin-events/admin-events.component';
import { AdminCategoryComponent } from './pages/admin/admin-category/admin-category.component';
import { AdminProductComponent } from './pages/admin/admin-product/admin-product.component';
import { ProductCreateComponent } from './pages/admin/admin-product/product-create/product-create.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { DetailProductComponent } from './pages/detail-product/detail-product.component';
import { MyServiceComponent } from './pages/my-service/my-service.component';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { CheckoutPageComponent } from './pages/check-out/check-out.component';
import { ListProductComponent } from './pages/list-product/list-product.component';
import { AdminBrandComponent } from './pages/admin/admin-brand/admin-brand.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { AuthComponent } from './pages/auth/auth.component';
import { ResetPasswordComponent } from './pages/auth/reset-password/reset-password.component';
import { LogoutComponent } from './pages/auth/logout/logout.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { AdminBinComponent } from './pages/admin/admin-bin/admin-bin.component';
import { ProductUpdateComponent } from './pages/admin/admin-product/product-update/product-update.component';
import { AdminOrderComponent } from './pages/admin/admin-order/admin-order.component';
import { AdminTypeComponent } from './pages/admin/admin-type/admin-type.component';
import { PolicyComponent } from './pages/policy/policy.component';
import { ServiceComponent } from './pages/service/service.component';
import { AdminBannerComponent } from './pages/admin/admin-banner/admin-banner.component';
import { ViewedProductsComponent } from './pages/viewed-products/viewed-products.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutPageComponent,
    children: [
      { path: '', component: HomePageComponent },
      { path: 'about-us', component: AboutUsComponent },
      { path: 'detail-product/:slug', component: DetailProductComponent },
      { path: 'my-service', component: MyServiceComponent },
      { path: 'service', component: ServiceComponent },
      { path: 'policy', component: PolicyComponent },
      { path: 'cart', component: CartPageComponent },
      { path: 'checkout', component: CheckoutPageComponent },
      { path: 'list-product/:type-name', component: ListProductComponent },
      { path: 'viewed-products', component: ViewedProductsComponent },
      { path: 'list-product/:type-name/:category-name', component: ListProductComponent },
    ]
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AdminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: AdminUsersComponent },
      { path: 'events', component: AdminEventsComponent },
      { path: 'order', component: AdminOrderComponent },
      { path: 'brand', component: AdminBrandComponent },
      { path: 'type', component: AdminTypeComponent },
      { path: 'category', component: AdminCategoryComponent },
      { path: 'product', component: AdminProductComponent },
      { path: 'bin', component: AdminBinComponent },
      { path: 'banner', component: AdminBannerComponent },
      { path: 'product-create', component: ProductCreateComponent },
      { path: 'product-update/:id', component: ProductUpdateComponent },
    ],
  },
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'logout', component: LogoutComponent },
      { path: 'signup', component: SignupComponent },
      { path: 'reset-password', component: ResetPasswordComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ]
  },
  { path: '**', redirectTo: '' }
];