import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import { Project } from '../models/project'

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly apiUrl = environment.backendUrl

  constructor (private readonly http: HttpClient) { }

  list (params: object): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/folder/`, params)
  }
}
