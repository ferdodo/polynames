import { CardKind, PlayerRole } from ".";
import { Emote } from "./emote";

export const uidSchema = {
	type: "string",
	length: 36,
	pattern: "^[a-zA-Z0-9]+$",
} as const;

export const gameSchema = {
	type: "string",
	minLength: 3,
	maxLength: 50,
	pattern: "^[a-zA-Z0-9!@#$%^&*()_+]+$",
} as const;

export const wordSchema = {
	type: "string",
	minLength: 3,
	maxLength: 50,
	pattern: "^[\\p{L}]+$",
} as const;

export const kindSchema = {
	type: "string",
	enum: Object.values(CardKind),
} as const;

export const countSchema = {
	type: "integer",
	minimum: 1,
	maximum: 100,
} as const;

export const emoteSchema = {
	type: "string",
	enum: Object.values(Emote),
} as const;

export const roleSchema = {
	type: "string",
	enum: Object.values(PlayerRole),
} as const;
