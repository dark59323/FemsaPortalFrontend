import { MenuItem } from '@/app/entities/menu/menu.entity';

export const MENU_CATALOG: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'DASHBOARD',
    route: 'dashboard', // relativo a /app (tu helper lo resuelve)
    svg: 'assets/icons/home_menu.svg',
  },

  // Sección Pricing (una sola, sin duplicados)
  {
    id: 'pricing',
    label: 'PRICING',
    svg: 'assets/icons/pricing_menu.svg',
    // Visible si el claim tiene el área PRICING:
    menu: { area: 'PRICING' },
    // Y opcionalmente exige rol (si declaras ambos, se cumplen ambos)
    required: { resource: 'framecontroller-backend', roles: ['Pricing'] },
    children: [
      // Índice de Pricing (si quieres tener /app/pricing)
      {
        id: 'pricing.index',
        label: 'Inicio Pricing',
        route: '/pricing/promociones', // tu helper lo convertirá a /app/pricing
        required: { resource: 'framecontroller-backend', roles: ['Pricing'] },
        menu: { area: 'PRICING' }, // basta con el área
      },
      // Opción exacta del token:
      {
        id: 'pricing.promotions',
        label: 'Validar Promociones',
        route: '/pricing', // debe calzar con el path del claim
        required: { resource: 'framecontroller-backend', roles: ['Pricing'] },
        menu: { area: 'PRICING', path: '/pricing/promotions' }, // del token
      },
    ],
  },
];
