// src/app/pages/orders.page.ts
import {
  Component,
  signal,
  HostListener,
  inject,
  effect,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '@/app/pages/sidebar.component';
import { AuthService } from '@/app/core/auth/auth.service';
import { ThemeService } from '@/app/core/theme/theme.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  template: `
    <div
      class="h-dvh grid grid-rows-[56px_1fr] selection:bg-brand-700/10"
      [ngClass]="{
        'text-gray-900': themeSvc.theme() === 'light',
        'text-[var(--text-dark-primary)]': themeSvc.theme() === 'dark'
      }"
    >
      <header
        class="sticky top-0 z-40 h-14 px-3 md:px-6 flex items-center gap-2 md:gap-4 border-b backdrop-blur supports-[backdrop-filter]:bg-white/60"
        [ngClass]="{
          'bg-white/70 border-gray-200': themeSvc.theme() === 'light',
          'bg-[var(--surface-dark-opacity)] border-[var(--border-dark)]':
            themeSvc.theme() === 'dark'
        }"
      >
        <button
          class="size-9 grid place-items-center rounded-xl active:scale-95 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
          [ngClass]="{
            'hover:bg-gray-100': themeSvc.theme() === 'light',
            'hover:bg-gray-700': themeSvc.theme() === 'dark'
          }"
          type="button"
          (click)="isMobile() ? drawerOpen.set(true) : toggleCollapsed()"
          aria-label="Alternar menú"
          aria-controls="mobile-drawer"
          [attr.aria-expanded]="isMobile() && drawerOpen() ? 'true' : 'false'"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 6h16M4 12h16M4 18h16"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
            />
          </svg>
        </button>

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

        <div class="ml-2 hidden md:flex items-center flex-1 max-w-xl">
          <label class="relative w-full">
            <span
              class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              [ngClass]="{
                'text-gray-400': themeSvc.theme() === 'light',
                'text-gray-500': themeSvc.theme() === 'dark'
              }"
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
              class="w-full h-9 pl-9 pr-3 rounded-xl border transition
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 placeholder:text-gray-400 text-sm"
              [ngClass]="{
                'border-gray-200 bg-white/70 hover:bg-white focus:bg-white':
                  themeSvc.theme() === 'light',
                'border-[var(--input-border-dark)] bg-[var(--input-bg-dark-opacity)] hover:bg-[var(--input-bg-dark-hover)] focus:bg-[var(--input-bg-dark)] placeholder:text-[var(--text-dark-secondary)]':
                  themeSvc.theme() === 'dark'
              }"
            />
          </label>
        </div>

        <div class="ml-auto flex items-center gap-2 md:gap-3">
          <button
            type="button"
            class="relative inline-grid place-items-center size-9 rounded-xl transition
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
            [ngClass]="{
              'hover:bg-gray-100': themeSvc.theme() === 'light',
              'hover:bg-gray-700': themeSvc.theme() === 'dark'
            }"
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

          <div class="relative" #profileMenu>
            <button
              type="button"
              (click)="toggleProfileMenu()"
              class="inline-flex items-center gap-2 pl-2 pr-3 h-9 rounded-xl transition text-sm
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
              [ngClass]="{
                'hover:bg-gray-100': themeSvc.theme() === 'light',
                'hover:bg-gray-700': themeSvc.theme() === 'dark'
              }"
              [attr.aria-expanded]="isProfileMenuOpen()"
              aria-haspopup="true"
            >
              <span class="hidden md:inline">Mi cuenta</span>
              <svg
                class="w-4 h-4"
                [ngClass]="{
                  'text-gray-500': themeSvc.theme() === 'light',
                  'text-gray-400': themeSvc.theme() === 'dark'
                }"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M6 9l6 6 6-6"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                />
              </svg>
            </button>

            <div
              *ngIf="isProfileMenuOpen()"
              class="absolute right-0 z-20 mt-2 w-64 origin-top-right rounded-xl border shadow-lg"
              [ngClass]="{
                'border-gray-200 bg-white': themeSvc.theme() === 'light',
                'border-[var(--border-dark)] bg-[var(--surface-dark)]': themeSvc.theme() === 'dark'
              }"
              role="menu"
              aria-orientation="vertical"
              tabindex="-1"
            >
              <div class="p-4" role="none">
                <p
                  class="text-sm font-medium truncate"
                  [ngClass]="{
                    'text-gray-900': themeSvc.theme() === 'light',
                    'text-white': themeSvc.theme() === 'dark'
                  }"
                  role="none"
                >
                  {{ displayName }}
                </p>
                <p
                  class="text-sm truncate"
                  [ngClass]="{
                    'text-gray-500': themeSvc.theme() === 'light',
                    'text-gray-400': themeSvc.theme() === 'dark'
                  }"
                  role="none"
                >
                  {{ userEmail }}
                </p>

                <hr
                  class="my-3"
                  [ngClass]="{
                    'border-gray-200': themeSvc.theme() === 'light',
                    'border-gray-600': themeSvc.theme() === 'dark'
                  }"
                />

                <div class="flex items-center justify-between" role="none">
                  <span
                    class="text-sm"
                    [ngClass]="{
                      'text-gray-700': themeSvc.theme() === 'light',
                      'text-gray-300': themeSvc.theme() === 'dark'
                    }"
                    >Tema Oscuro</span
                  >
                  <button
                    type="button"
                    class="relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-700 focus:ring-offset-2"
                    [ngClass]="{
                      'bg-gray-200': themeSvc.theme() === 'light',
                      'bg-[var(--input-bg-dark)] focus:ring-offset-[var(--surface-dark)]':
                        themeSvc.theme() === 'dark',
                      'bg-brand-700': themeSvc.theme() === 'dark'
                    }"
                    role="switch"
                    [attr.aria-checked]="themeSvc.theme() === 'dark'"
                    aria-label="Toggle theme"
                    (click)="themeSvc.toggleTheme()"
                  >
                    <span class="sr-only">Toggle theme</span>
                    <span
                      aria-hidden="true"
                      class="pointer-events-none relative inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                      [ngClass]="{
                        'translate-x-5': themeSvc.theme() === 'dark',
                        'translate-x-0': themeSvc.theme() === 'light'
                      }"
                    >
                      <span
                        [ngClass]="{
                          'opacity-0 duration-100 ease-out': themeSvc.theme() === 'dark',
                          'opacity-100 duration-200 ease-in': themeSvc.theme() === 'light'
                        }"
                        class="absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
                      >
                        <img
                          src="assets/icons/light_mode.svg"
                          alt="Light mode icon"
                          class="h-4 w-4 text-gray-400"
                        />
                      </span>
                      <span
                        [ngClass]="{
                          'opacity-100 duration-200 ease-in': themeSvc.theme() === 'dark',
                          'opacity-0 duration-100 ease-out': themeSvc.theme() === 'light'
                        }"
                        class="absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
                      >
                        <img
                          src="assets/icons/dark_mode.svg"
                          alt="Dark mode icon"
                          class="h-4 w-4 text-brand-700"
                        />
                      </span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

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

      <div
        class="z-0 grid grid-cols-1 md:grid-cols-[var(--sbw)_1fr] min-h-0"
        [ngStyle]="{ '--sbw': collapsed() ? '80px' : '264px' }"
      >
        <aside
          class="relative hidden md:flex h-full text-gray-50 will-change-[width] transition-[width] duration-300 overflow-hidden"
        >
          <div
            class="absolute inset-y-0 left-0 z-0 pointer-events-none transition-[width] duration-300"
            [style.width]="'var(--sbw)'"
          >
            <div
              class="h-full w-full"
              style="background: linear-gradient(to bottom, var(--brand-800), var(--brand-700));"
            ></div>
          </div>
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

        <div class="md:hidden fixed inset-0 z-50" *ngIf="drawerOpen()">
          <button
            class="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
            (click)="closeDrawer()"
            aria-label="Cerrar overlay"
          ></button>
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

        <main
          class="p-4 sm:p-6 lg:p-8 overflow-auto"
          [ngClass]="{
            'bg-[#f4f5f7]': themeSvc.theme() === 'light',
            'bg-[var(--bg-11coolgray)]': themeSvc.theme() === 'dark'
          }"
        >
          <div class="mb-4 md:mb-6 flex items-center justify-between gap-3">
            <nav
              aria-label="Breadcrumb"
              class="text-sm"
              [ngClass]="{
                'text-gray-500': themeSvc.theme() === 'light',
                'text-[var(--text-dark-secondary)]': themeSvc.theme() === 'dark'
              }"
            >
              <ol class="flex items-center gap-1">
                <li class="hover:text-gray-700 cursor-default">Inicio</li>
                <li aria-hidden="true">/</li>
                <li
                  class="font-medium"
                  [ngClass]="{
                    'text-gray-800': themeSvc.theme() === 'light',
                    'text-[var(--text-dark-primary)]': themeSvc.theme() === 'dark'
                  }"
                >
                  Órdenes
                </li>
              </ol>
            </nav>
            <label class="relative w-44 sm:hidden">
              <span
                class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                [ngClass]="{
                  'text-gray-400': themeSvc.theme() === 'light',
                  'text-gray-500': themeSvc.theme() === 'dark'
                }"
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
                class="w-full h-9 pl-9 pr-3 rounded-xl border transition
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 placeholder:text-gray-400 text-sm"
                [ngClass]="{
                  'border-gray-200 bg-white/70 hover:bg-white focus:bg-white':
                    themeSvc.theme() === 'light',
                  'border-[var(--input-border-dark)] bg-[var(--input-bg-dark-opacity)] hover:bg-[var(--input-bg-dark-hover)] focus:bg-[var(--input-bg-dark)] placeholder:text-[var(--text-dark-secondary)]':
                    themeSvc.theme() === 'dark'
                }"
              />
            </label>
          </div>

          <div
            class="rounded-2xl border shadow-sm p-4 sm:p-6"
            [ngClass]="{
              'border-gray-200 bg-white': themeSvc.theme() === 'light',
              'bg-[var(--surface-dark)] border-[var(--border-dark)]': themeSvc.theme() === 'dark'
            }"
          >
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `,
})
export class ShellPage {
  private auth = inject(AuthService);
  public displayName = this.auth.getDisplayName();
  public initials = this.auth.getInitials(this.displayName);
  collapsed = signal<boolean>(this.readCollapsed());
  drawerOpen = signal(false);
  public themeSvc = inject(ThemeService);
  isProfileMenuOpen = signal(false);
  public userEmail = this.auth.getEmail();

  constructor() {
    // Persistir automáticamente el estado del sidebar
    effect(() => {
      localStorage.setItem('sb-collapsed', JSON.stringify(this.collapsed()));
    });
  }

  @ViewChild('profileMenu') profileMenuRef?: ElementRef;
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (this.isProfileMenuOpen() && !this.profileMenuRef?.nativeElement.contains(event.target)) {
      this.isProfileMenuOpen.set(false);
    }
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

  toggleProfileMenu() {
    this.isProfileMenuOpen.update((v) => !v);
  }
}
