import type {
	BroadcastGame,
	GiveHintRequest,
	HandGuessRequest,
	JoinGameRequest,
	JoinGameResponse,
	SkipRoundRequest,
} from ".";

import { giveHintRequestSchema } from "./give-hint-request";
import { handGuessRequestSchema } from "./hand-guess-request";
import { joinGameRequestSchema } from "./join-game-request";
import { skipRoundRequestSchema } from "./skip-round-request";

export interface Message extends IncomingMessage {
	joinGameResponse?: JoinGameResponse;
	broadcastGame?: BroadcastGame;
}

export interface IncomingMessage {
	giveHintRequest?: GiveHintRequest;
	joinGameRequest?: JoinGameRequest;
	handGuessRequest?: HandGuessRequest;
	skipRoundRequest?: SkipRoundRequest;
}

export const messageSchema = {
	type: "object",
	properties: {
		giveHintRequest: giveHintRequestSchema,
		joinGameRequest: joinGameRequestSchema,
		handGuessRequest: handGuessRequestSchema,
		skipRoundRequest: skipRoundRequestSchema,
	},
	additionalProperties: false,
} as const;
