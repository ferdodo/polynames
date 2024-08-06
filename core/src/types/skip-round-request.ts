import { gameSchema } from "./schemas";
import { type Signature, signatureSchema } from "./signature";

export interface SkipRoundRequest {
	game: string;
	signature: Signature;
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
