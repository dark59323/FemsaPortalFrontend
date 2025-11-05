// src/app/pages/orders.page.ts
import { Component, signal, HostListener, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '@/app/pages/sidebar.component';
import { AuthService } from '@/app/core/auth/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  template: `
    <div
      class="min-h-dvh grid grid-rows-[56px_1fr] bg-[#f4f5f7] text-gray-900 selection:bg-brand-700/10"
    >
      <!-- HEADER -->
      <header
        class="sticky top-0 z-40 h-14 px-3 md:px-6 flex items-center gap-2 md:gap-4 border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60"
      >
        <!-- Menu / collapse -->
        <button
          class="size-9 grid place-items-center rounded-xl hover:bg-gray-100 active:scale-95 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
          type="button"
          (click)="isMobile() ? drawerOpen.set(true) : toggleCollapsed()"
          aria-label="Alternar menú"
          aria-controls="mobile-drawer"
          [attr.aria-expanded]="isMobile() && drawerOpen() ? 'true' : 'false'"
        >
          <!-- ícono -->
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 6h16M4 12h16M4 18h16"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
            />
          </svg>
        </button>

        <!-- Branding -->
        <div class="font-semibold tracking-wide flex items-center gap-2">
          <div class="flex items-center justify-center py-8 md:py-12">
            <img
              src="assets/img/femsa-logo.png"
              alt="FEMSA Salud Ecuador"
              class="w-3/4 md:w-2/3 lg:w-1/2 max-w-[280px] md:max-w-[350px] h-auto object-contain"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>

        <!-- Search (desktop) -->
        <div class="ml-2 hidden md:flex items-center flex-1 max-w-xl">
          <label class="relative w-full">
            <span
              class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
            >
              <svg class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none">
                <path
                  d="M11 18a7 7 0 100-14 7 7 0 000 14zm10 3l-5.2-5.2"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                />
              </svg>
            </span>
            <input
              type="search"
              placeholder="Buscar…"
              class="w-full h-9 pl-9 pr-3 rounded-xl border border-gray-200 bg-white/70 hover:bg-white focus:bg-white transition
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 placeholder:text-gray-400 text-sm"
            />
          </label>
        </div>

        <!-- Actions -->
        <div class="ml-auto flex items-center gap-2 md:gap-3">
          <!-- Notificaciones -->
          <button
            type="button"
            class="relative inline-grid place-items-center size-9 rounded-xl hover:bg-gray-100 transition
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
            aria-label="Notificaciones"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 17H9m9-1V11a6 6 0 10-12 0v5l-2 2h16l-2-2zM10 20a2 2 0 004 0"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span
              class="absolute -top-0.5 -right-0.5 inline-flex min-w-4 h-4 px-1 rounded-full bg-red-600 text-white text-[10px] leading-4 justify-center"
              >3</span
            >
          </button>

          <!-- Perfil -->
          <div class="relative">
            <button
              type="button"
              class="inline-flex items-center gap-2 pl-2 pr-3 h-9 rounded-xl hover:bg-gray-100 transition text-sm
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
            >
              <span class="hidden md:inline">Mi cuenta</span>
              <svg class="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 9l6 6 6-6"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                />
              </svg>
            </button>
            <!-- aquí podrías montar un dropdown real si lo necesitas -->
          </div>

          <!-- Logout -->
          <!-- Logout -->
          <button
            type="button"
            class="relative inline-flex items-center gap-2 px-3 h-9 rounded-xl text-sm font-medium text-white
         bg-brand-700 hover:bg-brand-700 transition-colors focus-visible:outline-none
         focus-visible:ring-2 focus-visible:ring-brand-700 cursor-pointer pointer-events-auto z-50"
            (click)="onLogout($event)"
            aria-label="Salir"
          >
            <img src="assets/icons/logout.svg" alt="" class="w-5 h-5 pointer-events-none" />
            <span class="hidden sm:inline">Salir</span>
          </button>
        </div>
      </header>

      <!-- LAYOUT -->
      <div
        class="z-0 grid grid-cols-1 md:grid-cols-[var(--sbw)_1fr] min-h-0"
        [ngStyle]="{ '--sbw': collapsed() ? '80px' : '264px' }"
      >
        <!-- SIDEBAR DESKTOP -->
        <aside
          class="relative hidden md:flex h-full text-gray-50 will-change-[width] transition-[width] duration-300 overflow-hidden"
        >
          <!-- layer color/gradiente -->
          <!-- capa de color -->
          <div
            class="absolute inset-y-0 left-0 z-0 pointer-events-none transition-[width] duration-300"
            [style.width]="'var(--sbw)'"
          >
            <div
              class="h-full w-full"
              style="background: linear-gradient(to bottom, var(--brand-800), var(--brand-700));"
            ></div>
          </div>

          <!-- contenido -->
          <div
            class="relative z-10 flex flex-col justify-between transition-[width] duration-300"
            [style.--sbw]="collapsed() ? '5rem' : '16.5rem'"
            [style.width]="'var(--sbw)'"
          >
            <div class="p-2">
              <app-sidebar [collapsed]="collapsed()" />
            </div>

            <div class="p-3">
              <div
                class="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 focus-within:ring-2 focus-within:ring-white/40"
              >
                <div
                  class="w-8 h-8 rounded-full grid place-items-center text-[11px] font-semibold uppercase select-none"
                  style="background: var(--brand-600); color: #fff;"
                >
                  {{ initials }}
                </div>

                <div class="min-w-0" *ngIf="!collapsed()">
                  <p class="text-sm font-medium truncate">{{ displayName }}</p>
                  <p class="text-[11px] text-white/70 truncate">Administrador</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <!-- DRAWER MÓVIL -->
        <div class="md:hidden fixed inset-0 z-50" *ngIf="drawerOpen()">
          <!-- overlay -->
          <button
            class="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
            (click)="closeDrawer()"
            aria-label="Cerrar overlay"
          ></button>

          <!-- panel -->
          <div
            id="mobile-drawer"
            role="dialog"
            aria-modal="true"
            class="absolute left-0 top-0 h-dvh w-[280px] bg-gradient-to-b from-brand-700 to-brand-700 text-white shadow-2xl translate-x-0 transition-transform duration-300 pb-safe"
          >
            <div class="flex items-center justify-between px-3 h-14 border-b border-white/10">
              <div class="font-semibold tracking-wide">Menú</div>
              <button
                type="button"
                class="size-9 grid place-items-center rounded-xl hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/50"
                (click)="closeDrawer()"
                aria-label="Cerrar menú"
              >
                ✕
              </button>
            </div>

            <div class="py-2 px-1">
              <app-sidebar [collapsed]="false" />
            </div>
          </div>
        </div>

        <!-- MAIN -->
        <main class="p-4 sm:p-6 lg:p-8 overflow-auto">
          <!-- breadcrumb + título (opcional) -->
          <div class="mb-4 md:mb-6 flex items-center justify-between gap-3">
            <nav aria-label="Breadcrumb" class="text-sm text-gray-500">
              <ol class="flex items-center gap-1">
                <li class="hover:text-gray-700 cursor-default">Inicio</li>
                <li aria-hidden="true">/</li>
                <li class="text-gray-800 font-medium">Órdenes</li>
              </ol>
            </nav>
            <!-- Search compacto en móvil -->
            <label class="relative w-44 sm:hidden">
              <span
                class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
              >
                <svg class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M11 18a7 7 0 100-14 7 7 0 000 14zm10 3l-5.2-5.2"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                  />
                </svg>
              </span>
              <input
                type="search"
                placeholder="Buscar…"
                class="w-full h-9 pl-9 pr-3 rounded-xl border border-gray-200 bg-white/70 hover:bg-white focus:bg-white transition
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 placeholder:text-gray-400 text-sm"
              />
            </label>
          </div>

          <div class="rounded-2xl border border-gray-200 bg-white shadow-sm p-4 sm:p-6">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `,
})
export class OrdersPage {
  private auth = inject(AuthService);
  public displayName = this.auth.getDisplayName();
  public initials = this.auth.getInitials(this.displayName);
  collapsed = signal<boolean>(this.readCollapsed());
  drawerOpen = signal(false);

  constructor() {
    // Persistir automáticamente el estado del sidebar
    effect(() => {
      localStorage.setItem('sb-collapsed', JSON.stringify(this.collapsed()));
    });
  }

  @HostListener('window:keydown.escape') onEsc() {
    this.closeDrawer();
  }
  @HostListener('window:resize') onResize() {
    if (!this.isMobile()) this.closeDrawer();
  }

  isMobile() {
    return typeof window !== 'undefined' && window.innerWidth < 768;
  }
  toggleCollapsed() {
    this.collapsed.update((v) => !v);
  }
  private readCollapsed() {
    try {
      return JSON.parse(localStorage.getItem('sb-collapsed') ?? 'false');
    } catch {
      return false;
    }
  }
  openDrawer() {
    if (!this.drawerOpen()) {
      this.drawerOpen.set(true);
      this.syncBodyScroll();
    }
  }
  closeDrawer() {
    if (this.drawerOpen()) {
      this.drawerOpen.set(false);
      this.syncBodyScroll();
    }
  }
  private syncBodyScroll() {
    if (typeof document !== 'undefined')
      document.body.style.overflow = this.drawerOpen() ? 'hidden' : '';
  }
  onMenuNavigate() {
    if (this.isMobile()) this.closeDrawer();
  }

  onLogout(ev?: Event) {
    ev?.stopPropagation();
    this.auth.logout();
  }
}
