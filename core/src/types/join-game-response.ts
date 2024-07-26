import type { PlayerRole } from "./player-role";

interface JoinGameResponseSuccess {
	role: PlayerRole;
	signature: string;
}

interface JoinGameResponseError {
	gameFull: boolean;
}

export interface JoinGameResponse {
	success?: JoinGameResponseSuccess;
	error?: JoinGameResponseError;
}
