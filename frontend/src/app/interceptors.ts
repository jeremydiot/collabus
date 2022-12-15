import { Injectable } from '@angular/core'
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http'
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from 'rxjs'
import { environment } from 'src/environments/environment'
import { AuthService } from './services/auth.service'
import { Store } from '@ngrx/store'
import * as authActions from './store/auth/auth.actions'
import { AuthState } from 'src/app/store/auth/auth.reducer'

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private refreshTokenInProgress = false
  private readonly refreshTokenSubject = new BehaviorSubject<any>(null)
  auth$: Observable<AuthState>

  constructor (
    private readonly authService: AuthService,
    private readonly store: Store<{ auth: AuthState }>
  ) {
    this.auth$ = store.select('auth')
  }

  intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.startsWith(environment.backendUrl) && AuthService.accessToken !== '') {
      req = this.setHeaders(req)

      return next.handle(req).pipe(catchError(err => {
        if (err instanceof HttpErrorResponse && (
          err.status === 403 || // forbidden
          req.url.startsWith(environment.backendUrl + '/token') // api token routes
        )
        ) {
          this.store.dispatch(authActions.logout()) // logout at : refresh acces token error, login error, forbidden request
        } else if (err instanceof HttpErrorResponse && err.status === 401) { // unauthorized
          return this.handle401Error(req, next)
        }

        return throwError(() => new HttpErrorResponse(err))
      }))
    }
    return next.handle(req) // no access token or no api url
  }

  private handle401Error (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.refreshTokenInProgress) { // if not refresh access token in progress
      this.refreshTokenInProgress = true
      this.refreshTokenSubject.next(null)

      return this.authService.refreshAccessToken().pipe(
        switchMap((token) => {
          this.refreshTokenInProgress = false
          this.refreshTokenSubject.next(token) // allow pending requests
          return next.handle(this.setHeaders(req)) // resend request
        }),
        catchError((err) => { // refresh error
          this.refreshTokenInProgress = false
          return throwError(() => new HttpErrorResponse(err))
        })
      )
    }
    // retry inqueue request after acces token refreshing
    return this.refreshTokenSubject.pipe(
      filter((value) => value != null),
      take(1),
      switchMap(() => next.handle(this.setHeaders(req)))
    )
  }

  private setHeaders (req: HttpRequest<any>): HttpRequest<any> {
    return req.clone({
      setHeaders: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AuthService.accessToken}`
      }
    })
  }
}
