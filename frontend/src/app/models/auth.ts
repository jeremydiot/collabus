export interface Credentials {
  email: string
  password: string
}

export interface Tokens {
  access: string
  refresh: string
}

export enum EntityTypes {
  standard = 0,
  ecole = 1,
  entreprise = 2
}

export interface Entity {
  pk: number
  name: string
  type: number
  address: string
  zip_code: string
  city: string
  country: string
  phone: string
  email: string
}

export interface User {
  pk: number
  last_login: string // TODO Date type ?
  is_superuser: boolean
  username: string
  first_name: string
  last_name: string
  email: string
  is_staff: boolean
  is_active: boolean
  date_joined: string // TODO Date type ?
  phone: string
  entity: Entity
}
