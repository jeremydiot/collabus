import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import { ProjectEntity, ProjectPrivate, ProjectPublic } from 'src/app/interfaces'

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly apiUrl = environment.backendUrl

  constructor (private readonly http: HttpClient) { }

  listPrivate (params: {}): Observable<ProjectPrivate[]> {
    const _params = new HttpParams({ fromObject: params })
    return this.http.get<ProjectPrivate[]>(`${this.apiUrl}/entity/folder/`, { params: _params })
  }

  listPulic (params: {}): Observable<ProjectPublic[]> {
    const _params = new HttpParams({ fromObject: params })
    return this.http.get<ProjectPublic[]>(`${this.apiUrl}/folder/`, { params: _params })
  }

  contributorProjectJoin (idFolder: number): Observable<ProjectEntity> {
    return this.http.post<ProjectEntity>(`${this.apiUrl}/folder/${idFolder}/entity/`, {})
  }

  contributorProjectExit (idFolder: number): Observable<never> {
    return this.http.delete<never>(`${this.apiUrl}/folder/${idFolder}/entity/`)
  }

  entityProjectList (): Observable<ProjectEntity[]> {
    return this.http.get<ProjectEntity[]>(`${this.apiUrl}/folder/entity/`)
  }

  getProjectPrivate (idFolder: number): Observable<ProjectPrivate> {
    return this.http.get<ProjectPrivate>(`${this.apiUrl}/entity/folder/${idFolder}/`)
  }
}
