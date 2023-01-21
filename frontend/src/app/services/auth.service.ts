import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import { ACCES_TOKEN, REFRESH_TOKEN, USER_PROFILE } from '../constants'
import { Tokens, User } from '../interfaces'

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = environment.backendUrl

  constructor (private readonly http: HttpClient) { }

  static get userProfile (): User {
    const _profile = localStorage.getItem(USER_PROFILE)
    return (_profile !== null) ? JSON.parse(_profile) : {}
  }

  static set userProfile (profile: User) {
    localStorage.setItem(USER_PROFILE, JSON.stringify(profile))
  }

  static get accessToken (): string {
    const _token = localStorage.getItem(ACCES_TOKEN)
    return (_token !== null) ? _token : ''
  }

  static set accessToken (token: string) {
    localStorage.setItem(ACCES_TOKEN, token)
  }

  static get refreshToken (): string {
    const _token = localStorage.getItem(REFRESH_TOKEN)
    return (_token !== null) ? _token : ''
  }

  static set refreshToken (token: string) {
    localStorage.setItem(REFRESH_TOKEN, token)
  }

  static logout (): void {
    localStorage.removeItem(ACCES_TOKEN)
    localStorage.removeItem(REFRESH_TOKEN)
    localStorage.removeItem(USER_PROFILE)
  }

  login (email: string, password: string): Observable<Tokens> {
    return this.http.post<Tokens>(`${this.apiUrl}/token/`, { username: email, password }).pipe(map((tokens) => {
      AuthService.accessToken = tokens.access
      AuthService.refreshToken = tokens.refresh
      return tokens
    }))
  }

  getUserProfile (username: string = '@me'): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user/${username}/`).pipe(map((user) => {
      if (username === '@me') {
        AuthService.userProfile = user
      }
      return user
    }))
  }

  refreshAccessToken (refresh: string = AuthService.refreshToken): Observable<{ access: string }> {
    return this.http.post<{ access: string }>(`${this.apiUrl}/token/refresh/`, { refresh }).pipe(map((token) => {
      AuthService.accessToken = token.access
      return token
    }))
  }

  updateUserProfile (user: User, username: string = '@me'): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/user/${username}/`, user).pipe(map((user) => {
      if (username === '@me') {
        AuthService.userProfile = user
      }
      return user
    }))
  }

  changeUserPassword (passwords: { old_password: string, new_password: string }, username: string = '@me'): Observable<never> {
    return this.http.put<never>(`${this.apiUrl}/user/${username}/change_password/`, passwords)
  }
}
