import { animate, style, transition, trigger } from '@angular/animations';

export const slideInFromLeft = trigger('slideInFromLeft', [
  transition(':enter', [style({ 'margin-left': '-250px' }), animate('0.4s', style({ 'margin-left': '0' }))]),
  transition(':leave', [style({ 'margin-left': '0' }), animate('0.4s', style({ 'margin-left': '-250px' }))]),
]);

export const dropDown = trigger('dropDown', [
  transition(':enter', [style({ 'margin-top': '-100px' }), animate('0.2s', style({ 'margin-top': '0' }))]),
  transition(':leave', [style({ 'margin-top': '0' }), animate('0.2s', style({ 'margin-top': '-100px' }))]),
]);
