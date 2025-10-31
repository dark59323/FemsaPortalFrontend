import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'order-header',
  imports: [CommonModule],
  template: `
    <header class="h-12 border-b border-gray-200 bg-white flex items-center px-4">
      <span class="text-sm text-gray-700">Order • Header (placeholder)</span>
    </header>
  `
})
export class OrderHeaderComponent {}
