import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { Groups } from 'src/app/models/user'
import { AuthState } from 'src/app/store/auth/auth.reducer'
import { environment } from 'src/environments/environment'
import { Md5 } from 'ts-md5'

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  userData: {
    fullname: string
    entity: string
    groups: string
    phone: string
    email: string
  }

  avatarUrl: string

  auth$: Observable<AuthState>

  constructor (store: Store<{ auth: AuthState }>) {
    this.userData = {
      fullname: '',
      entity: '',
      groups: '',
      phone: '',
      email: ''
    }
    this.avatarUrl = ''

    this.auth$ = store.select('auth')
    this.auth$.subscribe(({ profile, isLoggedIn }) => {
      this.avatarUrl = (isLoggedIn) ? `${environment.avatarUrl}/${Md5.hashStr(profile.email)}?s=95&d=identicon` : `${environment.avatarUrl}/?s=95&d=mp`
      this.userData.fullname = (isLoggedIn) ? `${profile.first_name} ${profile.last_name}` : ''
      this.userData.entity = (isLoggedIn) ? `${profile.entity}` : ''
      this.userData.groups = (isLoggedIn) ? `${profile.groups.map(e => Groups[e]).join(', ')}` : ''
      this.userData.phone = (isLoggedIn) ? `${profile.phone}` : ''
      this.userData.email = (isLoggedIn) ? `${profile.email}` : ''
    })
  }

  ngOnInit (): void {

  }
}
