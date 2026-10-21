import { emoteSchema, gameSchema, roleSchema } from "./schemas";
import { signatureSchema } from "./signature";
import type { Emote } from "./emote";
import type { PlayerRole } from "./player-role";

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
