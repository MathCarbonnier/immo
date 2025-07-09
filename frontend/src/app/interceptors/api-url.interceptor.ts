import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Interceptor that redirects API requests to the backend server.
 * This allows the frontend to make requests to relative URLs like '/api/biens'
 * which will be redirected to the backend server (e.g., 'http://localhost:8080/api/biens').
 */
@Injectable()
export class ApiUrlInterceptor implements HttpInterceptor {
  // Backend API URL loaded from environment configuration
  private backendUrl = environment.apiUrl;

  constructor() {
    // The backend URL is now loaded from the environment configuration
    // This makes it easier to change the URL for different environments
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Only intercept requests that start with /api
    if (request.url.startsWith('/api')) {
      // Clone the request and replace the URL
      const apiReq = request.clone({
        url: `${this.backendUrl}${request.url}`
      });
      return next.handle(apiReq);
    }

    // Pass through all other requests unchanged
    return next.handle(request);
  }
}
