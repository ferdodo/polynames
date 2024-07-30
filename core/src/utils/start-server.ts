import {
	giveHintHandle,
	handGuessHandle,
	joinGameHandle,
	skipRoundHandle,
} from "../api";

import type { BackContext } from "../types";

export function startServer(context: BackContext) {
	const subscriptions = [
		joinGameHandle(context),
		giveHintHandle(context),
		handGuessHandle(context),
		skipRoundHandle(context),
	];

	return function stopServer() {
		for (const subscription of subscriptions) {
			subscription.unsubscribe();
		}
	};
}
