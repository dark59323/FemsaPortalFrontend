import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@/app/core/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-dashboard-page',
  imports: [CommonModule],
  template: `
    <section class="space-y-6">
      <h1 class="text-2xl font-bold">Dashboard</h1>
      <p class="text-gray-600">
        Hola, <b>{{ username }}</b>
      </p>

      <div class="grid md:grid-cols-3 gap-4">
        <div class="rounded-xl border bg-white p-4 shadow-sm">
          <div class="text-sm text-gray-500">Módulos</div>
          <div class="text-2xl font-semibold mt-1">2</div>
        </div>

        <div class="rounded-xl border bg-white p-4 shadow-sm">
          <div class="text-sm text-gray-500">Tus roles ({{ clientId }})</div>
          <div class="mt-1 leading-6">
            <code class="text-sm break-all">{{ clientRoles.length ? clientRoles.join(', ') : '—' }}</code>
          </div>
        </div>

        <div class="rounded-xl border bg-white p-4 shadow-sm">
          <div class="text-sm text-gray-500">Estado</div>
          <div class="text-2xl font-semibold mt-1">OK</div>
        </div>
      </div>
    </section>
  `
})
export class DashboardPage {
  private auth = inject(AuthService);
  username = this.auth.getUsername();

  // ← adapta si cambia el clientId en tu Keycloak
  clientId = 'framecontroller-backend';
  clientRoles = this.auth.getClientRoles(this.clientId);
}
