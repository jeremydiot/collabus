import { createAction, props } from '@ngrx/store'

export const login = createAction('[Auth] Login', props<{email: string}>())
