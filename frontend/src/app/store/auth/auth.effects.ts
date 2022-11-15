import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { map, catchError, concatMap, from, concatAll, last } from 'rxjs'
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
    concatMap(({ email, password }) => from([
      this.authService.login(email, password),
      this.authService.getUserProfile()
    ]).pipe(
      concatAll(),
      catchError((error) => from([authActions.loginError({ error })])),
      last(),
      map(() => authActions.loginComplete()
      ))
    )
  ))
}
