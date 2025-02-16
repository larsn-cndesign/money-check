import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';

/**
 * Override format date, always having Swedish date format
 */
@Injectable({
  providedIn: 'root',
})
export class CustomDateAdapter extends NativeDateAdapter {
  override format(date: Date, _displayFormat: string): string {
    return new Intl.DateTimeFormat('sv-SE').format(date);
  }
}
