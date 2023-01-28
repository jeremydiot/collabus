import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import { ProjectPrivate } from 'src/app/interfaces'

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly apiUrl = environment.backendUrl

  constructor (private readonly http: HttpClient) { }

  listPrivate (params: {}): Observable<ProjectPrivate[]> {
    const _params = new HttpParams({ fromObject: params })
    return this.http.get<ProjectPrivate[]>(`${this.apiUrl}/entity/folder/`, { params: _params })
  }
}
