export class Credentials {
  email!: string
  password!: string
}

export class Tokens {
  access!: string
  refresh!: string
}

export enum Groups {
  School = 1,
  Company = 2
}

export class User {
  id!: number
  last_login!: string // TODO Date type ?
  is_superuser!: boolean
  username!: string
  phone!: string
  entity!: string
  first_name!: string
  last_name!: string
  email!: string
  is_staff!: boolean
  is_active!: boolean
  date_joined!: string // TODO Date type ?
  groups!: number[] // TODO Date type ?
}
