// src/app/features/order/ui/order-list.component.ts
import { Component, Input } from '@angular/core';
import { Order } from '@/app/entities/order/order.model';

@Component({
  standalone: true,
  selector: 'app-order-list',

  template: `
    <ul class="divide-y">
      @for (o of orders; track o.id) {
      <li class="py-2 flex justify-between">
        <span class="font-medium">#{{ o.id }}</span>
        <span>\${{ o.total }}</span>
      </li>
      }
    </ul>
  `,
})
export class OrderListComponent {
  @Input() orders: Order[] = [];
}
