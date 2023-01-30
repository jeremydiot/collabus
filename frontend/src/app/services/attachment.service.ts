import { HttpClient, HttpContext } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { Attachment } from 'src/app/interfaces'
import { environment } from 'src/environments/environment'
import { HTTP_CONTEXT_CONTENT_TYPE } from '../constants'

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {
  private readonly apiUrl = environment.backendUrl

  private readonly httpContext = new HttpContext().set(HTTP_CONTEXT_CONTENT_TYPE, 'multipart/form-data')

  constructor (
    private readonly http: HttpClient
  ) { }

  get (folderId: number): Observable<Attachment[]> {
    return this.http.get<Attachment[]>(`${this.apiUrl}/folder/${folderId}/attachment/`)
  }

  add (folderId: number, file: File): Observable<Attachment[]> {
    const formData = new FormData()
    formData.append('file', file)
    return this.http.post<Attachment[]>(`${this.apiUrl}/folder/${folderId}/attachment/`, formData, { context: this.httpContext })
  }

  update (folderId: number, attachmentId: number, name: string): Observable<Attachment[]> {
    const formData = new FormData()
    formData.append('name', name)
    return this.http.put<Attachment[]>(`${this.apiUrl}/folder/${folderId}/attachment/${attachmentId}/`, formData)
  }

  delete (folderId: number): Observable<Attachment[]> {
    return this.http.delete<Attachment[]>(`${this.apiUrl}/folder/${folderId}/attachment/`)
  }
}
