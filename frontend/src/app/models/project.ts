import { Entity } from './auth'

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
