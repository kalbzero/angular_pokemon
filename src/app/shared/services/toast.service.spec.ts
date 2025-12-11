import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ToastService, ToastMessage } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('toasts signal', () => {
    it('should initialize with empty array', () => {
      expect(service.toasts()).toEqual([]);
    });

    it('should be a signal', () => {
      expect(typeof service.toasts).toBe('function');
    });

    it('should track toast messages', () => {
      service.show('Test message');
      expect(service.toasts().length).toBe(1);
    });

    it('should return current toasts when called as signal', () => {
      service.show('Toast 1');
      service.show('Toast 2');
      const toasts = service.toasts();
      expect(Array.isArray(toasts)).toBe(true);
      expect(toasts.length).toBe(2);
    });
  });

  describe('show method', () => {
    it('should add success toast', () => {
      service.show('Success message', 'success');
      const toasts = service.toasts();
      expect(toasts.length).toBe(1);
      expect(toasts[0].type).toBe('success');
      expect(toasts[0].text).toBe('Success message');
    });

    it('should add error toast', () => {
      service.show('Error message', 'error');
      const toasts = service.toasts();
      expect(toasts.length).toBe(1);
      expect(toasts[0].type).toBe('error');
      expect(toasts[0].text).toBe('Error message');
    });

    it('should add info toast with default type', () => {
      service.show('Info message');
      const toasts = service.toasts();
      expect(toasts.length).toBe(1);
      expect(toasts[0].type).toBe('info');
    });

    it('should add info toast when type not specified', () => {
      service.show('Default toast');
      expect(service.toasts()[0].type).toBe('info');
    });

    it('should assign unique id to each toast', () => {
      service.show('Toast 1');
      service.show('Toast 2');
      service.show('Toast 3');
      const toasts = service.toasts();
      expect(toasts[0].id).not.toBe(toasts[1].id);
      expect(toasts[1].id).not.toBe(toasts[2].id);
    });

    it('should increment id for each new toast', () => {
      service.show('First');
      const firstId = service.toasts()[0].id;
      service.show('Second');
      const secondId = service.toasts()[1].id;
      expect(secondId).toBeGreaterThan(firstId);
    });

    it('should add multiple toasts', () => {
      service.show('Toast 1', 'success');
      service.show('Toast 2', 'error');
      service.show('Toast 3', 'info');
      expect(service.toasts().length).toBe(3);
    });

    it('should preserve toast message text', () => {
      const text = 'Important notification';
      service.show(text, 'success');
      expect(service.toasts()[0].text).toBe(text);
    });

    it('should handle empty string message', () => {
      service.show('', 'success');
      expect(service.toasts().length).toBe(1);
      expect(service.toasts()[0].text).toBe('');
    });

    it('should handle long message text', () => {
      const longText = 'A'.repeat(500);
      service.show(longText, 'info');
      expect(service.toasts()[0].text).toBe(longText);
    });

    it('should handle special characters in message', () => {
      const specialText = 'Error: !@#$%^&*()_+-=[]{}|;:\'"<>,.?/';
      service.show(specialText, 'error');
      expect(service.toasts()[0].text).toBe(specialText);
    });

    it('should handle unicode characters in message', () => {
      const unicodeText = '你好 مرحبا привет 🎉';
      service.show(unicodeText, 'success');
      expect(service.toasts()[0].text).toBe(unicodeText);
    });

    it('should handle whitespace in message', () => {
      const textWithWhitespace = '  Text with   spaces  and\nnewlines  ';
      service.show(textWithWhitespace, 'info');
      expect(service.toasts()[0].text).toBe(textWithWhitespace);
    });

    it('should auto-remove toast after 3500ms', fakeAsync(() => {
      service.show('Auto-remove toast', 'info');
      expect(service.toasts().length).toBe(1);

      tick(3500);
      expect(service.toasts().length).toBe(0);
    }));

    it('should not remove toast before timeout', fakeAsync(() => {
      service.show('Still visible toast', 'success');
      tick(3499);
      expect(service.toasts().length).toBe(1);
    }));

    it('should remove toast after exactly 3500ms', fakeAsync(() => {
      service.show('Timeout test', 'error');
      tick(3500);
      expect(service.toasts().length).toBe(0);
    }));

    it('should handle multiple toasts with auto-removal', fakeAsync(() => {
      service.show('Toast 1', 'success');
      tick(500);
      service.show('Toast 2', 'error');
      tick(2500);
      // At 3000ms: Toast 1 not removed yet (at 3500), Toast 2 not removed yet (at 4000)
      expect(service.toasts().length).toBe(2);
      tick(600);
      // At 3600ms: Toast 1 removed (at 3500), Toast 2 still exists (at 4000)
      expect(service.toasts().length).toBe(1);
      tick(500);
      // At 4100ms: Toast 2 removed (at 4000)
      expect(service.toasts().length).toBe(0);
    }));
  });

  describe('remove method', () => {
    it('should remove toast by id', () => {
      service.show('Toast to remove', 'info');
      const toastId = service.toasts()[0].id;
      service.remove(toastId);
      expect(service.toasts().length).toBe(0);
    });

    it('should remove only the specified toast', () => {
      service.show('Toast 1', 'success');
      service.show('Toast 2', 'error');
      service.show('Toast 3', 'info');
      const secondToastId = service.toasts()[1].id;
      service.remove(secondToastId);
      expect(service.toasts().length).toBe(2);
      expect(service.toasts().find((t) => t.id === secondToastId)).toBeUndefined();
    });

    it('should not affect other toasts when removing one', () => {
      service.show('Toast 1', 'success');
      service.show('Toast 2', 'error');
      service.show('Toast 3', 'info');
      const firstToastId = service.toasts()[0].id;
      const thirdToastId = service.toasts()[2].id;
      service.remove(service.toasts()[1].id);
      const toasts = service.toasts();
      expect(toasts.find((t) => t.id === firstToastId)).toBeTruthy();
      expect(toasts.find((t) => t.id === thirdToastId)).toBeTruthy();
    });

    it('should handle removing non-existent id', () => {
      service.show('Existing toast', 'info');
      service.remove(9999);
      expect(service.toasts().length).toBe(1);
    });

    it('should handle removing from empty toasts', () => {
      service.remove(1);
      expect(service.toasts().length).toBe(0);
    });

    it('should preserve all toasts except removed one', () => {
      service.show('Keep 1', 'success');
      service.show('Remove this', 'error');
      service.show('Keep 2', 'info');
      const idToRemove = service.toasts()[1].id;
      service.remove(idToRemove);
      const toasts = service.toasts();
      expect(toasts[0].text).toBe('Keep 1');
      expect(toasts[1].text).toBe('Keep 2');
    });

    it('should allow manual removal before timeout', fakeAsync(() => {
      service.show('Manual remove test', 'success');
      const toastId = service.toasts()[0].id;
      tick(1000);
      service.remove(toastId);
      expect(service.toasts().length).toBe(0);
      tick(2500);
      expect(service.toasts().length).toBe(0);
    }));
  });

  describe('toast message interface', () => {
    it('should create toast with required properties', () => {
      service.show('Test message', 'success');
      const toast = service.toasts()[0];
      expect(toast.id).toBeDefined();
      expect(toast.text).toBeDefined();
      expect(toast.type).toBeDefined();
    });

    it('should have numeric id', () => {
      service.show('Message', 'info');
      const toast = service.toasts()[0];
      expect(typeof toast.id).toBe('number');
      expect(toast.id).toBeGreaterThan(0);
    });

    it('should have string text', () => {
      service.show('Message text', 'error');
      const toast = service.toasts()[0];
      expect(typeof toast.text).toBe('string');
    });

    it('should have valid type', () => {
      service.show('Success', 'success');
      service.show('Error', 'error');
      service.show('Info', 'info');
      const toasts = service.toasts();
      expect(['success', 'error', 'info']).toContain(toasts[0].type);
      expect(['success', 'error', 'info']).toContain(toasts[1].type);
      expect(['success', 'error', 'info']).toContain(toasts[2].type);
    });
  });

  describe('service lifecycle', () => {
    it('should be provided in root', () => {
      const serviceInstance = TestBed.inject(ToastService);
      expect(serviceInstance).toBeTruthy();
    });

    it('should maintain state across multiple calls', () => {
      service.show('First', 'success');
      expect(service.toasts().length).toBe(1);
      service.show('Second', 'error');
      expect(service.toasts().length).toBe(2);
      service.remove(service.toasts()[0].id);
      expect(service.toasts().length).toBe(1);
    });

    it('should handle rapid successive calls', () => {
      service.show('Rapid 1');
      service.show('Rapid 2');
      service.show('Rapid 3');
      service.show('Rapid 4');
      service.show('Rapid 5');
      expect(service.toasts().length).toBe(5);
    });

    it('should handle show and remove in any order', () => {
      service.show('A', 'success');
      service.show('B', 'error');
      service.remove(service.toasts()[0].id);
      service.show('C', 'info');
      expect(service.toasts().length).toBe(2);
    });
  });

  describe('edge cases', () => {
    it('should handle multiple auto-removals at same time', fakeAsync(() => {
      service.show('Simultaneous 1', 'success');
      service.show('Simultaneous 2', 'error');
      service.show('Simultaneous 3', 'info');
      expect(service.toasts().length).toBe(3);
      tick(3500);
      expect(service.toasts().length).toBe(0);
    }));

    it('should continue working after multiple removals', () => {
      service.show('Toast 1', 'success');
      service.show('Toast 2', 'error');
      service.remove(service.toasts()[0].id);
      service.remove(service.toasts()[0].id);
      expect(service.toasts().length).toBe(0);
      service.show('Toast 3', 'info');
      expect(service.toasts().length).toBe(1);
    });

    it('should handle removing same id twice', () => {
      service.show('Message', 'success');
      const toastId = service.toasts()[0].id;
      service.remove(toastId);
      expect(service.toasts().length).toBe(0);
      service.remove(toastId);
      expect(service.toasts().length).toBe(0);
    });

    it('should generate unique ids even after removals', () => {
      service.show('First', 'success');
      const firstId = service.toasts()[0].id;
      service.remove(firstId);
      service.show('Second', 'error');
      const secondId = service.toasts()[0].id;
      expect(secondId).toBeGreaterThan(firstId);
    });

    it('should handle all toast types in sequence', () => {
      service.show('Type test 1', 'success');
      service.show('Type test 2', 'error');
      service.show('Type test 3', 'info');
      service.show('Type test 4', 'success');
      service.show('Type test 5', 'error');
      const toasts = service.toasts();
      expect(toasts[0].type).toBe('success');
      expect(toasts[1].type).toBe('error');
      expect(toasts[2].type).toBe('info');
      expect(toasts[3].type).toBe('success');
      expect(toasts[4].type).toBe('error');
    });
  });
});
