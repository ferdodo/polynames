import type {
	BroadcastEmote,
	BroadcastGame,
	EmitEmote,
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
	emitEmote?: EmitEmote;
}

export const messageSchema = {
	type: "object",
	properties: {
		giveHintRequest: giveHintRequestSchema,
		joinGameRequest: joinGameRequestSchema,
		handGuessRequest: handGuessRequestSchema,
		skipRoundRequest: skipRoundRequestSchema,
		broadcastEmote: BroadcastEmote,
	},
	additionalProperties: false,
} as const;
