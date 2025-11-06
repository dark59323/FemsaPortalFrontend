import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { finalize, Subscription, timeout } from 'rxjs';
import { environment } from '@/app/environments/environment';

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

type UiState = 'idle' | 'loading' | 'success' | 'error';

@Component({
  standalone: true,
  selector: 'app-promotions-form',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="space-y-6">
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="p-5">
        <h1 class="mb-4 text-xl font-semibold">Validación de promociones</h1>

        <div class="grid gap-4 sm:grid-cols-2">
          <div *ngFor="let f of visibleFieldNames">
            <label class="mb-1 block text-sm font-medium text-gray-700" [for]="'field-' + f">
              {{ labels[f] || f }}
            </label>

            <ng-container *ngIf="f === 'empresa'; else maybeProceso">
              <select
                class="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 outline-none transition
               hover:border-gray-400 focus:border-gray-400 focus:bg-white focus:ring-4 focus:ring-black/10"
                [formControlName]="f"
                [id]="'field-' + f"
              >
                <option *ngFor="let opt of companyOptions" [value]="opt.value">
                  {{ opt.label }}
                </option>
              </select>
              <p class="mt-1 text-xs text-gray-500">* Se enviará solo el número.</p>
            </ng-container>

            <ng-template #maybeProceso>
              <ng-container *ngIf="f === 'procesoEjecuta'; else defaultInput">
                <select
                  class="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 outline-none transition
                 hover:border-gray-400 focus:border-gray-400 focus:bg-white focus:ring-4 focus:ring-black/10"
                  [formControlName]="f"
                  [id]="'field-' + f"
                >
                  <option *ngFor="let opt of procesoEjecutaOptions" [value]="opt">
                    {{ opt }}
                  </option>
                </select>
              </ng-container>
            </ng-template>

            <ng-template #defaultInput>
              <input
                class="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 outline-none transition
               hover:border-gray-400 focus:border-gray-400 focus:bg-white focus:ring-4 focus:ring-black/10"
                [formControlName]="f"
                [attr.placeholder]="placeholders[f]"
                autocomplete="off"
                [id]="'field-' + f"
                [attr.list]="'list-' + f"
              />
              <datalist [id]="'list-' + f">
                <option *ngFor="let option of fieldOptions[f]" [value]="option"></option>
              </datalist>
            </ng-template>
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-2">
          <button
            type="button"
            class="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
            (click)="resetDefaults()"
            [disabled]="state() === 'loading'"
          >
            Restaurar
          </button>

          <button
            type="button"
            class="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
            (click)="cancelRequest()"
            [disabled]="state() !== 'loading'"
          >
            Cancelar
          </button>

          <button
            type="submit"
            class="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm text-white hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-black/20 disabled:opacity-50"
            [disabled]="form.invalid || state() === 'loading'"
          >
            <svg
              *ngIf="state() === 'loading'"
              class="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                class="opacity-30"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="3"
              ></circle>
              <path
                class="opacity-80"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"
              ></path>
            </svg>
            {{ state() === 'loading' ? 'Enviando…' : 'Enviar' }}
          </button>
        </div>
      </form>
    </section>

    <div
      *ngIf="state() !== 'idle'"
      class="fixed inset-0 z-50 grid place-items-center bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      [attr.aria-label]="ariaLabel()"
    >
      <div class="w-[92%] max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <div class="flex flex-col items-center text-center">
          <ng-container *ngIf="state() === 'loading'">
            <svg
              class="mb-3 h-8 w-8 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                class="opacity-30"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="3"
              ></circle>
              <path
                class="opacity-80"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"
              ></path>
            </svg>
            <h2 class="text-base font-semibold">Procesando solicitud…</h2>
            <p class="mt-1 text-sm text-gray-600">Esto puede tardar varios minutos.</p>
            <div class="mt-4 flex gap-2">
              <button
                type="button"
                class="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
                (click)="cancelRequest()"
              >
                Cancelar
              </button>
            </div>
          </ng-container>

          <ng-container *ngIf="state() === 'success'">
            <div class="mb-2 grid h-10 w-10 place-items-center rounded-full bg-emerald-50">
              <svg class="h-5 w-5 text-emerald-600" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20 7L9 18l-5-5"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <h2 class="text-base font-semibold">Operación exitosa</h2>
            <p class="mt-1 text-sm text-gray-600">
              {{ message() || 'Solicitud procesada correctamente.' }}
            </p>
            <div class="mt-4">
              <button
                type="button"
                class="rounded-lg bg-black px-4 py-2 text-sm text-white hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-black/20"
                (click)="closeModal()"
              >
                Aceptar
              </button>
            </div>
          </ng-container>

          <ng-container *ngIf="state() === 'error'">
            <div class="mb-2 grid h-10 w-10 place-items-center rounded-full bg-red-50">
              <svg class="h-5 w-5 text-red-600" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 8v5m0 3h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <h2 class="text-base font-semibold">Ocurrió un problema</h2>
            <p class="mt-1 text-sm text-gray-600">
              {{ message() || 'No se pudo completar la solicitud.' }}
            </p>
            <div class="mt-4">
              <button
                type="button"
                class="rounded-lg bg-black px-4 py-2 text-sm text-white hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-black/20"
                (click)="closeModal()"
              >
                Aceptar
              </button>
            </div>
          </ng-container>
        </div>
      </div>
    </div>
  `,
})
export class PromotionsFormComponent {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  private readonly url = environment.promotions.apiUrl;

  private sub?: Subscription;

  state = signal<UiState>('idle');
  message = signal<string>('');

  fieldNames = [
    'mensajeExt',
    'paramUno',
    'paramDos',
    'procesoEjecuta',
    'origenListPdv',
    'ubicacion',
    'empresa',
    'farmacia',
    'pos',
    'mail',
  ] as const;

  private hiddenFields = ['mensajeExt', 'origenListPdv'] as const;

  visibleFieldNames: ReadonlyArray<string> = [
    'paramUno',
    'paramDos',
    'procesoEjecuta',
    'ubicacion',
    'empresa',
    'farmacia',
    'pos',
    'mail',
  ];

  placeholders: Record<string, string> = {
    mensajeExt: 'N',
    paramUno: "'ITEMS ACMALETAS'",
    paramDos: "'1234'",
    procesoEjecuta: 'CHECKPROMOTION-F',
    origenListPdv: 'GEO',
    ubicacion: 'LOCAL',
    empresa: '1',
    farmacia: '1,72243',
    pos: '0',
    mail: 'S',
  };

  labels: Record<string, string> = {
    paramUno: 'Lista de promociones',
    paramDos: 'Promoción',
    procesoEjecuta: 'Proceso a Ejecutar',
    ubicacion: 'Ubicación',
    empresa: 'Empresa',
    farmacia: 'Farmacia',
    pos: 'Punto de Venta (POS)',
    mail: 'Mail',
  };

  companyOptions = [
    { value: '1', label: '1 - Fybeca' },
    { value: '8', label: '8 - Sana Sana' },
    { value: '11', label: '11 - Oki' },
  ];

  procesoEjecutaOptions = ['CHECKPROMOTION-F', 'CHECKPROMOTION-S'];

  form = this.fb.group({
    mensajeExt: this.fb.control('N', { validators: [Validators.required] }),
    paramUno: this.fb.control("'ITEMS ACMALETAS'", { validators: [Validators.required] }),
    paramDos: this.fb.control("'1234'", { validators: [Validators.required] }),
    procesoEjecuta: this.fb.control('CHECKPROMOTION-F', { validators: [Validators.required] }),
    origenListPdv: this.fb.control('GEO', { validators: [Validators.required] }),
    ubicacion: this.fb.control('LOCAL', { validators: [Validators.required] }),
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
    if (this.form.invalid || this.state() === 'loading') return;
    this.state.set('loading');
    this.message.set('');

    const body: PromotionsCheckRequest = this.form.getRawValue() as PromotionsCheckRequest;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.sub = this.http
      .post<unknown>(this.url, body, { headers })
      .pipe(
        timeout({ each: 120_000 }),
        finalize(() => {
        })
      )
      .subscribe({
        next: () => {
          this.message.set('Solicitud procesada correctamente.');
          this.state.set('success');
        },
        error: (err) => {
          const friendly =
            err?.name === 'TimeoutError'
              ? 'Timeout: la solicitud tardó más de 120s.'
              : err?.error?.message || err?.message || 'Error desconocido al llamar al servicio.';
          this.message.set(friendly);
          this.state.set('error');
        },
      });
  }

  cancelRequest() {
    if (this.sub && !this.sub.closed) {
      this.sub.unsubscribe();
    }
    this.state.set('idle');
    this.message.set('');
  }

  closeModal() {
    this.state.set('idle');
    this.message.set('');
  }

  ariaLabel(): string {
    const s = this.state();
    if (s === 'loading') return 'Procesando solicitud';
    if (s === 'success') return 'Operación exitosa';
    if (s === 'error') return 'Ocurrió un problema';
    return 'Diálogo';
  }
  fieldOptions: Record<string, string[]> = {
    mensajeExt: ['N'],
    paramUno: ["'ITEMS ACMALETAS'"],
    paramDos: ["'1234'"],
    procesoEjecuta: ['CHECKPROMOTION-F'],
    origenListPdv: ['GEO'],
    ubicacion: ['CAJA'],
    empresa: ['1'],
    farmacia: ['1,72243'],
    pos: ['0'],
    mail: ['S'],
  };
}
