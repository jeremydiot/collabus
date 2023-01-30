import { HttpContextToken } from '@angular/common/http'

export const USER_PROFILE = 'user_profile'
export const ACCESS_TOKEN = 'access_token'
export const REFRESH_TOKEN = 'refresh_token'

export const HTTP_CONTEXT_CONTENT_TYPE = new HttpContextToken<string>(() => 'application/json')
