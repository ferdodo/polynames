import type { Connection } from "connection-types";
import { Subject } from "rxjs";
import type { FrontContext, Message } from "../types";
import type { FrontState } from "../types";

export function createFrontContext(
	connection: Connection<Message>,
): FrontContext {
	let state: FrontState = {};

	const _state$ = new Subject<FrontState>();

	return {
		connection,
		frontStateStorage: {
			read() {
				return { ...state };
			},
			save(newState) {
				state = { ...state, ...newState };
				_state$.next(state);
			},
			observe() {
				return _state$.asObservable();
			},
		},
	};
}
