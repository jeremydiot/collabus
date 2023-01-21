import { HttpErrorResponse } from '@angular/common/http'
import { createAction, props } from '@ngrx/store'
import { Credentials, User } from 'src/app/interfaces'

export const login = createAction('[Auth] Login', props<Credentials>())
export const logout = createAction('[Auth] Logout')
export const updateUserProfile = createAction('[Auth] Update user profile', props<User>())
export const changeUserPassword = createAction('[Auth] Change password', props<{ old_password: string, new_password: string }>())
export const refresh = createAction('[Auth] refresh')
export const error = createAction('[Auth] Error', props<{ error: HttpErrorResponse }>())
export const clearError = createAction('[Auth] Clear error')
