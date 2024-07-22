import type { FromSchema } from "json-schema-to-ts";
import { validate } from "jsonschema";
import type { IncomingMessage } from "../types";
import { messageSchema } from "../types";

export function validateMessage(message: IncomingMessage): [boolean, string] {
	const { errors, valid } = validate(
		enforceConsistency(message),
		messageSchema,
		{
			required: true,
		},
	);

	return [valid, JSON.stringify(errors, null, 2)];
}

/**
 * Noop function.
 *
 * Assignations between Message and FromSchema are enforcing
 * consistency between JSON-schema and Typescript interfaces
 * at compile time. ❤️
 */
export function enforceConsistency(message: IncomingMessage): IncomingMessage {
	const messageCastedFromSchema: FromSchema<typeof messageSchema> = message;
	return messageCastedFromSchema;
}
