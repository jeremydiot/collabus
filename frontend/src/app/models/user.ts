export class Credentials {
  email!: string
  password!: string
}

export class Tokens {
  access!: string
  refresh!: string
}

export class User {
  id!: number
  last_login!: string // TODO Date type ?
  is_superuser!: boolean
  username!: string
  first_name!: string
  last_name!: string
  email!: string
  is_staff!: boolean
  is_active!: boolean
  date_joined!: string // TODO Date type ?
}
