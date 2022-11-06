import { createReducer, on } from '@ngrx/store'
import { User } from 'src/app/models/user'
import * as authActions from './auth.actions'

export interface AuthState {
  profile?: User
  isLoggedIn: boolean
}

export const initialState: AuthState = {
  profile: undefined,
  isLoggedIn: false
}

export const authReducer = createReducer(
  initialState,
  on(authActions.loginComplete, (state, { profile, isLoggedIn }) => {
    return {
      ...state,
      profile,
      isLoggedIn
    }
  }),
  on(authActions.logout, (state) => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    return initialState
  })
)
