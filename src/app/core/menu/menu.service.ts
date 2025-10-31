import { Injectable, computed, signal } from '@angular/core';
import { MENU_CATALOG } from '@/app/core/adapters/menu.adapter';
import { MenuItem } from '@/app/entities/menu/menu.entity';
import { AuthService } from '@/app/core/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private catalog = signal<MenuItem[]>(MENU_CATALOG);

  filtered = computed<MenuItem[]>(() => {
    const allow = (mi: MenuItem) =>
      !mi.required || this.auth.hasAny(mi.required.resource, mi.required.roles);

    const recurse = (arr: MenuItem[]): MenuItem[] =>
      arr.map(i => ({ ...i, children: i.children ? recurse(i.children) : undefined }))
         .filter(i => allow(i) || (i.children && i.children.length));

    return recurse(this.catalog());
  });

  constructor(private auth: AuthService) {}
}
