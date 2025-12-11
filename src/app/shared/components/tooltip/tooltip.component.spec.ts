import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TooltipComponent } from './tooltip.component';

describe('TooltipComponent', () => {
  let component: TooltipComponent;
  let fixture: ComponentFixture<TooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TooltipComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TooltipComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('text input signal', () => {
    it('should have text input signal with default empty string', () => {
      expect(component.text()).toBe('');
    });

    it('should accept text input value', () => {
      fixture.componentRef.setInput('text', 'Test tooltip text');
      expect(component.text()).toBe('Test tooltip text');
    });

    it('should update text input signal when changed', () => {
      fixture.componentRef.setInput('text', 'Initial text');
      expect(component.text()).toBe('Initial text');

      fixture.componentRef.setInput('text', 'Updated text');
      expect(component.text()).toBe('Updated text');
    });

    it('should handle empty string input', () => {
      fixture.componentRef.setInput('text', '');
      expect(component.text()).toBe('');
    });

    it('should handle long text input', () => {
      const longText =
        'This is a very long tooltip text that spans multiple words and contains detailed information about the UI element';
      fixture.componentRef.setInput('text', longText);
      expect(component.text()).toBe(longText);
    });

    it('should handle special characters in text', () => {
      const specialText = 'Special chars: !@#$%^&*()_+-=[]{}|;\':"<>,.?/';
      fixture.componentRef.setInput('text', specialText);
      expect(component.text()).toBe(specialText);
    });

    it('should handle unicode characters in text', () => {
      const unicodeText = 'Unicode: 你好 مرحبا привет 🎉';
      fixture.componentRef.setInput('text', unicodeText);
      expect(component.text()).toBe(unicodeText);
    });

    it('should handle text with whitespace', () => {
      const textWithWhitespace = '  Text with   spaces  and\nnewlines  ';
      fixture.componentRef.setInput('text', textWithWhitespace);
      expect(component.text()).toBe(textWithWhitespace);
    });
  });

  describe('template rendering', () => {
    it('should render tooltip-icon span', () => {
      fixture.detectChanges();
      const tooltipIcon = fixture.nativeElement.querySelector('.tooltip-icon');
      expect(tooltipIcon).toBeTruthy();
    });

    it('should render info icon symbol', () => {
      fixture.detectChanges();
      const tooltipIcon = fixture.nativeElement.querySelector('.tooltip-icon');
      expect(tooltipIcon.textContent).toContain('ⓘ');
    });

    it('should render tooltip-box span', () => {
      fixture.detectChanges();
      const tooltipBox = fixture.nativeElement.querySelector('.tooltip-box');
      expect(tooltipBox).toBeTruthy();
    });

    it('should display text input in tooltip-box', () => {
      fixture.componentRef.setInput('text', 'Helpful tooltip');
      fixture.detectChanges();
      const tooltipBox = fixture.nativeElement.querySelector('.tooltip-box');
      expect(tooltipBox.textContent).toBe('Helpful tooltip');
    });

    it('should update tooltip-box text when input changes', () => {
      fixture.componentRef.setInput('text', 'Original');
      fixture.detectChanges();
      let tooltipBox = fixture.nativeElement.querySelector('.tooltip-box');
      expect(tooltipBox.textContent).toBe('Original');

      fixture.componentRef.setInput('text', 'Updated');
      fixture.detectChanges();
      tooltipBox = fixture.nativeElement.querySelector('.tooltip-box');
      expect(tooltipBox.textContent).toBe('Updated');
    });

    it('should render empty tooltip-box when text is empty', () => {
      fixture.componentRef.setInput('text', '');
      fixture.detectChanges();
      const tooltipBox = fixture.nativeElement.querySelector('.tooltip-box');
      expect(tooltipBox.textContent).toBe('');
    });

    it('should display special characters in tooltip-box', () => {
      const specialText = 'Alert: !@#$%^&*()';
      fixture.componentRef.setInput('text', specialText);
      fixture.detectChanges();
      const tooltipBox = fixture.nativeElement.querySelector('.tooltip-box');
      expect(tooltipBox.textContent).toBe(specialText);
    });

    it('should display unicode in tooltip-box', () => {
      const unicodeText = '😊 Emoji test';
      fixture.componentRef.setInput('text', unicodeText);
      fixture.detectChanges();
      const tooltipBox = fixture.nativeElement.querySelector('.tooltip-box');
      expect(tooltipBox.textContent).toBe(unicodeText);
    });

    it('should preserve whitespace in tooltip-box', () => {
      const textWithSpaces = 'Text  with   spaces';
      fixture.componentRef.setInput('text', textWithSpaces);
      fixture.detectChanges();
      const tooltipBox = fixture.nativeElement.querySelector('.tooltip-box');
      expect(tooltipBox.textContent).toBe(textWithSpaces);
    });
  });

  describe('tooltip structure', () => {
    it('should have tooltip-box as child of tooltip-icon', () => {
      fixture.detectChanges();
      const tooltipIcon = fixture.nativeElement.querySelector('.tooltip-icon');
      const tooltipBox = tooltipIcon.querySelector('.tooltip-box');
      expect(tooltipBox).toBeTruthy();
    });

    it('should render icon and tooltip-box in correct order', () => {
      fixture.detectChanges();
      const tooltipIcon = fixture.nativeElement.querySelector('.tooltip-icon');
      const children = Array.from(tooltipIcon.childNodes) as any[];
      const textNodes = children.filter((node) => node.nodeType === 3);
      const spanNodes = children.filter((node) => node.nodeType === 1);

      expect(textNodes.length).toBeGreaterThan(0);
      expect(spanNodes.length).toBeGreaterThan(0);
    });
  });

  describe('edge cases', () => {
    it('should handle tooltip with only whitespace', () => {
      fixture.componentRef.setInput('text', '   ');
      fixture.detectChanges();
      const tooltipBox = fixture.nativeElement.querySelector('.tooltip-box');
      expect(tooltipBox.textContent).toBe('   ');
    });

    it('should handle very long tooltip text', () => {
      const veryLongText =
        'A'.repeat(500) +
        ' This is a very long tooltip text that could potentially cause layout issues';
      fixture.componentRef.setInput('text', veryLongText);
      fixture.detectChanges();
      const tooltipBox = fixture.nativeElement.querySelector('.tooltip-box');
      expect(tooltipBox.textContent.length).toBeGreaterThan(500);
    });

    it('should handle HTML-like text without rendering', () => {
      const htmlLikeText = '<script>alert("test")</script>';
      fixture.componentRef.setInput('text', htmlLikeText);
      fixture.detectChanges();
      const tooltipBox = fixture.nativeElement.querySelector('.tooltip-box');
      expect(tooltipBox.textContent).toBe(htmlLikeText);
    });

    it('should render component root element with selector', () => {
      const rootElement = fixture.componentRef.location.nativeElement;
      expect(rootElement).toBeTruthy();
      expect(component).toBeTruthy();
    });

    it('should have tooltip-icon as direct child of component', () => {
      fixture.detectChanges();
      const tooltipIcon = fixture.nativeElement.querySelector(':scope > .tooltip-icon');
      expect(tooltipIcon).toBeTruthy();
    });
  });

  describe('accessibility', () => {
    it('should have visible tooltip icon', () => {
      fixture.detectChanges();
      const tooltipIcon = fixture.nativeElement.querySelector('.tooltip-icon');
      const computedStyle = window.getComputedStyle(tooltipIcon);
      expect(computedStyle.display).not.toBe('none');
    });

    it('should contain descriptive text content', () => {
      fixture.componentRef.setInput('text', 'This explains the feature');
      fixture.detectChanges();
      const component = fixture.nativeElement;
      expect(component.textContent).toContain('This explains the feature');
    });
  });
});
