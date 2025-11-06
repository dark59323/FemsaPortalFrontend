// src/app/core/theme/theme.service.ts
import { Injectable, effect, signal } from '@angular/core';

type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // Signal para el tema actual, inicializado desde localStorage o por defecto 'light'
  readonly theme = signal<Theme>(this.readTheme());

  constructor() {
    // Cada vez que 'theme' cambia, actualiza la clase 'dark' en el body
    // y guarda la preferencia en localStorage.
    effect(() => {
      const currentTheme = this.theme();
      if (typeof document !== 'undefined') {
        const body = document.body;
        if (currentTheme === 'dark') {
          body.classList.add('dark');
        } else {
          body.classList.remove('dark');
        }
      }
      localStorage.setItem('theme', currentTheme);
    });
  }

  // Alterna entre 'light' y 'dark'
  toggleTheme() {
    this.theme.update(current => (current === 'light' ? 'dark' : 'light'));
  }

  // Lee la preferencia de tema desde localStorage
  private readTheme(): Theme {
    if (typeof localStorage !== 'undefined') {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme === 'dark' || storedTheme === 'light') {
        return storedTheme;
      }
    }
    // Si no hay preferencia guardada, intenta usar la del sistema
    /**f (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }**/
    return 'light'; // Por defecto, claro
  }
}