import { asConst } from "json-schema-to-ts";

import type {
	BroadcastEmote,
	BroadcastGame,
	EmitEmote,
	GiveHintRequest,
	HandGuessRequest,
	JoinGameRequest,
	JoinGameResponse,
	SkipRoundRequest,
} from "../types";

import { emitEmoteSchema } from "./emit-emote";
import { giveHintRequestSchema } from "./give-hint-request";
import { handGuessRequestSchema } from "./hand-guess-request";
import { joinGameRequestSchema } from "./join-game-request";
import { skipRoundRequestSchema } from "./skip-round-request";

export interface Message extends IncomingMessage {
	joinGameResponse?: JoinGameResponse;
	broadcastGame?: BroadcastGame;
	broadcastEmote?: BroadcastEmote;
}

export interface IncomingMessage {
	giveHintRequest?: GiveHintRequest;
	joinGameRequest?: JoinGameRequest;
	handGuessRequest?: HandGuessRequest;
	skipRoundRequest?: SkipRoundRequest;
	emitEmote?: EmitEmote;
}

export const messageSchema = asConst({
	type: "object",
	properties: {
		giveHintRequest: asConst(giveHintRequestSchema),
		joinGameRequest: joinGameRequestSchema,
		handGuessRequest: handGuessRequestSchema,
		skipRoundRequest: skipRoundRequestSchema,
		emitEmoteSchema: emitEmoteSchema,
	},
	additionalProperties: false,
});
