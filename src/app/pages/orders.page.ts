// src/app/pages/orders.page.ts
import { Component, signal, effect, HostListener, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '@/app/core/auth/auth.service';

@Component({
  
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-dvh grid grid-rows-[56px_1fr] bg-[#f1f2f3] text-gray-900">
  <!-- HEADER -->
  <header
    class="h-14 px-4 flex items-center gap-3 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
    <button class="size-9 grid place-items-center rounded-xl hover:bg-gray-100 active:scale-95 transition"
      (click)="isMobile() ? drawerOpen.set(true) : toggleCollapsed()" aria-label="Alternar menú"
      aria-controls="mobile-drawer" [attr.aria-expanded]="(isMobile() && drawerOpen()) ? 'true' : 'false'">
      <!--<span class="size-5" [innerHTML]="icon('menu')"></span>-->
    </button>

    <div class="font-semibold tracking-wide">FEMSA • Portal</div>

    <div class="ml-auto flex items-center gap-3">
      <button class="hidden md:inline-flex items-center gap-2 px-3 h-9 rounded-xl hover:bg-gray-100">
       <!-- <span class="size-5" [innerHTML]="icon('bell')"></span>-->
        <span class="text-sm">Notificaciones</span>
      </button>

      <!--<button
        class="flex items-center gap-2 px-4 h-9 rounded-xl text-sm font-medium text-white bg-brand-700 hover:bg-brand-800 transition-colors"
        (click)="onLogout()">
        <span>
          <img src="assets/icons/logout.svg" alt="Cerrar Sesión" class="w-5 h-5" />
        </span>
      </button>-->
    </div>
  </header>

  <!-- LAYOUT -->
  <!-- -- moved the --sbw css variable to this parent so md:grid-cols-[var(--sbw)_1fr] actually works -- -->
  <div class="grid grid-cols-1 md:grid-cols-[var(--sbw)_1fr] min-h-0"
    [ngStyle]="{'--sbw': collapsed() ? '78px' : '260px'}">

    <!-- SIDEBAR DESKTOP -->
    <aside
      class="relative hidden md:flex h-full text-gray-100 will-change-[width] transition-[width] duration-300 overflow-hidden">
      <!-- CAPA DE COLOR -->
      <div class="absolute inset-y-0 left-0 transition-[width] duration-300" [style.width]="'var(--sbw)'"
        [class]="sidebarBg"></div>

      <!-- CONTENIDO -->
      <div class="relative z-10 flex flex-col justify-between transition-[width] duration-300"
        [style.--sbw]="collapsed() ? '4rem' : '16rem'" [style.width]="'var(--sbw)'">

        <!-- SIDEBAR TEMPLATE -->
        <ng-container [ngTemplateOutlet]="sidebar"></ng-container>

        <!-- PERFIL + TOGGLE -->
        <div class="p-3">
          <div class="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-black/10">
            <div class="w-8 h-8 rounded-full bg-white/20 grid place-items-center">
              <img src="assets/icons/user.svg" alt="" class="w-5 h-5" />
            </div>
            <div class="font-bold tracking-wide text-lg" *ngIf="!collapsed()">
              <!--{{ getFirstName() }}-->
            </div>
          </div>

          <button type="button"
            class="w-full mt-2 flex items-center justify-center gap-2 h-9 rounded-lg bg-black/10 hover:bg-black/15 transition"
            (click)="toggleCollapsed()" [attr.aria-expanded]="!collapsed()"
            [attr.aria-label]="collapsed() ? 'Abrir menú' : 'Cerrar menú'">
            <img [src]="collapsed() ? 'assets/icons/menu.svg' : 'assets/icons/menu_open.svg'" alt=""
              class="w-5 h-5 transition-transform" />
            <span class="text-xs font-semibold" *ngIf="!collapsed()">Ocultar menú</span>
          </button>
        </div>
      </div>
    </aside>

    <!-- DRAWER MÓVIL -->
    <div class="md:hidden fixed inset-0 z-50" *ngIf="drawerOpen()">
      <!-- overlay del color del sidebar -->
      <div class="absolute inset-0 opacity-90" [class]="sidebarBg" (click)="closeDrawer()"></div>

      <!-- panel -->
      <div id="mobile-drawer" role="dialog" aria-modal="true"
        class="absolute left-0 top-0 h-dvh w-[260px] bg-brand-700 text-white shadow-2xl translate-x-0 transition-transform duration-300 pb-safe">

        <div class="flex items-center justify-between px-3 h-14 border-b border-white/10">
          <div class="font-semibold tracking-wide">Menú</div>
          <button class="size-9 grid place-items-center rounded-xl hover:bg-white/10" (click)="closeDrawer()"
            aria-label="Cerrar menú">
            ✕
          </button>
        </div>

        <div class="py-2">
          <ng-container [ngTemplateOutlet]="sidebar" [ngTemplateOutletContext]="{ mobile: true }"></ng-container>
        </div>
      </div>
    </div>

    <!-- MAIN (SHELL CONTENT) -->
    <main class="p-6 md:p-10 overflow-auto">
      <!-- Aquí se renderizan las RUTAS HIJAS -->
      <!--<router-outlet></router-outlet>-->
    </main>
  </div>
</div>

<!-- ============= SIDEBAR CONTENT (reutilizable) ============= -->
<ng-template #sidebar let-mobile="mobile">
  <nav class="mt-1 text-sm">
    <!-- Usamos allowedMenus() para filtrar por roles del token -->
    <!--<a *ngFor="let m of allowedMenus(); trackBy: trackByLabel" [routerLink]="m.route" routerLinkActive="bg-black/15"
      [routerLinkActiveOptions]="{ exact: m.route === '/login' }"
      class="group relative flex items-center gap-3 px-4 py-3 rounded-xl mx-2 my-1 hover:bg-black/10 transition"
      [attr.title]="collapsed() && !mobile ? m.label : null" (click)="onMenuNavigate()">
      <img *ngIf="m.svg" [src]="m.svg" alt="" class="w-5 h-5 opacity-95" />
      <span class="uppercase tracking-wide font-extrabold text-[15px] opacity-90 whitespace-nowrap"
        *ngIf="!collapsed() || mobile">{{ m.label }}</span>
      <span routerLinkActive="opacity-100"
        class="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-l-full bg-white/80 opacity-0 transition"></span>
    </a>-->
  </nav>
</ng-template>
  `
})

export class OrdersPage {
  private auth = inject(AuthService);
  logout() { this.auth.logout(); location.href = '/login'; }
  // —— UI state
  sidebarBg = 'bg-brand-700';
  collapsed = signal<boolean>(this.readCollapsed());
  drawerOpen = signal(false);
  // —— Shell: eventos globales para UX
  @HostListener('window:keydown.escape') onEsc() { this.closeDrawer(); }
  @HostListener('window:resize') onResize() { if (!this.isMobile()) this.closeDrawer(); }

  // —— Helpers de layout
  isMobile() { return typeof window !== 'undefined' && window.innerWidth < 768; }
  toggleCollapsed() { this.collapsed.update(v => !v); }
  private readCollapsed() { try { return JSON.parse(localStorage.getItem('sb-collapsed') ?? 'false'); } catch { return false; } }

  openDrawer() { if (!this.drawerOpen()) { this.drawerOpen.set(true); this.syncBodyScroll(); } }
  closeDrawer() { if (this.drawerOpen()) { this.drawerOpen.set(false); this.syncBodyScroll(); } }

  private syncBodyScroll() {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = this.drawerOpen() ? 'hidden' : '';
    }
  }

  // —— Navegación: al hacer click en un ítem del menú en móvil, cerramos el drawer
  onMenuNavigate() { if (this.isMobile()) this.closeDrawer(); }

}
