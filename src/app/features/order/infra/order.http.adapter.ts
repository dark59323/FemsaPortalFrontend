// src/app/features/order/infra/order.http.adapter.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { OrderPort } from '@/app/entities/order/order.port';
import { Order } from '@/app/entities/order/order.model';

@Injectable({ providedIn: 'root' })
export class OrderHttpAdapter implements OrderPort {
  private http = inject(HttpClient);
  private base = '/api/orders';

  list(): Observable<Order[]> {
    return this.http.get<any[]>(this.base).pipe(map(rows => rows.map(this.toOrder)));
  }
  create(input: { total: number }): Observable<Order> {
    return this.http.post<any>(this.base, { total: input.total }).pipe(map(this.toOrder));
  }

  private toOrder = (r: any): Order => ({
    id: r.id,
    total: r.total,
    createdAt: r.created_at ?? r.createdAt
  });
}
