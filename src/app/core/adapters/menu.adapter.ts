import { MenuItem } from '@/app/entities/menu/menu.entity';

export const MENU_CATALOG: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'DASHBOARD',
    route: 'dashboard',
    svg: 'assets/icons/home_menu.svg'
  },
  {
    id: 'pricing',
    label: 'PRICING',
    svg: 'assets/icons/pricing_menu.svg',
    route: 'pricing/promotions',
    menu: { area: 'PRICING' },
    children: [
      {
        id: 'pricing.validatePromotions',
        label: 'Validar Promociones',
        route: '/pricing/validate-promotions',
        required: { resource: 'framecontroller-backend', roles: ['Pricing'] },
        menu: { area: 'PRICING' }
      },
      {
        id: 'pricing.viewPromotions',
        label: 'Ver Promociones',
        route: '/pricing/view-promotions',
        required: { resource: 'framecontroller-backend', roles: ['Pricing'] },
        menu: { area: 'PRICING' }
      }
    ]
  }
];
