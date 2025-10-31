import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MenuService } from '@/app/core/menu/menu.service';

@Component({
  standalone: true,
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="mt-1 text-sm">
      <ng-container *ngFor="let m of menu()">
        <a *ngIf="!m.children?.length"
           [routerLink]="to(m.route)"
           routerLinkActive="bg-black/15"
           class="group relative flex items-center gap-3 px-4 py-3 rounded-xl mx-2 my-1 hover:bg-black/10 transition"
           [attr.title]="collapsed ? m.label : null">
          <img *ngIf="m.svg" [src]="m.svg" class="w-5 h-5 opacity-95" alt="" />
          <span class="uppercase tracking-wide font-extrabold text-[15px] opacity-90"
                *ngIf="!collapsed">{{ m.label }}</span>
          <span routerLinkActive="opacity-100"
                class="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-l-full bg-white/80 opacity-0 transition"></span>
        </a>

        <div *ngIf="m.children?.length" class="mx-2 my-2">
          <div class="flex items-center gap-2 px-4 py-2 text-[11px] uppercase text-white/70" *ngIf="!collapsed">
            <img *ngIf="m.svg" [src]="m.svg" class="w-4 h-4 opacity-80" alt="" />
            {{ m.label }}
          </div>
          <a *ngFor="let ch of m.children"
             [routerLink]="to(ch.route)"
             routerLinkActive="bg-black/15"
             class="flex items-center gap-3 px-4 py-2 rounded-xl mx-2 my-1 hover:bg-black/10 transition"
             [attr.title]="collapsed ? ch.label : null">
            <span class="text-[14px] font-semibold" *ngIf="!collapsed">{{ ch.label }}</span>
          </a>
        </div>
      </ng-container>
    </nav>
  `
})
export class SidebarComponent {
  @Input() collapsed = false;

  private readonly menuSvc = inject(MenuService);
  readonly menu = this.menuSvc.filtered;

  to(route?: string | null) {
    if (!route) return '/app';
    if (route.startsWith('/app')) return route;
    return ['/app', route.replace(/^\//, '')];
  }
}


