import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-pricing-page',
  imports: [CommonModule],
  template: `
    <section class="space-y-6">
      <h1 class="text-2xl font-bold">Pricing</h1>
      <div class="rounded-xl border bg-white p-4 shadow-sm">
        <p class="text-gray-600">Contenido restringido por rol <code>Pricing</code>.</p>
      </div>
    </section>
  `
})
export class PricingPage {}
