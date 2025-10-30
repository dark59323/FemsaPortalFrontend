// src/app/pages/login.page.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, LoginResponse } from '@/app/core/auth/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'app-login-page',
  template: `
    <div class="min-h-dvh bg-bg-page flex flex-col">
      <div class="grid min-h-dvh grid-rows-[1fr_auto] md:grid-rows-1 md:grid-cols-2">
        <!-- Panel derecho (form) -->
        <div class="order-1 md:order-2 flex items-center justify-center bg-brand-700 px-6 py-8 md:px-20 md:py-16">
          <div class="brand-card-2xl w-[96%] max-w-4xl p-10 md:p-16">
            <h1 class="brand-title mb-12">Iniciar sesión</h1>

            <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-7">
              <div>
                <label for="username" class="brand-label">Usuario</label>
                <input id="username" type="text" formControlName="username" autocomplete="username" class="brand-input-lg" placeholder="Ingrese su usuario" />
                <p *ngIf="submitted() && form.controls.username.invalid" class="mt-2 text-sm text-gray-600">
                  Ingresa un usuario válido (mínimo 3 caracteres).
                </p>
              </div>

              <div>
                <label for="password" class="brand-label">Contraseña</label>
                <div class="relative">
                  <input id="password" [type]="showPassword() ? 'text' : 'password'" formControlName="password" autocomplete="current-password" class="brand-input-lg pr-12" placeholder="Ingrese su contraseña" />
                  <button type="button" (click)="togglePassword()" class="absolute inset-y-0 right-4 my-auto text-[var(--brand-700)]/80 hover:opacity-90" aria-label="Mostrar/ocultar contraseña">
                    <img *ngIf="!showPassword()" src="assets/icons/visibility.svg" alt="Mostrar contraseña" class="w-5 h-5" />
                    <img *ngIf="showPassword()" src="assets/icons/visibility_off.svg" alt="Ocultar contraseña" class="w-5 h-5" />
                  </button>
                </div>
                <p *ngIf="submitted() && form.controls.password.invalid" class="mt-2 text-sm text-gray-600">
                  La contraseña es obligatoria (mínimo 6 caracteres).
                </p>
              </div>

              <button type="submit" [disabled]="loading()" class="brand-btn-primary text-lg md:text-xl">
                {{ loading() ? 'Autenticando…' : 'Iniciar sesión' }}
              </button>
              <p *ngIf="errorMsg()" class="mt-3 text-sm text-red-600">{{ errorMsg() }}</p>
            </form>
          </div>
        </div>

        <!-- Panel izquierdo (logo) -->
        <div class="order-2 md:order-1 flex items-center justify-center left-panel-bg px-6 py-10 md:p-12">
          <img src="assets/img/femsa-logo.png" alt="FEMSA Salud Ecuador" class="max-w-[70%] md:max-w-[85%] h-auto object-contain" loading="eager" decoding="async" />
        </div>
      </div>
    </div>
  `,
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private ar = inject(ActivatedRoute);
  private auth = inject(AuthService);

  showPassword = signal(false);
  loading = signal(false);
  submitted = signal(false);
  errorMsg = signal('');

  form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  togglePassword() { this.showPassword.update(v => !v); }

  onSubmit() {
    this.submitted.set(true);
    this.errorMsg.set('');
    if (this.form.invalid) return;

    this.loading.set(true);

    const { username, password } = this.form.value;
    this.auth.login(username ?? '', password ?? '').subscribe({
      next: (res: LoginResponse) => {
        this.loading.set(false);
        localStorage.setItem('access_token', res.access_token);
        const returnUrl = this.ar.snapshot.queryParamMap.get('returnUrl') || '/orders';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMsg.set('Credenciales inválidas o error de red.');
        console.error('Login error:', err);
      },
    });
  }
}