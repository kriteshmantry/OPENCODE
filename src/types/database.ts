export interface Project {
  id?: string
  name: string
  desc: string
  tags: string[]
  stars: number
  lang: string
  langColor: string
  url: string
  live_url?: string
  author?: string
  created_at?: string
}

export interface ClubApplication {
  id?: string
  full_name: string
  email: string
  handle?: string // Discord / Telegram / Matrix
  github_url?: string
  role_interest: string
  experience_level: string
  skills?: string[]
  statement: string
  status?: 'pending' | 'reviewed' | 'accepted' | 'rejected'
  created_at?: string
}

export type NewProjectInput = Omit<Project, 'id' | 'created_at'>
export type NewApplicationInput = Omit<ClubApplication, 'id' | 'status' | 'created_at'>
