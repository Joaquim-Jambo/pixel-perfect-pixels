
type ChallengeStatus = "OPEN" | "CLOSED" | "CANCELLED"

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
  team?: {
    name?: string
    emblemUrl?: string | null
    [key: string]: any
  } | null
}