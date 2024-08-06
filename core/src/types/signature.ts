export type Signature = string;

export const signatureSchema = {
	type: "string",
	minLength: 3,
	maxLength: 300,
	pattern: "^[a-fA-F0-9]+$",
} as const;
