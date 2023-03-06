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

  createUser (userEmail: string, userPhone: string, userFirstName: string, userLastName: string, userPassword: string,
    entityName: string, entityEmail: string, entityPhone: string, entitySiret: string, entityAddress: string,
    entityZipCode: string, entityCity: string, entityCountry: string, entityKind: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/user/`, {
      user: {
        username: userEmail,
        email: userEmail,
        phone: userPhone,
        first_name: userFirstName,
        last_name: userLastName,
        password: userPassword
      },
      entity: {
        name: entityName,
        address: entityAddress,
        zip_code: entityZipCode,
        city: entityCity,
        country: entityCountry,
        phone: entityPhone,
        email: entityEmail,
        siret: entitySiret,
        kind: entityKind
      }
    })
  }

  getUser (username: string = '@me'): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user/${username}/`)
  }

  updateUser (email: string, phone: string, firstName: string, lastName: string, username: string = '@me'): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/user/${username}/`, { email, phone, first_name: firstName, last_name: lastName })
  }

  changeUserPassword (oldPassword: string, newPassword: string, username: string = '@me'): Observable<never> {
    return this.http.put<never>(`${this.apiUrl}/user/${username}/password/`, { new_password: newPassword, old_password: oldPassword })
  }
}
