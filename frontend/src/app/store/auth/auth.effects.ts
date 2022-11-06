import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { of } from 'rxjs'
import { map, mergeMap, catchError, finalize } from 'rxjs/operators'
import { AuthService } from '../../services/auth.service'
import * as authActions from './auth.actions'

@Injectable()
export class AuthEffects {
  constructor (
    private readonly actions$: Actions,
    private readonly authService: AuthService
  ) {}

  login$ = createEffect(() => this.actions$.pipe(
    ofType(authActions.login),
    mergeMap(({ email, password }) => this.authService.login(email, password).pipe(
      map(() => {
        return authActions.loginSuccess()
      }),
      catchError((error) => of(authActions.loginError({ error })))
    ))
  ))

  getUser$ = createEffect(() => this.actions$.pipe(
    ofType(authActions.loginSuccess),
    mergeMap(() => this.authService.getUserProfile().pipe(
      map(user => {
        console.log('get user !')
        return authActions.loginComplete({ isLoggedIn: true, profile: user })
      }),
      catchError((error) => {
        console.log('error !')
        return of(authActions.loginError({ error }))
      }),
      finalize(() => {
        console.log('try !')
      })
    ))
  ))
}
