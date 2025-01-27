import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * Class representing a pipe for sanitizing HTML content.
 */
@Pipe({
  name: 'skipSanitizeHtml',
  standalone: true,
})
export class SkipSanitizeHtmlPipe implements PipeTransform {
  /**
   * Initializes properties
   * @param sanitizer A property holding a `DomSanitizer` object.
   */
  constructor(private sanitizer: DomSanitizer) {}

  /**
   * A method for transforming a string to a `SafeHtml`.
   * @param value The string value to be sanitized from unsafe javascript code.
   * @returns A `SafeHtml` object (string).
   */
  transform(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}
