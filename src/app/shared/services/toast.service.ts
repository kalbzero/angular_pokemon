import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: number;
  text: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private counter = 0;
  toasts = signal<ToastMessage[]>([]);

  show(text: string, type: 'success' | 'error' | 'info' = 'info') {
    const id = ++this.counter;

    const newToast: ToastMessage = { id, text, type };
    this.toasts.update((list) => [...list, newToast]);

    setTimeout(() => {
      this.remove(id);
    }, 3500);
  }

  remove(id: number) {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }
}
