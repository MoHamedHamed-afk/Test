import { HeaderComponent } from './header/header.component'; 
import { FooterComponent } from './footer/footer.component'; 
import { RouterModule, RouterOutlet } from '@angular/router';
import { Component, OnInit , OnDestroy } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastService } from './services/toast.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    RouterOutlet,
    CommonModule,
    RouterModule
  ],
  template: `
    <div class="min-h-screen flex flex-col">
      <app-header></app-header>
      <main class="flex-1">
        <router-outlet></router-outlet>
        <div class="toast-container" *ngIf="showToast">
  {{ toastMessage }}
</div>
      </main>
      <app-footer></app-footer>
    </div>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  showToast = false;
  toastMessage = '';
  private toastSub!: Subscription;

  constructor(public authService: AuthService,
    private toastService: ToastService) {}

  ngOnInit(): void {
    this.toastSub = this.toastService.toast$.subscribe((message: string) => {
      this.toastMessage = message;
      this.showToast = true;
      // ToastTimer
      setTimeout(() => {
        this.showToast = false;
      }, 2000);
    });
  }

  ngOnDestroy(): void {
    if (this.toastSub) {
      this.toastSub.unsubscribe();
    }
  }
}