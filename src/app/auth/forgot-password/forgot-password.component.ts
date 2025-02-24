import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  message: string = '';
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    const email = this.forgotPasswordForm.value.email;
    this.http.post('https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords', { email })
      .subscribe({
        next: (response: any) => {
          this.message = 'Password reset link has been sent to your email.';
          this.errorMessage = '';
          this.router.navigate(['/verify-reset-code'], { queryParams: { email } });
        },
        error: (error) => {
          this.errorMessage = 'Failed to send password reset link. Please try again.';
          this.message = '';
          console.error('Error:', error);
        }
      });
  }
}
