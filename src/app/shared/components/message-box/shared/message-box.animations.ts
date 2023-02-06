import { animate, style, transition, trigger } from '@angular/animations';

export const slideInFromLeft = trigger('slideInFromLeft', [
  transition(':enter', [style({ 'margin-left': '-250px' }), animate('0.4s', style({ 'margin-left': '0' }))]),
  transition(':leave', [style({ 'margin-left': '0' }), animate('0.4s', style({ 'margin-left': '-250px' }))]),
]);
