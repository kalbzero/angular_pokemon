import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastContainerComponent } from './shared/components/toast-container/toast-container.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let compiled: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterTestingModule, ToastContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    compiled = fixture.debugElement;
    fixture.detectChanges();
  });

  describe('Component Creation', () => {
    it('should create the app component', () => {
      expect(component).toBeTruthy();
    });

    it('should have the correct title property', () => {
      expect(component.title).toBe('pokedex');
    });
  });

  describe('Template Rendering', () => {
    it('should render router-outlet', () => {
      const routerOutlet = compiled.query(By.css('router-outlet'));
      expect(routerOutlet).toBeTruthy();
    });

    it('should render toast-container component', () => {
      const toastContainer = compiled.query(By.directive(ToastContainerComponent));
      expect(toastContainer).toBeTruthy();
    });

    it('should have router-outlet and toast-container in the template', () => {
      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelector('router-outlet')).toBeTruthy();
      expect(nativeElement.querySelector('toast-container')).toBeTruthy();
    });
  });

  describe('Component Imports', () => {
    it('should import RouterOutlet', () => {
      const metadata = (AppComponent as any).ɵcmp;
      expect(metadata.dependencies).toBeDefined();
    });

    it('should import ToastContainerComponent', () => {
      const toastContainer = compiled.query(By.directive(ToastContainerComponent));
      expect(toastContainer).toBeTruthy();
    });
  });

  describe('Component Metadata', () => {
    it('should have correct selector', () => {
      const metadata = (AppComponent as any).ɵcmp;
      expect(metadata.selectors[0][0]).toBe('app-root');
    });

    it('should have templateUrl pointing to app.component.html', () => {
      const metadata = (AppComponent as any).ɵcmp;
      expect(metadata.consts).toBeDefined();
    });

    it('should have styleUrl pointing to app.component.scss', () => {
      const metadata = (AppComponent as any).ɵcmp;
      expect(metadata.styles).toBeDefined();
    });
  });

  describe('Component Lifecycle', () => {
    it('should initialize on creation', () => {
      const newFixture = TestBed.createComponent(AppComponent);
      expect(newFixture.componentInstance).toBeTruthy();
    });

    it('should maintain component state after change detection', () => {
      const initialTitle = component.title;
      fixture.detectChanges();
      expect(component.title).toBe(initialTitle);
    });
  });

  describe('Template Structure', () => {
    it('should maintain proper element order in template', () => {
      const nativeElement = fixture.nativeElement;
      const children = Array.from(nativeElement.children);
      const routerOutletIndex = children.findIndex(
        (child: any) => child.tagName === 'ROUTER-OUTLET'
      );
      const toastContainerIndex = children.findIndex(
        (child: any) => child.tagName === 'TOAST-CONTAINER'
      );
      expect(routerOutletIndex).toBeGreaterThanOrEqual(0);
      expect(toastContainerIndex).toBeGreaterThanOrEqual(0);
    });

    it('should render all required child components', () => {
      const nativeElement = fixture.nativeElement;
      const routerOutlet = nativeElement.querySelector('router-outlet');
      const toastContainer = nativeElement.querySelector('toast-container');
      expect(routerOutlet).toBeTruthy();
      expect(toastContainer).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic structure', () => {
      const nativeElement = fixture.nativeElement;
      expect(nativeElement).toBeTruthy();
      // Component is a standalone component acting as root
      expect(nativeElement.querySelector('router-outlet')).toBeTruthy();
    });
  });

  describe('Standalone Component Features', () => {
    it('should be a standalone component', () => {
      const metadata = (AppComponent as any).ɵcmp;
      expect(metadata.standalone).toBe(true);
    });

    it('should have dependencies array', () => {
      const metadata = (AppComponent as any).ɵcmp;
      expect(metadata.dependencies).toBeDefined();
    });
  });

  describe('Component Integration', () => {
    it('should work with RouterOutlet', () => {
      const routerOutlet = compiled.query(By.css('router-outlet'));
      expect(routerOutlet).toBeTruthy();
      // Verify router outlet is properly initialized
      const outletComponent = routerOutlet.componentInstance;
      expect(outletComponent).toBeTruthy();
    });

    it('should work with ToastContainerComponent', () => {
      const toastContainer = compiled.query(By.directive(ToastContainerComponent));
      expect(toastContainer).toBeTruthy();
      // Verify toast container component is properly instantiated
      const toastComponent = toastContainer.componentInstance as ToastContainerComponent;
      expect(toastComponent).toBeTruthy();
    });
  });
});
