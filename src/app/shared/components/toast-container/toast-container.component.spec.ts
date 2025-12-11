import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastContainerComponent } from './toast-container.component';
import { ToastService, ToastMessage } from '../../services/toast.service';

describe('ToastContainerComponent', () => {
  let component: ToastContainerComponent;
  let fixture: ComponentFixture<ToastContainerComponent>;
  let toastService: ToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastContainerComponent],
      providers: [ToastService],
    }).compileComponents();

    fixture = TestBed.createComponent(ToastContainerComponent);
    component = fixture.componentInstance;
    toastService = TestBed.inject(ToastService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('toasts signal', () => {
    it('should expose toasts signal from service', () => {
      expect(component.toasts).toBeDefined();
      expect(typeof component.toasts).toBe('function');
    });

    it('should initially have empty toasts array', () => {
      expect(component.toasts()).toEqual([]);
    });

    it('should reflect new toasts added to service', () => {
      toastService.show('Test message', 'success');
      fixture.detectChanges();
      expect(component.toasts().length).toBe(1);
    });

    it('should reflect multiple toasts added to service', () => {
      toastService.show('Message 1', 'success');
      toastService.show('Message 2', 'error');
      toastService.show('Message 3', 'info');
      fixture.detectChanges();
      expect(component.toasts().length).toBe(3);
    });

    it('should reflect toast removal from service', () => {
      const toast1 = { id: 1, text: 'Message 1', type: 'success' as const };
      const toast2 = { id: 2, text: 'Message 2', type: 'error' as const };
      toastService.toasts.set([toast1, toast2]);
      fixture.detectChanges();
      expect(component.toasts().length).toBe(2);

      toastService.remove(1);
      fixture.detectChanges();
      expect(component.toasts().length).toBe(1);
    });
  });

  describe('template rendering', () => {
    it('should render empty toast-wrapper when no toasts', () => {
      const wrapper = fixture.nativeElement.querySelector('.toast-wrapper');
      expect(wrapper).toBeTruthy();
      expect(wrapper.children.length).toBe(0);
    });

    it('should render toast-wrapper div', () => {
      const wrapper = fixture.nativeElement.querySelector('.toast-wrapper');
      expect(wrapper).toBeTruthy();
      expect(wrapper.classList.contains('toast-wrapper')).toBe(true);
    });

    it('should render single toast', () => {
      toastService.show('Test message', 'success');
      fixture.detectChanges();

      const toasts = fixture.nativeElement.querySelectorAll('.toast');
      expect(toasts.length).toBe(1);
    });

    it('should render multiple toasts', () => {
      toastService.show('Message 1', 'success');
      toastService.show('Message 2', 'error');
      toastService.show('Message 3', 'info');
      fixture.detectChanges();

      const toasts = fixture.nativeElement.querySelectorAll('.toast');
      expect(toasts.length).toBe(3);
    });

    it('should display toast text content', () => {
      toastService.show('Hello World', 'success');
      fixture.detectChanges();

      const toast = fixture.nativeElement.querySelector('.toast');
      expect(toast.textContent).toContain('Hello World');
    });

    it('should display multiple toast text contents', () => {
      toastService.show('First message', 'success');
      toastService.show('Second message', 'error');
      fixture.detectChanges();

      const toasts = fixture.nativeElement.querySelectorAll('.toast');
      expect(toasts[0].textContent).toContain('First message');
      expect(toasts[1].textContent).toContain('Second message');
    });
  });

  describe('success toast styling', () => {
    it('should apply success class to success toast', () => {
      toastService.show('Success message', 'success');
      fixture.detectChanges();

      const toast = fixture.nativeElement.querySelector('.toast');
      expect(toast.classList.contains('success')).toBe(true);
      expect(toast.classList.contains('error')).toBe(false);
    });

    it('should apply success class only to success toasts', () => {
      toastService.show('Success', 'success');
      toastService.show('Error', 'error');
      fixture.detectChanges();

      const toasts = fixture.nativeElement.querySelectorAll('.toast');
      expect(toasts[0].classList.contains('success')).toBe(true);
      expect(toasts[1].classList.contains('success')).toBe(false);
    });

    it('should have success class but not error class for success toast', () => {
      toastService.show('Success', 'success');
      fixture.detectChanges();

      const toast = fixture.nativeElement.querySelector('.toast');
      expect(toast.classList.contains('success')).toBe(true);
      expect(toast.classList.contains('error')).toBe(false);
    });
  });

  describe('error toast styling', () => {
    it('should apply error class to error toast', () => {
      toastService.show('Error message', 'error');
      fixture.detectChanges();

      const toast = fixture.nativeElement.querySelector('.toast');
      expect(toast.classList.contains('error')).toBe(true);
      expect(toast.classList.contains('success')).toBe(false);
    });

    it('should apply error class only to error toasts', () => {
      toastService.show('Success', 'success');
      toastService.show('Error', 'error');
      fixture.detectChanges();

      const toasts = fixture.nativeElement.querySelectorAll('.toast');
      expect(toasts[0].classList.contains('error')).toBe(false);
      expect(toasts[1].classList.contains('error')).toBe(true);
    });

    it('should have error class but not success class for error toast', () => {
      toastService.show('Error', 'error');
      fixture.detectChanges();

      const toast = fixture.nativeElement.querySelector('.toast');
      expect(toast.classList.contains('error')).toBe(true);
      expect(toast.classList.contains('success')).toBe(false);
    });
  });

  describe('info toast styling', () => {
    it('should not apply success or error class to info toast', () => {
      toastService.show('Info message', 'info');
      fixture.detectChanges();

      const toast = fixture.nativeElement.querySelector('.toast');
      expect(toast.classList.contains('success')).toBe(false);
      expect(toast.classList.contains('error')).toBe(false);
    });

    it('should render info toast with only toast class', () => {
      toastService.show('Info', 'info');
      fixture.detectChanges();

      const toast = fixture.nativeElement.querySelector('.toast');
      expect(toast.classList.length).toBe(1);
      expect(toast.classList.contains('toast')).toBe(true);
    });
  });

  describe('mixed toast types', () => {
    it('should apply correct classes for mixed toast types', () => {
      toastService.show('Success', 'success');
      toastService.show('Error', 'error');
      toastService.show('Info', 'info');
      fixture.detectChanges();

      const toasts = fixture.nativeElement.querySelectorAll('.toast');
      expect(toasts[0].classList.contains('success')).toBe(true);
      expect(toasts[0].classList.contains('error')).toBe(false);
      expect(toasts[1].classList.contains('error')).toBe(true);
      expect(toasts[1].classList.contains('success')).toBe(false);
      expect(toasts[2].classList.contains('success')).toBe(false);
      expect(toasts[2].classList.contains('error')).toBe(false);
    });

    it('should display correct text for mixed toast types', () => {
      toastService.show('Success message', 'success');
      toastService.show('Error message', 'error');
      toastService.show('Info message', 'info');
      fixture.detectChanges();

      const toasts = fixture.nativeElement.querySelectorAll('.toast');
      expect(toasts[0].textContent).toContain('Success message');
      expect(toasts[1].textContent).toContain('Error message');
      expect(toasts[2].textContent).toContain('Info message');
    });
  });

  describe('toast removal', () => {
    it('should remove toast from DOM when service removes it', () => {
      toastService.show('Message 1', 'success');
      toastService.show('Message 2', 'error');
      fixture.detectChanges();

      let toasts = fixture.nativeElement.querySelectorAll('.toast');
      expect(toasts.length).toBe(2);

      toastService.remove(1);
      fixture.detectChanges();

      toasts = fixture.nativeElement.querySelectorAll('.toast');
      expect(toasts.length).toBe(1);
    });

    it('should remove all toasts when all are removed from service', () => {
      toastService.show('Message 1', 'success');
      toastService.show('Message 2', 'error');
      fixture.detectChanges();

      toastService.remove(1);
      toastService.remove(2);
      fixture.detectChanges();

      const toasts = fixture.nativeElement.querySelectorAll('.toast');
      expect(toasts.length).toBe(0);
    });

    it('should preserve remaining toast when one is removed', () => {
      toastService.show('Keep this', 'success');
      toastService.show('Remove this', 'error');
      fixture.detectChanges();

      toastService.remove(2);
      fixture.detectChanges();

      const toasts = fixture.nativeElement.querySelectorAll('.toast');
      expect(toasts.length).toBe(1);
      expect(toasts[0].textContent).toContain('Keep this');
    });
  });

  describe('toast tracking', () => {
    it('should track toasts by id', () => {
      const toast1: ToastMessage = { id: 1, text: 'Message 1', type: 'success' };
      const toast2: ToastMessage = { id: 2, text: 'Message 2', type: 'error' };
      toastService.toasts.set([toast1, toast2]);
      fixture.detectChanges();

      expect(component.toasts()[0].id).toBe(1);
      expect(component.toasts()[1].id).toBe(2);
    });

    it('should render toasts in the order they were added', () => {
      toastService.show('First', 'success');
      toastService.show('Second', 'error');
      toastService.show('Third', 'info');
      fixture.detectChanges();

      const toasts = fixture.nativeElement.querySelectorAll('.toast');
      expect(toasts[0].textContent).toContain('First');
      expect(toasts[1].textContent).toContain('Second');
      expect(toasts[2].textContent).toContain('Third');
    });
  });

  describe('edge cases', () => {
    it('should handle empty toast message', () => {
      toastService.show('', 'success');
      fixture.detectChanges();

      const toasts = fixture.nativeElement.querySelectorAll('.toast');
      expect(toasts.length).toBe(1);
    });

    it('should handle toast with long text', () => {
      const longText = 'A'.repeat(100);
      toastService.show(longText, 'success');
      fixture.detectChanges();

      const toast = fixture.nativeElement.querySelector('.toast');
      expect(toast.textContent).toContain(longText);
    });

    it('should handle special characters in toast text', () => {
      const specialText = '<script>alert("xss")</script>';
      toastService.show(specialText, 'success');
      fixture.detectChanges();

      const toast = fixture.nativeElement.querySelector('.toast');
      expect(toast.textContent).toContain(specialText);
      expect(toast.innerHTML).not.toContain('<script>');
    });

    it('should handle unicode characters in toast text', () => {
      toastService.show('Hello 🎉 World', 'success');
      fixture.detectChanges();

      const toast = fixture.nativeElement.querySelector('.toast');
      expect(toast.textContent).toContain('Hello 🎉 World');
    });

    it('should handle rapid toast additions', () => {
      for (let i = 0; i < 10; i++) {
        toastService.show(`Message ${i}`, 'success');
      }
      fixture.detectChanges();

      const toasts = fixture.nativeElement.querySelectorAll('.toast');
      expect(toasts.length).toBe(10);
    });
  });
});
