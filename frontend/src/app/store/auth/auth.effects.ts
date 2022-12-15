import { HttpErrorResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { map, catchError, concatMap, from, concatAll, last, switchMap, of } from 'rxjs'
import { AuthService } from '../../services/auth.service'
import * as authActions from './auth.actions'

@Injectable()
export class AuthEffects {
  constructor (
    private readonly actions$: Actions,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  login$ = createEffect(() => this.actions$.pipe(
    ofType(authActions.login),
    concatMap(({ email, password }) => from([
      this.authService.login(email, password),
      this.authService.getUserProfile()
    ]).pipe(
      concatAll(),
      last(),
      map(() => {
        void this.router.navigate(['dashboard'])
        return authActions.refresh()
      }),
      catchError((error: HttpErrorResponse) => {
        AuthService.logout()
        return of(authActions.error({ error }))
      })
    ))
  ))

  logout$ = createEffect(() => this.actions$.pipe(
    ofType(authActions.logout),
    map(() => {
      void this.router.navigate([''])
      AuthService.logout()
      return authActions.refresh()
    })
  ))

  updateUserProfile$ = createEffect(() => this.actions$.pipe(
    ofType(authActions.updateUserProfile),
    switchMap((user) => this.authService.updateUserProfile(user).pipe(
      map(() => authActions.refresh()),
      catchError((error: HttpErrorResponse) => of(authActions.error({ error })))
    ))
  ))

  changeUserPassword$ = createEffect(() => this.actions$.pipe(
    ofType(authActions.changeUserPassword),
    switchMap((passwords) => this.authService.changeUserPassword(passwords).pipe(
      map(() => authActions.refresh()),
      catchError((error: HttpErrorResponse) => of(authActions.error({ error })))
    ))
  ))
}
