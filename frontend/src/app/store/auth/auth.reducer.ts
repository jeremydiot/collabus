import { createReducer, on } from '@ngrx/store'
import { User } from 'src/app/interfaces'
import * as authActions from './auth.actions'
import { USER_PROFILE, ACCESS_TOKEN, REFRESH_TOKEN } from 'src/app/constants'

export interface AuthState {
  user: User | {}
  accessToken: string
  refreshToken: string
}

export const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem(USER_PROFILE) ?? '{}'),
  accessToken: localStorage.getItem(ACCESS_TOKEN) ?? '',
  refreshToken: localStorage.getItem(REFRESH_TOKEN) ?? ''
}

export const authReducer = createReducer(
  initialState,

  on(authActions.loginComplete, (state, { accessToken, refreshToken }) => {
    localStorage.setItem(ACCESS_TOKEN, accessToken)
    localStorage.setItem(REFRESH_TOKEN, refreshToken)

    return {
      ...state,
      accessToken,
      refreshToken
    }
  }),

  on(authActions.refreshTokenComplete, (state, { accessToken }) => {
    localStorage.setItem(ACCESS_TOKEN, accessToken)

    return {
      ...state,
      accessToken
    }
  }),

  on(authActions.getUserProfileComplete, (state, { user }) => {
    localStorage.setItem(USER_PROFILE, JSON.stringify(user))

    return {
      ...state,
      user
    }
  }),

  on(authActions.logout, () => {
    localStorage.removeItem(USER_PROFILE)
    localStorage.removeItem(ACCESS_TOKEN)
    localStorage.removeItem(REFRESH_TOKEN)

    return {
      user: {},
      accessToken: '',
      refreshToken: ''
    }
  })
)
