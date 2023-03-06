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

  updateProjectPrivate (idFolder: number, name?: string, description?: string, note?: string, kind?: number, isClosed?: boolean, isHidden?: boolean): Observable<ProjectPrivate> {
    return this.http.put<ProjectPrivate>(`${this.apiUrl}/entity/folder/${idFolder}/`, {
      name,
      description,
      note,
      kind,
      is_closed: isClosed,
      is_hidden: isHidden
    })
  }

  createProjectPrivate (name?: string, description?: string, note?: string, kind?: number, isClosed?: boolean, isHidden?: boolean): Observable<ProjectPrivate> {
    return this.http.post<ProjectPrivate>(`${this.apiUrl}/entity/folder/`, {
      name,
      description,
      note,
      kind,
      is_closed: isClosed,
      is_hidden: isHidden
    })
  }

  authorRefuseRelation (idFolder: number, idEntity: number): Observable<never> {
    return this.http.delete<never>(`${this.apiUrl}/folder/${idFolder}/entity/${idEntity}/`)
  }

  authorAcceptRelation (idFolder: number, idEntity: number, isAccepted: boolean): Observable<{ entity: number, is_accepted: boolean }> {
    return this.http.put<{ entity: number, is_accepted: boolean }>(`${this.apiUrl}/folder/${idFolder}/entity/${idEntity}/`, { is_accepted: isAccepted })
  }
}
