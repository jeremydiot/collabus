import { Injectable } from '@angular/core'
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http'
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from 'rxjs'
import { environment } from 'src/environments/environment'
import { Store } from '@ngrx/store'
import * as authActions from '../store/auth/auth.actions'
import { AuthState } from 'src/app/store/auth/auth.reducer'

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private refreshTokenInProgress = false
  private readonly refreshTokenSubject = new BehaviorSubject<any>(null)

  constructor (
    private readonly store: Store<{ auth: AuthState }>
  ) {}

  intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.store.select('auth').pipe(
      take(1), // prevent endless loop
      switchMap(({ accessToken }) => {
        if (req.url.startsWith(environment.backendUrl) && accessToken !== '') {
          req = this.setHeaders(req, accessToken)

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
      })
    )
  }

  private handle401Error (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.refreshTokenInProgress) { // if not refresh access token in progress
      this.refreshTokenInProgress = true
      this.refreshTokenSubject.next(null)

      this.store.dispatch(authActions.refreshToken())

      return this.store.select('auth').pipe(
        take(1), // prevent endless loop
        switchMap(({ accessToken }) => {
          this.refreshTokenInProgress = false
          this.refreshTokenSubject.next(accessToken) // allow pending requests
          return next.handle(this.setHeaders(req, accessToken)) // resend request
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
      switchMap((accessToken) => next.handle(this.setHeaders(req, accessToken)))
    )
  }

  private setHeaders (req: HttpRequest<any>, accessToken: string): HttpRequest<any> {
    return req.clone({
      setHeaders: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    })
  }
}
