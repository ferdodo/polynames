import type { Connection } from "../types/connection";
import type { Observable } from "rxjs";
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
			read(): FrontState {
				return { ...state };
			},
			save(newState: Partial<FrontState>): void {
				state = { ...state, ...newState };
				_state$.next(state);
			},
			observe(): Observable<FrontState> {
				return _state$.asObservable();
			},
		},
	};
}
