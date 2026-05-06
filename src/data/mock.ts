export type GameType = "5v5" | "7v7" | "11v11";
export type ChallengeStatus = "OPEN" | "CLOSED" | "CANCELLED";
export type MatchStatus = "CONFIRMED" | "CANCELLED";

export interface Challenge {
  id: string;
  team: string;
  teamColor: string;
  type: GameType;
  date: string;
  time: string;
  location: string;
  rating: number;
  status: ChallengeStatus;
  description?: string;
  pendingRequests?: number;
  mine?: boolean;
}

export interface Match {
  id: string;
  opponent: string;
  date: string;
  time: string;
  location: string;
  type: GameType;
  status: MatchStatus;
}

export const challenges: Challenge[] = [
  { id: "1", team: "Atlético Bairro", teamColor: "#FF6D00", type: "7v7", date: "Sáb, 17 Mai", time: "20:00", location: "Campo do Restelo", rating: 4.7, status: "OPEN" },
  { id: "2", team: "FC Sintra Wolves", teamColor: "#00E676", type: "5v5", date: "Dom, 18 Mai", time: "10:30", location: "Pavilhão Central", rating: 4.2, status: "OPEN" },
  { id: "3", team: "Olímpico Norte", teamColor: "#2979FF", type: "11v11", date: "Sáb, 24 Mai", time: "16:00", location: "Estádio Municipal", rating: 4.9, status: "OPEN" },
  { id: "4", team: "Real Marvila", teamColor: "#E91E63", type: "5v5", date: "Sex, 23 Mai", time: "21:00", location: "Soccer Park Lisboa", rating: 3.8, status: "OPEN" },
  { id: "5", team: "Costa do Sol", teamColor: "#FFD600", type: "7v7", date: "Sáb, 24 Mai", time: "18:30", location: "Campo da Trafaria", rating: 4.5, status: "OPEN" },
];

export const myChallenges: Challenge[] = [
  { id: "m1", team: "Onze United", teamColor: "#00E676", type: "7v7", date: "Sáb, 17 Mai", time: "19:00", location: "Campo do Restelo", rating: 4.6, status: "OPEN", pendingRequests: 3, mine: true },
  { id: "m2", team: "Onze United", teamColor: "#00E676", type: "5v5", date: "Qua, 14 Mai", time: "20:30", location: "Soccer Park", rating: 4.6, status: "CLOSED", mine: true },
];

export const myMatches: Match[] = [
  { id: "g1", opponent: "FC Sintra Wolves", date: "Dom, 18 Mai", time: "10:30", location: "Pavilhão Central", type: "5v5", status: "CONFIRMED" },
  { id: "g2", opponent: "Atlético Bairro", date: "Sáb, 10 Mai", time: "20:00", location: "Campo do Restelo", type: "7v7", status: "CONFIRMED" },
];

export interface Notification {
  id: string;
  type: "REQUEST_RECEIVED" | "REQUEST_ACCEPTED" | "REQUEST_REJECTED" | "MATCH_CONFIRMED";
  title: string;
  body: string;
  time: string;
  unread: boolean;
}

export const notifications: Notification[] = [
  { id: "n1", type: "REQUEST_RECEIVED", title: "Novo pedido", body: "Atlético Bairro quer jogar contigo", time: "agora", unread: true },
  { id: "n2", type: "MATCH_CONFIRMED", title: "Jogo confirmado", body: "FC Sintra Wolves — Dom 10:30", time: "2h", unread: true },
  { id: "n3", type: "REQUEST_ACCEPTED", title: "Pedido aceite", body: "Real Marvila aceitou o teu pedido", time: "ontem", unread: false },
  { id: "n4", type: "REQUEST_REJECTED", title: "Pedido rejeitado", body: "Costa do Sol rejeitou o teu pedido", time: "2 dias", unread: false },
];

export interface Request {
  id: string;
  team: string;
  teamColor: string;
  rating: number;
  date: string;
}

export const requests: Request[] = [
  { id: "r1", team: "Atlético Bairro", teamColor: "#FF6D00", rating: 4.7, date: "há 2h" },
  { id: "r2", team: "Lobos do Tejo", teamColor: "#9C27B0", rating: 4.1, date: "há 5h" },
  { id: "r3", team: "Olímpico Norte", teamColor: "#2979FF", rating: 4.9, date: "ontem" },
];
