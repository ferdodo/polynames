import { asConst } from "json-schema-to-ts";
import { kindSchema } from "./schemas";

export const cardRowSchema = asConst({
	type: "object",
	properties: {
		id: { type: "string" },
		game: { type: "string" },
		word: { type: "string" },
		kind: kindSchema,
	},
	required: ["id", "game", "word", "kind"],
});

export const roundRowSchema = asConst({
	type: "object",
	properties: {
		id: { type: "string" },
		game: { type: "string" },
		position: { type: "integer" },
		count: { type: "integer" },
		hint: { type: "string" },
		skip: { type: "boolean" },
		cards: {
			type: "array",
			items: cardRowSchema,
		},
	},
	required: ["id", "game", "position", "count", "hint", "skip"],
});
