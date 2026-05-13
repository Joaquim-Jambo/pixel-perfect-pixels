import { api } from "@/lib/api";
import type { ChallengeRequest } from "@/types/Challenge";

export const getChallengeRequests = async (challengeId: string) => {
  const response = await api.get<ChallengeRequest[]>(`/challenges/${challengeId}/requests`);
  return response.data;
};

export const joinChallenge = async (challengeId: string, teamId: string) => {
  const response = await api.post<ChallengeRequest>(`/challenges/${challengeId}/requests`, {
    teamId,
  });

  return response.data;
};

export const leaveChallenge = async (challengeId: string, teamId: string) => {
  const response = await api.delete<ChallengeRequest>(`/challenges/${challengeId}/requests`, {
    data: {
      teamId,
    },
  });

  return response.data;
};