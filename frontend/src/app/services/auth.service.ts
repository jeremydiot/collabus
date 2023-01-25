import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import { User } from 'src/app/interfaces'

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = environment.backendUrl

  constructor (private readonly http: HttpClient) { }

  login (email: string, password: string): Observable<{ access: string, refresh: string }> {
    return this.http.post<{ access: string, refresh: string }>(`${this.apiUrl}/token/`, { username: email, password })
  }

  refresh (refresh: string): Observable<{ access: string }> {
    return this.http.post<{ access: string }>(`${this.apiUrl}/token/refresh/`, { refresh })
  }

  verify (token: string): Observable<never> {
    return this.http.post<never>(`${this.apiUrl}/token/verify/`, { token })
  }

  createUser (username: string, email: string, phone: string, firstName: string, lastName: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/user/`, { username, email, phone, first_name: firstName, last_name: lastName, password })
  }

  getUser (username: string = '@me'): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user/${username}/`)
  }

  updateUser (email: string, phone: string, firstName: string, lastName: string, username: string = '@me'): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/user/${username}/`, { username, email, phone, first_name: firstName, last_name: lastName })
  }

  changeUserPassword (oldPassword: string, newPassword: string, username: string = '@me'): Observable<never> {
    return this.http.put<never>(`${this.apiUrl}/user/${username}/password/`, { new_password: newPassword, old_password: oldPassword })
  }
}
