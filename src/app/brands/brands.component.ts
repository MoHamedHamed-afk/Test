import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.css']
})
export class BrandsComponent implements OnInit {
  brands: any[] = [];
  loading = true;
  error = false;
  selectedBrand: any = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadBrands();
  }

  private loadBrands() {
    this.apiService.getBrands().subscribe({
      next: (res: any) => {
        this.brands = res.data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading brands:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  openModal(brand: any) {
    this.selectedBrand = brand;
  }

  closeModal() {
    this.selectedBrand = null;
  }
}