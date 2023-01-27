import { HttpErrorResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { switchMap, withLatestFrom, map, catchError, of } from 'rxjs'
import { AuthService } from '../../services/auth.service'
import * as authActions from './auth.actions'
import { AuthState } from './auth.reducer'

@Injectable()
export class AuthEffects {
  constructor (
    private readonly actions$: Actions,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly store: Store<{ auth: AuthState }>
  ) {}

  login$ = createEffect(() => this.actions$.pipe(
    ofType(authActions.login),
    switchMap(({ email, password }) => this.authService.login(email, password).pipe(
      map((tokens) => {
        this.store.dispatch(authActions.loginComplete({ accessToken: tokens.access, refreshToken: tokens.refresh }))
        void this.router.navigate(['/dashboard'])
        return authActions.getUserProfile()
      }),
      catchError((err: HttpErrorResponse) => {
        return of(authActions.error({ error: err.error }))
      })
    )
    )
  ))

  getUserProfile$ = createEffect(() => this.actions$.pipe(
    ofType(authActions.getUserProfile),
    switchMap(() => this.authService.getUser()
      .pipe(map((user) => authActions.getUserProfileComplete({ user })))
    )))

  refreshToken$ = createEffect(() => this.actions$.pipe(
    ofType(authActions.refreshToken),
    withLatestFrom(this.store.select('auth')),
    switchMap(([action, state]) => this.authService.refresh(state.refreshToken)
      .pipe(map(({ access }) => authActions.refreshTokenComplete({ accessToken: access })))
    )
  ))

  updateUserProfile$ = createEffect(() => this.actions$.pipe(
    ofType(authActions.updateUserProfile),
    switchMap((data) => this.authService.updateUser(data.email, data.phone, data.firstName, data.lastName)
      .pipe(
        map((user) => authActions.getUserProfileComplete({ user })),
        catchError((err: HttpErrorResponse) => {
          return of(authActions.error({ error: err.error }))
        })
      )
    )
  ))

  changeUserPassword$ = createEffect(() => this.actions$.pipe(
    ofType(authActions.changeUserPassword),
    switchMap((passwords) => this.authService.changeUserPassword(passwords.oldPassword, passwords.newPassword)
      .pipe(
        map(() => authActions.noopAction()),
        catchError((err: HttpErrorResponse) => {
          return of(authActions.error({ error: err.error }))
        })
      ))
  ))

  // logout$ = createEffect(() => this.actions$.pipe(
  //   ofType(authActions.logout),
  //   map(() => {
  //     void this.router.navigate([''])
  //     AuthService.logout()
  //     return authActions.refresh()
  //   })
  // ))

  // updateUserProfile$ = createEffect(() => this.actions$.pipe(
  //   ofType(authActions.updateUserProfile),
  //   switchMap((user) => this.authService.updateUserProfile(user).pipe(
  //     map(() => authActions.refresh()),
  //     catchError((error: HttpErrorResponse) => of(authActions.error({ error })))
  //   ))
  // ))
}
