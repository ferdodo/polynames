import { gameSchema, signatureSchema } from "./schemas";

export interface SkipRoundRequest {
	game: string;
	signature: string;
}

export const skipRoundRequestSchema = {
	type: "object",
	properties: {
		game: gameSchema,
		signature: signatureSchema,
	},
	required: ["game", "signature"],
	additionalProperties: false,
} as const;
