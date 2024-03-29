export interface User {
  pk: number
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
  activity: string
}

export interface ProjectPrivate {
  pk: number
  name: string
  description: string
  note: string
  kind: number
  is_closed: boolean
  is_hidden: boolean
  deadline: string
  entities: [
    {
      folder: number
      entity: Entity
      is_author: boolean
      is_accepted: boolean
      created_at: string
      updated_at: string
    }
  ]
  created_at: string
  updated_at: string
}

export interface ProjectPublic {
  pk: number
  name: string
  description: string
  kind: number
  deadline: string
  author_entity: Entity
}

export interface ProjectEntity {
  folder: ProjectPublic
  entity: number
  is_author: boolean
  is_accepted: boolean
  created_at: string
  updated_at: string
}

export interface Message {
  pk: number
  author: User
  folder: number
  content: string
  created_at: string
  updated_at: string
}

export interface Attachment {
  pk: number
  folder: number
  file: string
  name: string
  created_at: string
  updated_at: string
}
