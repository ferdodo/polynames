import {
	countSchema,
	gameSchema,
	hintSchema,
	signatureSchema,
} from "./schemas";

export interface GiveHintRequest {
	game: string;
	hint: string;
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
