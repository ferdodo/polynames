import { giveHintHandle, handGuessHandle, joinGameHandle } from "../api";

import type { BackContext } from "../types";

export function startServer(context: BackContext) {
	const subscriptions = [
		joinGameHandle(context),
		giveHintHandle(context),
		handGuessHandle(context),
	];

	return function stopServer() {
		for (const subscription of subscriptions) {
			subscription.unsubscribe();
		}
	};
}
