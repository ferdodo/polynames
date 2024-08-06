export type Hint = string;

export const hintSchema = {
	type: "string",
	minLength: 3,
	maxLength: 50,
	pattern: "^[\\p{L}]+$",
} as const;
