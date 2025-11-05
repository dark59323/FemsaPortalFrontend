// src/app/features/promotions/ui/promotions-form.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { finalize, Subscription, timeout } from 'rxjs';

type PromotionsCheckRequest = {
  mensajeExt: string;
  paramUno: string;
  paramDos: string;
  procesoEjecuta: string;
  origenListPdv: string;
  ubicacion: string;
  empresa: string;
  farmacia: string;
  pos: string;
  mail: string;
};

@Component({
  standalone: true,
  selector: 'app-promotions-form',
  imports: [CommonModule, ReactiveFormsModule, JsonPipe],
  template: `
    <section class="space-y-6">

      <!-- Card del formulario -->
      <div class="rounded-2xl border bg-white shadow-sm">
        <!-- Barra de acciones sticky -->
        <div class="sticky top-0 z-10 rounded-t-2xl border-b bg-white/90 backdrop-blur p-3">
          <div class="flex flex-wrap items-center gap-2">
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50"
              (click)="onSubmit()"
              [disabled]="form.invalid || loading()"
            >
              <svg *ngIf="loading()" class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"></path>
              </svg>
              <span>{{ loading() ? 'Ejecutando…' : 'Validar promociones' }}</span>
            </button>

            <button
              type="button"
              class="rounded-lg border px-4 py-2 hover:bg-gray-50"
              (click)="resetDefaults()"
              [disabled]="loading()"
              title="Restaura los valores por defecto"
            >
              Restaurar valores
            </button>

            <button
              type="button"
              class="rounded-lg border px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
              (click)="cancelRequest()"
              [disabled]="!loading()"
              title="Cancelar la solicitud en curso"
            >
              Cancelar
            </button>

            <div class="ms-auto text-xs text-gray-500">
              <span class="me-2">Timeout: 120s</span>
              <span *ngIf="loading()" class="inline-flex items-center gap-1">
                <span class="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span> llamando API…
              </span>
            </div>
          </div>
        </div>

        <!-- Formulario -->
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="p-4 md:p-6">
          <div class="grid gap-4 md:grid-cols-2">
            <!-- Campo helper -->
            <div class="md:col-span-2">
              <div class="rounded-xl bg-gray-50 text-gray-700 p-3 text-xs">
                <strong>Tip:</strong> Puedes ajustar los parámetros; el request se envía como JSON.
              </div>
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium">mensajeExt</label>
              <input class="w-full rounded-xl border px-3 py-2 outline-none focus:ring-4 focus:ring-black/10" formControlName="mensajeExt" />
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium">paramUno</label>
              <input class="w-full rounded-xl border px-3 py-2 outline-none focus:ring-4 focus:ring-black/10" formControlName="paramUno" placeholder="'ITEMS ACMALETAS'"/>
              <p class="mt-1 text-[11px] text-gray-500">Incluye comillas simples si tu backend lo requiere exactamente así.</p>
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium">paramDos</label>
              <input class="w-full rounded-xl border px-3 py-2 outline-none focus:ring-4 focus:ring-black/10" formControlName="paramDos" placeholder="'1234'"/>
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium">procesoEjecuta</label>
              <input class="w-full rounded-xl border px-3 py-2 outline-none focus:ring-4 focus:ring-black/10" formControlName="procesoEjecuta" />
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium">origenListPdv</label>
              <input class="w-full rounded-xl border px-3 py-2 outline-none focus:ring-4 focus:ring-black/10" formControlName="origenListPdv" />
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium">ubicacion</label>
              <input class="w-full rounded-xl border px-3 py-2 outline-none focus:ring-4 focus:ring-black/10" formControlName="ubicacion" />
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium">empresa</label>
              <input class="w-full rounded-xl border px-3 py-2 outline-none focus:ring-4 focus:ring-black/10" formControlName="empresa" />
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium">farmacia</label>
              <input class="w-full rounded-xl border px-3 py-2 outline-none focus:ring-4 focus:ring-black/10" formControlName="farmacia" />
              <p class="mt-1 text-[11px] text-gray-500">Formato de ejemplo: <code>1,72243</code></p>
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium">pos</label>
              <input class="w-full rounded-xl border px-3 py-2 outline-none focus:ring-4 focus:ring-black/10" formControlName="pos" />
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium">mail</label>
              <input class="w-full rounded-xl border px-3 py-2 outline-none focus:ring-4 focus:ring-black/10" formControlName="mail" />
            </div>
          </div>
        </form>
      </div>

      <!-- Mensajes -->
      <div *ngIf="error()" class="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
        {{ error() }}
      </div>

      <!-- Resultado -->
      <div *ngIf="result() as r" class="rounded-2xl border bg-white shadow-sm">
        <div class="flex items-center justify-between border-b p-3">
          <h3 class="font-semibold">Respuesta</h3>
          <span class="rounded-md bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700 border border-emerald-200">200 OK</span>
        </div>
        <div class="max-h-[28rem] overflow-auto p-4">
          <pre class="text-sm leading-relaxed whitespace-pre-wrap font-mono text-gray-800">{{ r | json }}</pre>
        </div>
      </div>
    </section>
  `,
})
export class PromotionsFormComponent {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  url = 'http://localhost:8080/api/promotions/check';

  loading = signal(false);
  error = signal<string | null>(null);
  result = signal<unknown | null>(null);

  private sub?: Subscription;

  form = this.fb.group<{
    mensajeExt: any;
    paramUno: any;
    paramDos: any;
    procesoEjecuta: any;
    origenListPdv: any;
    ubicacion: any;
    empresa: any;
    farmacia: any;
    pos: any;
    mail: any;
  }>({
    mensajeExt: this.fb.control('N', { validators: [Validators.required] }),
    paramUno: this.fb.control("'ITEMS ACMALETAS'", { validators: [Validators.required] }),
    paramDos: this.fb.control("'1234'", { validators: [Validators.required] }),
    procesoEjecuta: this.fb.control('CHECKPROMOTION-F', { validators: [Validators.required] }),
    origenListPdv: this.fb.control('GEO', { validators: [Validators.required] }),
    ubicacion: this.fb.control('CAJA', { validators: [Validators.required] }),
    empresa: this.fb.control('1', { validators: [Validators.required] }),
    farmacia: this.fb.control('1,72243', { validators: [Validators.required] }),
    pos: this.fb.control('0', { validators: [Validators.required] }),
    mail: this.fb.control('S', { validators: [Validators.required] }),
  });

  resetDefaults() {
    this.form.reset({
      mensajeExt: 'N',
      paramUno: "'ITEMS ACMALETAS'",
      paramDos: "'1234'",
      procesoEjecuta: 'CHECKPROMOTION-F',
      origenListPdv: 'GEO',
      ubicacion: 'CAJA',
      empresa: '1',
      farmacia: '1,72243',
      pos: '0',
      mail: 'S',
    });
  }

  onSubmit() {
    if (this.form.invalid || this.loading()) return;

    this.loading.set(true);
    this.error.set(null);
    this.result.set(null);

    const body: PromotionsCheckRequest = this.form.getRawValue() as PromotionsCheckRequest;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.sub = this.http
      .post<unknown>(this.url, body, { headers })
      .pipe(timeout({ each: 120_000 }))
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => this.result.set(res),
        error: (err) => {
          const msg =
            err?.name === 'TimeoutError'
              ? 'Timeout: la solicitud tardó más de 120s.'
              : (err?.error?.message || err?.message || 'Error desconocido al llamar al servicio.');
          this.error.set(msg);
        },
      });
  }

  cancelRequest() {
    if (this.sub && !this.sub.closed) {
      this.sub.unsubscribe();
      this.loading.set(false);
      this.error.set('Solicitud cancelada por el usuario.');
    }
  }
}
