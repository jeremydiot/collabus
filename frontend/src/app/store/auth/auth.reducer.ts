import { createReducer, on } from '@ngrx/store'
import { User } from 'src/app/interfaces'
import * as authActions from './auth.actions'
import { AuthService } from 'src/app/services/auth.service'

export interface AuthState {
  profile: User
  isLoggedIn: boolean
  error: { [key: string]: string[] }
}

export const initialState: AuthState = {
  profile: AuthService.userProfile,
  isLoggedIn: Object.keys(AuthService.userProfile).length > 0,
  error: {}
}

export const authReducer = createReducer(
  initialState,
  on(authActions.error, (state, error) => {
    console.error(error)
    return {
      ...state,
      profile: AuthService.userProfile,
      isLoggedIn: Object.keys(AuthService.userProfile).length > 0,
      error: { ...state.error, ...error.error.error }
    }
  }),
  on(authActions.refresh, (state) => {
    return {
      ...state,
      profile: AuthService.userProfile,
      isLoggedIn: Object.keys(AuthService.userProfile).length > 0,
      error: {}
    }
  }),
  on(authActions.clearError, (state) => {
    return {
      ...state,
      error: {}
    }
  })
)
