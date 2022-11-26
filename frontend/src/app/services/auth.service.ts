import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import { Tokens, User } from '../models/user'

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = environment.backendUrl

  constructor (private readonly http: HttpClient) { }

  static get userProfile (): User {
    const _profile = localStorage.getItem(environment.USER_PROFILE)
    return (_profile !== null) ? JSON.parse(_profile) : {}
  }

  static set userProfile (profile: User) {
    localStorage.setItem(environment.USER_PROFILE, JSON.stringify(profile))
  }

  static get accessToken (): string {
    const _token = localStorage.getItem(environment.ACCES_TOKEN)
    return (_token !== null) ? _token : ''
  }

  static set accessToken (token: string) {
    localStorage.setItem(environment.ACCES_TOKEN, token)
  }

  static get refreshToken (): string {
    const _token = localStorage.getItem(environment.REFRESH_TOKEN)
    return (_token !== null) ? _token : ''
  }

  static set refreshToken (token: string) {
    localStorage.setItem(environment.REFRESH_TOKEN, token)
  }

  static logout (): void {
    localStorage.removeItem(environment.ACCES_TOKEN)
    localStorage.removeItem(environment.REFRESH_TOKEN)
    localStorage.removeItem(environment.USER_PROFILE)
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
}
