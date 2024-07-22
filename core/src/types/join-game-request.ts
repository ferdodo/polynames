import { gameSchema } from "./schemas";

export interface JoinGameRequest {
	game: string;
}

export const joinGameRequestSchema = {
	type: "object",
	properties: {
		game: gameSchema,
	},
	required: ["game"],
	additionalProperties: false,
} as const;
