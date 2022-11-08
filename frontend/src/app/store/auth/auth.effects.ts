import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { of } from 'rxjs'
import { map, catchError, concatMap } from 'rxjs/operators'
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
    concatMap(({ email, password }) => this.authService.login(email, password).pipe(
      concatMap(() => this.authService.getUserProfile().pipe(
        map(() => authActions.loginComplete()),
        catchError((error) => of(authActions.loginError({ error })))
      )),
      catchError((error) => of(authActions.loginError({ error })))
    ))
  ))
}
