import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { switchMap, withLatestFrom, firstValueFrom, map } from 'rxjs'
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
    switchMap(async ({ email, password }) => {
      const { access, refresh } = await firstValueFrom(this.authService.login(email, password))
      this.store.dispatch(authActions.loginComplete({ accessToken: access, refreshToken: refresh }))
      void this.router.navigate(['/dashboard'])
      return authActions.getUserProfile()
    }
    ))
  )

  getUserProfile$ = createEffect(() => this.actions$.pipe(
    ofType(authActions.getUserProfile),
    switchMap(async () => {
      const user = await firstValueFrom(this.authService.getUser())
      return authActions.getUserProfileComplete({ user })
    })
  ))

  refreshToken$ = createEffect(() => this.actions$.pipe(
    ofType(authActions.refreshToken),
    withLatestFrom(this.store.select('auth')),
    switchMap(async ([action, state]) => {
      const { access } = await firstValueFrom(this.authService.refresh(state.refreshToken))
      return authActions.refreshTokenComplete({ accessToken: access })
    })
  ))

  updateUserProfile$ = createEffect(() => this.actions$.pipe(
    ofType(authActions.updateUserProfile),
    switchMap((data) => this.authService.updateUser(data.email, data.phone, data.firstName, data.lastName)
      .pipe(
        map((user) => authActions.getUserProfileComplete({ user }))
      )
    )
    // tap().
    // return
    // })
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

  // changeUserPassword$ = createEffect(() => this.actions$.pipe(
  //   ofType(authActions.changeUserPassword),
  //   switchMap((passwords) => this.authService.changeUserPassword(passwords).pipe(
  //     map(() => authActions.refresh()),
  //     catchError((error: HttpErrorResponse) => of(authActions.error({ error })))
  //   ))
  // ))
}
