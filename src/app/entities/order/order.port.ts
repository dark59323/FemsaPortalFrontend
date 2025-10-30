// src/app/entities/order/order.port.ts
import { Observable } from 'rxjs';
import { Order } from './order.model';

export interface OrderPort {
  list(): Observable<Order[]>;
  create(input: { total: number }): Observable<Order>;
}
