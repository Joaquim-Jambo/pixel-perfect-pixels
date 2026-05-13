
type ChallengeStatus = "OPEN" | "CLOSED" | "CANCELLED"

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
}