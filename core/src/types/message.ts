import type {
	BroadcastGame,
	GiveHintRequest,
	HandGuessRequest,
	JoinGameRequest,
	JoinGameResponse,
} from ".";

import { giveHintRequestSchema } from "./give-hint-request";
import { handGuessRequestSchema } from "./hand-guess-request";
import { joinGameRequestSchema } from "./join-game-request";

export interface Message extends IncomingMessage {
	joinGameResponse?: JoinGameResponse;
	broadcastGame?: BroadcastGame;
}

export interface IncomingMessage {
	giveHintRequest?: GiveHintRequest;
	joinGameRequest?: JoinGameRequest;
	handGuessRequest?: HandGuessRequest;
}

export const messageSchema = {
	type: "object",
	properties: {
		giveHintRequest: giveHintRequestSchema,
		joinGameRequest: joinGameRequestSchema,
		handGuessRequest: handGuessRequestSchema,
	},
	additionalProperties: false,
} as const;
