// src/app/features/order/app/order.facade.ts
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, finalize } from 'rxjs';
import { Order } from '@/app/entities/order/order.model';
import { OrderHttpAdapter } from '../infra/order.http.adapter';

@Injectable({ providedIn: 'root' })
export class OrderFacade {
  private repo = inject(OrderHttpAdapter);
  readonly loading$ = new BehaviorSubject(false);
  readonly orders$  = new BehaviorSubject<Order[]>([]);

  load() {
    this.loading$.next(true);
    this.repo.list().pipe(finalize(() => this.loading$.next(false)))
      .subscribe(items => this.orders$.next(items));
  }
  create(total: number) {
    return this.repo.create({ total });
  }
}
