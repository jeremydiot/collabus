import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import { Project } from '../models/project'

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly apiUrl = environment.backendUrl

  constructor (private readonly http: HttpClient) { }

  list (params: {}): Observable<Project[]> {
    const _params = new HttpParams({ fromObject: params })
    return this.http.get<Project[]>(`${this.apiUrl}/folder/`, { params: _params })
  }
}
