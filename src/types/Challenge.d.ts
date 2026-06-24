type ChallengeStatus = "OPEN" | "CLOSED" | "CANCELLED"

export type NotificationType = "REQUEST_RECEIVED" | "REQUEST_ACCEPTED" | "REQUEST_REJECTED" | "MATCH_CONFIRMED"

export type AppNotification = {
  id: string
  type: NotificationType
  title: string
  body: string
  read: boolean
  createdAt: string
  resourceId?: string | null
  resourceType?: string | null
}

export type ChallengeRequestStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED"

export type ChallengeTeam = {
  id: string
  name?: string
  province?: string | null
  emblemUrl?: string | null
  ownerRole?: string | null
  rating?: number | null
  [key: string]: unknown
}

export type ChallengeRequest = {
  id: string
  teamId: string
  challengeId: string
  status: ChallengeRequestStatus
  createdAt?: string | Date | null
  updatedAt?: string | Date | null
  team?: ChallengeTeam | null
}

export type ChallengeMatch = {
  id: string
  challengeId: string
  homeTeamId: string
  awayTeamId: string
  status: "CONFIRMED" | "CANCELLED"
  awayTeam?: ChallengeTeam | null
  homeTeam?: ChallengeTeam | null
}

export type Challenge = {
  id: string | null
  teamId: string
  title: string | null
  description: string | null
  location: string | null
  latitude: number | null
  longitude: number | null
  gameType: "5v5" | "7v7" | "11v11"
  province: string | null
  scheduledAt: Date
  status: ChallengeStatus
  createdAt: Date | null
  updatedAt: Date | null
  team?: ChallengeTeam | null
  match?: ChallengeMatch | null
}