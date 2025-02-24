import { Component } from '@angular/core';
import { BrandsComponent } from './brands/brands.component';
import { CategoriesComponent } from './categories/categories.component';
import { HomeComponent } from './home/home.component';
import { Routes } from '@angular/router';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { CartComponent } from './cart/cart.component';
import { PaymentComponent } from './payment/payment.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { ProductsComponent } from './products/products.component';
import { AuthGuard } from './guards/auth.guard'; 
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { VerifyResetCodeComponent } from './auth/verify-reset-code/verify-reset-code.component';
export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'categories', component: CategoriesComponent },
    { path: 'brands', component: BrandsComponent },
    { path: 'products', component: ProductsComponent },
    { path: 'product/:id', component: ProductDetailsComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
    { path: 'payment', component: PaymentComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'verify-reset-code', component: VerifyResetCodeComponent },
    {
      path: 'wishlist',
      component: WishlistComponent,
      canActivate: [AuthGuard]
    },
    { path: 'product-details/:id', component: ProductDetailsComponent }
  ];
