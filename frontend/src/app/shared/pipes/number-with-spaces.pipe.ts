import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberWithSpaces'
})
export class NumberWithSpacesPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    // Return empty string if value is null or undefined
    if (value === null || value === undefined) {
      return '';
    }

    // Ensure value is a number
    if (typeof value !== 'number') {
      return '';
    }

    // Convert the number to a string
    const stringValue = value.toString();

    // Split the number into integer and decimal parts
    const [integerPart, decimalPart] = stringValue.split('.');

    // Format the integer part with spaces every 3 digits
    // Using non-breaking space (\u00A0)
    const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0');

    // Return the formatted number with the decimal part if it exists
    return decimalPart ? `${formattedIntegerPart}.${decimalPart}` : formattedIntegerPart;
  }
}