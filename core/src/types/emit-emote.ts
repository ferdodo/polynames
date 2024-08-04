import { emoteSchema, gameSchema, roleSchema, signatureSchema } from "../types";
import type { Emote, PlayerRole } from "../types";

export interface EmitEmote {
	role: PlayerRole;
	game: string;
	signature: string;
	emote: Emote;
}

export const emitEmoteSchema = {
	type: "object",
	properties: {
		role: roleSchema,
		game: gameSchema,
		signature: signatureSchema,
		emote: emoteSchema,
	},
	required: ["role", "game", "signature", "emote"],
	additionalProperties: false,
} as const;
