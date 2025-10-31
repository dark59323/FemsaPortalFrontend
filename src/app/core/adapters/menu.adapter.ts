import { MenuItem } from '@/app/entities/menu/menu.entity';

export const MENU_CATALOG: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'DASHBOARD',
    route: 'dashboard',                         // relativo al shell /app
    svg: 'assets/icons/home_menu.svg'
  },
  {
    id: 'pricing',
    label: 'PRICING',
    route: 'pricing',                           // relativo al shell /app
    svg: 'assets/icons/pricing_menu.svg',
    required: { resource: 'framecontroller-backend', roles: ['Pricing'] }
  }
];