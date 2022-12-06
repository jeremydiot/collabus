import { createAction, props } from '@ngrx/store'
import { Credentials } from 'src/app/models/user'

export const login = createAction('[Auth] Login', props<Credentials>())
export const loginComplete = createAction('[Auth] Login complete')
export const logout = createAction('[Auth] Logout')
export const logoutComplete = createAction('[Auth] Logout complete')
export const loginError = createAction('[Auth] Login error', props<{ error: string }>())
