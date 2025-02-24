import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify-reset-code',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './verify-reset-code.component.html',
  styleUrls: ['./verify-reset-code.component.css']
})
export class VerifyResetCodeComponent implements OnInit {
  verifyResetCodeForm!: FormGroup;
  message: string = '';
  errorMessage: string = '';
  token: string = '';
  email: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['token'];
    this.email = this.route.snapshot.queryParams['email'];
    this.verifyResetCodeForm = this.fb.group({
      resetCode: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.verifyResetCodeForm.invalid) {
      return;
    }

    const { resetCode } = this.verifyResetCodeForm.value;

    this.http.post('https://ecommerce.routemisr.com/api/v1/auth/verifyResetCode', { token: this.token, resetCode })
      .subscribe({
        next: (response: any) => {
          this.message = 'Reset code verified successfully.';
          this.errorMessage = '';
          this.router.navigate(['/reset-password'], { queryParams: { token: this.token } });
        },
        error: (error) => {
          this.errorMessage = 'Failed to verify reset code. Please try again.';
          this.message = '';
          console.error('Error:', error);
        }
      });
  }
}