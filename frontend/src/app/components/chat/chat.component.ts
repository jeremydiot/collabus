import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { Store } from '@ngrx/store'
import { Subscription } from 'rxjs'
import { Message } from 'src/app/interfaces'
import { AuthState } from 'src/app/store/auth/auth.reducer'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  @Input() projectId?: number
  currentUserId?: number
  websocket?: WebSocket
  messages: Message[] = []
  subscription?: Subscription

  formGroup = new FormGroup({
    message: new FormControl('', { nonNullable: true })
  })

  @ViewChild('messageWrapper') messageWrapperElement!: ElementRef

  constructor (
    private readonly store: Store<{ 'auth': AuthState }>
  ) {

  }

  ngOnInit (): void {
    this.subscription = this.store.select('auth').subscribe(authState => {
      if (this.projectId !== undefined && authState.user !== undefined) {
        this.currentUserId = authState.user.pk
        this.websocket = new WebSocket(`${environment.backendWebsocketChat}folder/${this.projectId}/?token=${authState.accessToken}`)

        this.websocket.onmessage = (e: MessageEvent<string>) => {
          const data = JSON.parse(e.data)
          if (data.messages !== undefined) {
            this.messages = data.messages
            this.messages.reverse()
          } else if (data.message !== undefined) {
            this.messages.unshift(data.message)
          }
          if (this.messageWrapperElement !== undefined) {
            const element = this.messageWrapperElement.nativeElement as HTMLElement
            element.scroll({ top: 0, left: 0 })
          }
        }
      }
    })
  }

  ngOnDestroy (): void {
    if (this.subscription !== undefined) this.subscription.unsubscribe()
  }

  parseDate (stringDate: string | undefined): string {
    if (stringDate !== undefined) {
      const date = new Date(stringDate)
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
    }
    return ''
  }

  onSubmit (): void {
    const value = this.formGroup.controls.message.value
    if (value !== '' && this.websocket !== undefined) {
      this.websocket.send(JSON.stringify({ message: value }))
      this.formGroup.controls.message.setValue('')
    }
  }

  deleteMessage (messageId: number): void {
    if (this.websocket !== undefined) this.websocket.send(JSON.stringify({ delete: messageId }))
  }
}
