// src/app/pages/orders.page.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@/app/core/auth/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="h-14 px-4 flex items-center justify-between border-b bg-white">
      <div class="font-semibold">FEMSA • App</div>
      <button class="text-sm underline" (click)="logout()">Salir</button>
    </header>

    <main class="p-6">
      <h2 class="text-xl font-semibold mb-3">Orders</h2>
      <p class="text-gray-600">Contenido protegido. Solo visible si iniciaste sesión.</p>
    </main>
  `
})
export class OrdersPage {
  private auth = inject(AuthService);
  logout() { this.auth.logout(); location.href = '/login'; }
}
