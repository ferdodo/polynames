import { validate } from "jsonschema";
import type { Card, Round } from "../types";
import { cardRowSchema, roundRowSchema } from "../types/row-schemas";

export function isCard(row: unknown): row is Card {
	return validate(row, cardRowSchema).valid;
}

export function isRound(row: unknown): row is Round {
	return validate(row, roundRowSchema).valid;
}

export function validateCard(row: unknown): Card {
	if (!isCard(row)) {
		throw new Error(`Invalid card row ${JSON.stringify(row)} !`);
	}

	return row;
}

export function validateRound(row: unknown): Round {
	if (!isRound(row)) {
		throw new Error(`Invalid round row ${JSON.stringify(row)} !`);
	}

	return row;
}
