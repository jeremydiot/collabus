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

  get userProfile (): Object {
    const _profile = localStorage.getItem(environment.USER_PROFILE)
    return (_profile !== null) ? JSON.parse(_profile) : {}
  }

  set userProfile (profile: Object) {
    localStorage.setItem(environment.USER_PROFILE, JSON.stringify(profile))
  }

  get accessToken (): string {
    const _token = localStorage.getItem(environment.ACCES_TOKEN)
    return (_token !== null) ? _token : ''
  }

  set accessToken (token: string) {
    localStorage.setItem(environment.ACCES_TOKEN, token)
  }

  get refreshToken (): string {
    const _token = localStorage.getItem(environment.REFRESH_TOKEN)
    return (_token !== null) ? _token : ''
  }

  set refreshToken (token: string) {
    localStorage.setItem(environment.REFRESH_TOKEN, token)
  }

  login (email: string, password: string): Observable<Tokens> {
    return this.http.post<Tokens>(`${this.apiUrl}/token/`, { username: email, password: password }).pipe(map((tokens) => {
      this.accessToken = tokens.access
      this.refreshToken = tokens.refresh
      return tokens
    }))
  }

  logout (): Observable<never> {
    const observable = new Observable<never>((subscriber) => {
      localStorage.removeItem(environment.ACCES_TOKEN)
      localStorage.removeItem(environment.REFRESH_TOKEN)
      subscriber.next()
    })
    return observable
  }

  getUserProfile (username: string = '@me'): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user/${username}/`).pipe(map((user) => {
      this.userProfile = user
      return user
    }))
  }

  refreshAccessToken (refresh: string = this.refreshToken): Observable<{access: string}> {
    return this.http.post<{access: string}>(`${this.apiUrl}/token/refresh/`, { refresh: refresh }).pipe(map((token) => {
      this.accessToken = token.access
      return token
    }))
  }
}
