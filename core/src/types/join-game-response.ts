import type { PlayerRole } from "./player-role";

export interface JoinGameResponse {
	role: PlayerRole;
	signature: string;
}
