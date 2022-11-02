import { createReducer, on } from '@ngrx/store'
import * as authActions from './auth.actions'

export const initialState = ''

export const authReducer = createReducer(
  initialState,
  on(authActions.login, (state, { email }) => email)
)
