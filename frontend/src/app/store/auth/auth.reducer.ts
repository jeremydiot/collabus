import { createReducer, on } from '@ngrx/store'
import { User } from 'src/app/models/user'
import * as authActions from './auth.actions'
import { AuthService } from 'src/app/services/auth.service'

export interface AuthState {
  profile: User
  isLoggedIn: boolean
}

export const initialState: AuthState = {
  profile: AuthService.userProfile,
  isLoggedIn: Object.keys(AuthService.userProfile).length > 0
}

export const authReducer = createReducer(
  initialState,
  on(authActions.loginComplete, (state) => {
    return {
      ...state,
      profile: AuthService.userProfile,
      isLoggedIn: Object.keys(AuthService.userProfile).length > 0
    }
  }),
  on(authActions.logoutComplete, (state) => {
    AuthService.logout()
    return {
      ...state,
      profile: AuthService.userProfile,
      isLoggedIn: Object.keys(AuthService.userProfile).length > 0
    }
  }),
  on(authActions.loginError, (state, { error }) => {
    console.error(error)
    AuthService.logout()
    return {
      ...state,
      profile: AuthService.userProfile,
      isLoggedIn: Object.keys(AuthService.userProfile).length > 0
    }
  })
)
