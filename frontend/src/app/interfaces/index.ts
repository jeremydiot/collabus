export interface User {
  last_login: string
  username: string
  email: string
  phone: string
  first_name: string
  last_name: string
  is_entity_staff: boolean
  date_joined: string
  entity: Entity
}

export interface Entity {
  pk: number
  name: string
  kind: number
  address: string
  zip_code: string
  city: string
  country: string
  phone: string
  email: string
}

// TODO delete folowing interfaces

export interface Project {
  pk: number
  name: string
  description: string
  note: string
  type: number
  is_closed: boolean
  is_hidden: boolean
  deadline: string
  entity: [
    {
      folder: number
      entity: Entity
      is_author: boolean
    }
  ]
  created_at: string
  updated_at: string
}
