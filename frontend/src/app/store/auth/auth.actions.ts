// import { HttpErrorResponse } from '@angular/common/http'
import { createAction, props } from '@ngrx/store'
import { User } from 'src/app/interfaces'
// import { User } from 'src/app/interfaces'
// import { AuthState } from './auth.reducer'

// effect
export const login = createAction('[Auth] Login', props<{ email: string, password: string }>())
export const refreshToken = createAction('[Auth] Refresh token')
export const getUserProfile = createAction('[Auth] Get user profile')
// export const updateUserProfile = createAction('[Auth] Update user profile', props<User>())
// export const changeUserPassword = createAction('[Auth] Change password', props<{ oldPassword: string, newPassword: string }>())
// export const clearError = createAction('[Auth] Clear error')
// reducer
// export const logout = createAction('[Auth] Logout')
// export const updateAccessToken = createAction('[Auth] update', props<AuthState>())

// export const error = createAction('[Auth] Error', props<{ error: HttpErrorResponse }>())
export const logout = createAction('[Auth] Logout')
export const loginComplete = createAction('[Auth] Login complete', props<{ accessToken: string, refreshToken: string }>())
export const refreshTokenComplete = createAction('[Auth] Refresh token comlplete', props<{ accessToken: string }>())
export const getUserProfileComplete = createAction('[Auth] Get user profile complete', props<{ user: User }>())
