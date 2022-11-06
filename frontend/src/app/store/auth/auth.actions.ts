import { createAction, props } from '@ngrx/store'
import { Credentials } from 'src/app/models/user'
import { AuthState } from './auth.reducer'

export const login = createAction('[Auth] Login', props<Credentials>())
export const loginSuccess = createAction('[Auth] Login success')
export const loginComplete = createAction('[Auth] Login complete', props<AuthState>())
export const loginError = createAction('[Auth] Login error', props<{error: string}>())
export const logout = createAction('[Auth] Logout')
