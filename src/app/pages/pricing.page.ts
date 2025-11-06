// src/app/pages/pricing.page.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromotionsFormComponent } from '@/app/features/promotions/ui/promotions-form.component'; // <-- importa tu formulario

@Component({
  standalone: true,
  selector: 'app-pricing-page',
  imports: [CommonModule, PromotionsFormComponent],
  template: `
    <section class="space-y-6">
      <h1 class="text-2xl font-bold">VALIDAR PROMOCIONES</h1>
      <app-promotions-form></app-promotions-form>
    </section>
  `,
})
export class PricingPage {}