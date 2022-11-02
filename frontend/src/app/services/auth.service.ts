import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import { Acces, Tokens } from '../models/tokens'
import { User } from '../models/user'

@Injectable({ providedIn: 'root' })
export class AuthService {
  static ACCES_TOKEN: string = 'access_token'
  static REFRESH_TOKEN: string = 'refresh_token'

  private readonly apiUrl = environment.backendUrl + environment.apiPath

  constructor (private readonly http: HttpClient) { }

  login (email: string, password: string): Observable<Tokens> {
    return this.http.post<Tokens>(`${this.apiUrl}/token/`, { username: email, password: password })
  }

  logout (): void {
    localStorage.removeItem(AuthService.ACCES_TOKEN)
    localStorage.removeItem(AuthService.REFRESH_TOKEN)
  }

  get token (): string {
    const _token = localStorage.getItem(AuthService.ACCES_TOKEN)
    return (_token !== null) ? _token : ''
  }

  verifyToken (token: string | null = localStorage.getItem(AuthService.ACCES_TOKEN)): Observable<Object> {
    return this.http.post<Object>(`${this.apiUrl}/token/verify/`, { token: token })
  }

  refreshToken (refresh: string | null = localStorage.getItem(AuthService.REFRESH_TOKEN)): Observable<Acces> {
    return this.http.post<Acces>(`${this.apiUrl}/token/refresh/`, { refresh: refresh })
  }

  getUser (username: string = '@me'): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user/${username}/`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`
      })
    })
  }
}
