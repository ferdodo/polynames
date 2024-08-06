import type { Hint } from "../types";
import { hintSchema } from "./hint";
import { countSchema, gameSchema } from "./schemas";
import { signatureSchema } from "./signature";

export interface GiveHintRequest {
	game: string;
	hint: Hint;
	count: number;
	signature: string;
}

export const giveHintRequestSchema = {
	type: "object",
	properties: {
		game: gameSchema,
		hint: hintSchema,
		count: countSchema,
		signature: signatureSchema,
	},
	required: ["game", "hint", "count", "signature"],
	additionalProperties: false,
} as const;
