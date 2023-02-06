import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SpinnerService } from '../components/spinner/spinner.service';

/**
 * Class representing a spinner interceptor.
 * @description If an HttpRequest is not responding within 350ms a loading spinner is
 * visible and blocking the inner page UI until the respons is finalized.
 */
@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  /**
   * Create a http interceptor.
   * @param spinnerService A service managing a loading spinner.
   */
  constructor(private spinnerService: SpinnerService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.spinnerService.startSpinner();

    return next.handle(req).pipe(
      finalize(() => {
        this.spinnerService.stopSpinner();
      })
    );
  }
}
