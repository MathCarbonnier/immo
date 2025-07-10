import { Directive, ElementRef, HostListener, OnInit, Renderer2 } from '@angular/core';
import { NgControl } from '@angular/forms';
import { NumberWithSpacesPipe } from '../pipes/number-with-spaces.pipe';

@Directive({
  selector: '[appNumberWithSpaces]'
})
export class NumberWithSpacesDirective implements OnInit {
  private el: HTMLInputElement;
  private pipe: NumberWithSpacesPipe;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private control: NgControl
  ) {
    this.el = this.elementRef.nativeElement;
    this.pipe = new NumberWithSpacesPipe();
  }

  ngOnInit() {
    // Format the initial value if it exists
    if (this.control.value) {
      this.formatDisplayValue(this.control.value);
    }
  }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    // Remove all non-numeric characters except decimal point
    const numericValue = value.replace(/[^\d.]/g, '');
    
    // Convert to number
    const numberValue = numericValue ? parseFloat(numericValue) : null;
    
    // Update the model with the numeric value
    this.control.control?.setValue(numberValue, { emitEvent: false });
    
    // Format the display value
    this.formatDisplayValue(numberValue);
  }

  @HostListener('focus')
  onFocus() {
    // When focused, show the raw numeric value
    const value = this.control.value;
    this.renderer.setProperty(this.el, 'value', value);
  }

  @HostListener('blur')
  onBlur() {
    // When blurred, format the display value
    this.formatDisplayValue(this.control.value);
  }

  private formatDisplayValue(value: number | null) {
    if (value !== null && value !== undefined) {
      // Format the value using the pipe
      const formattedValue = this.pipe.transform(value);
      // Update the display value
      this.renderer.setProperty(this.el, 'value', formattedValue);
    }
  }
}