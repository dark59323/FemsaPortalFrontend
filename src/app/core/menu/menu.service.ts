import { Injectable, computed, signal } from '@angular/core';
import { MENU_CATALOG } from '@/app/core/adapters/menu.adapter';
import { MenuItem } from '@/app/entities/menu/menu.entity';
import { AuthService } from '@/app/core/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private catalog = signal<MenuItem[]>(MENU_CATALOG);

  constructor(private auth: AuthService) {}

  filtered = computed<MenuItem[]>(() => {
    const allow = (mi: MenuItem) => {
      const byRole =
        !mi.required || this.auth.hasAny(mi.required.resource, mi.required.roles);

      const byMenu =
        !mi.menu || (
          mi.menu.path || mi.menu.label
            ? this.auth.hasMenuItem(mi.menu.area, { path: mi.menu.path, label: mi.menu.label })
            : this.auth.hasMenuArea(mi.menu.area)
        );

      // Si declaras ambos, exige ambos; si declaras uno, con ese basta.
      if (mi.required && mi.menu) return byRole && byMenu;
      return byRole && byMenu;
    };

    const recurse = (arr: MenuItem[]): MenuItem[] =>
      arr
        .map(i => ({ ...i, children: i.children ? recurse(i.children) : undefined }))
        .filter(i => allow(i) || (i.children && i.children.length));

    return recurse(this.catalog());
  });
}
