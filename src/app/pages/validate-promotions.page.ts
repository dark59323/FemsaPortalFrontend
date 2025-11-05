import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../core/auth/auth.service';
import { PromotionsFormComponent } from "../features/promotions/ui/promotions-form.component";

@Component({
  standalone: true,
  selector: 'app-validate-promotions',
  imports: [CommonModule, PromotionsFormComponent],
  template: `
    <section class="space-y-6">
      <h1 class="text-2xl font-bold">VALIDAR PROMOCIONES</h1>
      <app-promotions-form></app-promotions-form>
    </section>
  `,
})
export class ValidatePromotionsPage {}
