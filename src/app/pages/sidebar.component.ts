import { Component, inject, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MenuService } from '@/app/core/menu/menu.service';

type MenuItem = {
  label: string;
  route?: string | null;
  svg?: string;
  children?: MenuItem[];
  id?: string; // opcional si ya lo tienes en tu modelo
};

@Component({
  standalone: true,
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="mt-1 text-sm">
      <ng-container *ngFor="let m of menu(); trackBy: trackByLabel">
        <!-- ÍTEM SIN HIJOS -->
        <a
          *ngIf="!m.children?.length"
          [routerLink]="to(m.route)"
          routerLinkActive="bg-black/15"
          class="group relative flex items-center gap-3 px-4 py-3 rounded-xl mx-2 my-1 hover:bg-black/10 transition"
          [attr.title]="collapsed ? m.label : null"
        >
          <img *ngIf="m.svg" [src]="m.svg" class="w-5 h-5 opacity-95" alt="" />
          <span
            class="uppercase tracking-wide font-extrabold text-[15px] opacity-90"
            *ngIf="!collapsed"
            >{{ m.label }}</span
          >
          <span
            routerLinkActive="opacity-100"
            class="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-l-full bg-white/80 opacity-0 transition"
          ></span>
        </a>

        <div *ngIf="m.children?.length" class="mx-2 my-2">
          <!-- CABECERA IGUAL A LOS LINKS -->
          <button
            type="button"
            (click)="toggle(openKey(m))"
            class="group relative flex items-center gap-3 px-4 py-3 rounded-xl w-full mx-0 hover:bg-black/10 transition"
            [attr.title]="collapsed ? m.label : null"
            [attr.aria-expanded]="isOpen(openKey(m))"
          >
            <img *ngIf="m.svg" [src]="m.svg" class="w-5 h-5 opacity-95" alt="" />
            <span
              class="uppercase tracking-wide font-extrabold text-[15px] opacity-90"
              *ngIf="!collapsed"
            >
              {{ m.label }}
            </span>
            <svg
              viewBox="0 0 20 20"
              class="w-4 h-4 ml-auto transition-transform duration-200"
              [class.rotate-90]="isOpen(openKey(m))"
            >
              <path fill="currentColor" d="M7 5l6 5-6 5V5z" />
            </svg>
          </button>

          <!-- DESPLEGABLE -->
          <div
            class="overflow-hidden transition-[max-height] duration-300 ease-in-out"
            [style.maxHeight.px]="!collapsed && isOpen(openKey(m)) ? 500 : 0"
          >
            <div class="mt-2 ml-6 flex flex-col gap-1 pb-1">
              <a
                *ngFor="let ch of m.children"
                [routerLink]="to(ch.route)"
                routerLinkActive="bg-black/15"
                class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-black/10 transition"
                [attr.title]="collapsed ? ch.label : null"
              >
                <span class="text-[14px] font-semibold" *ngIf="!collapsed">{{ ch.label }}</span>
              </a>
            </div>
          </div>
        </div>
      </ng-container>
    </nav>
  `,
})
export class SidebarComponent {
  @Input() collapsed = false;

  private readonly menuSvc = inject(MenuService);
  readonly menu = this.menuSvc.filtered as () => MenuItem[];

  // Conjunto de grupos abiertos (acordeón simple)
  private open = signal<Set<string>>(new Set());

  // Clave estable para cada grupo (usa id si la tienes; si no, usa label)
  openKey(m: MenuItem): string {
    return m.id ?? m.label;
  }

  toggle(key: string) {
    // Si quieres acordeón exclusivo, descomenta las 2 líneas y elimina el Set copy:
    // this.open.set(new Set(this.open().has(key) ? [] : [key]));
    const next = new Set(this.open());
    next.has(key) ? next.delete(key) : next.add(key);
    this.open.set(next);
  }

  isOpen(key: string): boolean {
    return this.open().has(key);
  }

  to(route?: string | null) {
  if (!route) return '/app';
  if (route.startsWith('/app')) return route;   // ya es absoluta
  const clean = route.replace(/^\/+/, '');      // quita / inicial
  return `/app/${clean}`;                       // => /app/xxx/yyy
}


  trackByLabel = (_: number, item: MenuItem) => item.id ?? item.label;
}
