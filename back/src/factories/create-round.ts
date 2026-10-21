import { randomUUID } from "crypto";
import type { Round } from "core";

export function createRound(): Round {
	return {
		id: randomUUID(),
		game: randomUUID(),
		position: 1,
		count: 2,
		hint: "animal",
		skip: false,
	};
}
