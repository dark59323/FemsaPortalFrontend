// src/app/pages/orders.page.ts
import { Component, signal, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '@/app/pages/sidebar.component';
import { AuthService } from '@/app/core/auth/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  template: `
<div class="min-h-dvh grid grid-rows-[56px_1fr] bg-[#f1f2f3] text-gray-900">

  <!-- HEADER (siempre encima y clickable) -->
  <header
    class="sticky top-0 z-40 h-14 px-4 flex items-center gap-3 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 pointer-events-auto">
    <button class="size-9 grid place-items-center rounded-xl hover:bg-gray-100 active:scale-95 transition"
            type="button"
            (click)="isMobile() ? drawerOpen.set(true) : toggleCollapsed()"
            aria-label="Alternar menú" aria-controls="mobile-drawer"
            [attr.aria-expanded]="(isMobile() && drawerOpen()) ? 'true' : 'false'">
    </button>

    <div class="font-semibold tracking-wide">FEMSA • Portal</div>

    <div class="ml-auto flex items-center gap-3">
      <button type="button" class="hidden md:inline-flex items-center gap-2 px-3 h-9 rounded-xl hover:bg-gray-100">
        <span class="text-sm">Notificaciones</span>
      </button>

      <button type="button"
        class="inline-flex items-center gap-2 px-4 h-9 rounded-xl text-sm font-medium text-white bg-brand-700 hover:bg-brand-800 transition-colors"
        (click)="onLogout($event)">
        <img src="assets/icons/logout.svg" alt="" class="w-5 h-5" />
        <span>Salir</span>
      </button>
    </div>
  </header>

  <!-- LAYOUT (debajo del header) -->
  <div class="z-0 grid grid-cols-1 md:grid-cols-[var(--sbw)_1fr] min-h-0"
       [ngStyle]="{'--sbw': collapsed() ? '78px' : '260px'}">

    <!-- SIDEBAR DESKTOP -->
    <aside class="relative hidden md:flex h-full text-gray-100 will-change-[width] transition-[width] duration-300 overflow-hidden">
      <!-- capa de color: nunca captura clicks ni tapa -->
      <div class="absolute inset-y-0 left-0 z-0 pointer-events-none transition-[width] duration-300"
           [style.width]="'var(--sbw)'" [class]="sidebarBg"></div>

      <!-- contenido del sidebar -->
      <div class="relative z-10 flex flex-col justify-between transition-[width] duration-300"
           [style.--sbw]="collapsed() ? '4rem' : '16rem'" [style.width]="'var(--sbw)'">

        <div class="p-2">
          <app-sidebar [collapsed]="collapsed()"/>
        </div>

        <div class="p-3">
          <div class="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-black/10">
            <div class="w-8 h-8 rounded-full bg-white/20 grid place-items-center">
              <img src="assets/icons/user.svg" alt="" class="w-5 h-5" />
            </div>
          </div>
          <button type="button"
                  class="w-full mt-2 flex items-center justify-center gap-2 h-9 rounded-lg bg-black/10 hover:bg-black/15 transition"
                  (click)="toggleCollapsed()" [attr.aria-expanded]="!collapsed()"
                  [attr.aria-label]="collapsed() ? 'Abrir menú' : 'Cerrar menú'">
            <img [src]="collapsed() ? 'assets/icons/menu.svg' : 'assets/icons/menu_open.svg'" alt="" class="w-5 h-5 transition-transform" />
            <span class="text-xs font-semibold" *ngIf="!collapsed()">Ocultar menú</span>
          </button>
        </div>
      </div>
    </aside>

    <!-- DRAWER MÓVIL -->
    <div class="md:hidden fixed inset-0 z-50" *ngIf="drawerOpen()">
      <!-- overlay -->
      <div class="absolute inset-0 opacity-90" [class]="sidebarBg" (click)="closeDrawer()"></div>

      <!-- panel -->
      <div id="mobile-drawer" role="dialog" aria-modal="true"
           class="absolute left-0 top-0 h-dvh w-[260px] bg-brand-700 text-white shadow-2xl translate-x-0 transition-transform duration-300 pb-safe">
        <div class="flex items-center justify-between px-3 h-14 border-b border-white/10">
          <div class="font-semibold tracking-wide">Menú</div>
          <button type="button" class="size-9 grid place-items-center rounded-xl hover:bg-white/10" (click)="closeDrawer()" aria-label="Cerrar menú">✕</button>
        </div>

        <div class="py-2 px-1">
          <app-sidebar [collapsed]="false"/>
        </div>
      </div>
    </div>

    <!-- MAIN (RUTAS HIJAS) -->
    <main class="p-6 md:p-10 overflow-auto">
      <router-outlet></router-outlet>
    </main>
  </div>
</div>
  `
})
export class OrdersPage {
  private auth = inject(AuthService);
  sidebarBg = 'bg-brand-700';
  collapsed = signal<boolean>(this.readCollapsed());
  drawerOpen = signal(false);

  @HostListener('window:keydown.escape') onEsc() { this.closeDrawer(); }
  @HostListener('window:resize') onResize() { if (!this.isMobile()) this.closeDrawer(); }

  isMobile() { return typeof window !== 'undefined' && window.innerWidth < 768; }
  toggleCollapsed() { this.collapsed.update(v => !v); }
  private readCollapsed() { try { return JSON.parse(localStorage.getItem('sb-collapsed') ?? 'false'); } catch { return false; } }
  openDrawer() { if (!this.drawerOpen()) { this.drawerOpen.set(true); this.syncBodyScroll(); } }
  closeDrawer() { if (this.drawerOpen()) { this.drawerOpen.set(false); this.syncBodyScroll(); } }
  private syncBodyScroll() { if (typeof document !== 'undefined') document.body.style.overflow = this.drawerOpen() ? 'hidden' : ''; }
  onMenuNavigate() { if (this.isMobile()) this.closeDrawer(); }

  onLogout(ev?: Event) {
    ev?.stopPropagation();
    localStorage.removeItem('access_token');
    this.auth.logout();
  }
}
