import type { Card } from ".";
import {
	gameSchema,
	kindSchema,
	signatureSchema,
	uidSchema,
	wordSchema,
} from "./schemas";

export interface HandGuessRequest {
	cards: Partial<Card>[];
	game: string;
	signature: string;
}

export const handGuessRequestSchema = {
	type: "object",
	properties: {
		cards: {
			type: "array",
			items: {
				type: "object",
				properties: {
					id: uidSchema,
					word: wordSchema,
					game: gameSchema,
					kind: kindSchema,
				},
				required: [],
				additionalProperties: false,
			},
			minItems: 1,
			maxItems: 1,
		},
		game: gameSchema,
		signature: signatureSchema,
	},
	required: ["cards", "game", "signature"],
	additionalProperties: false,
} as const;
