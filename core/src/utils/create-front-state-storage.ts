import { Subject } from "rxjs";
import type { FrontState, FrontStateStorage } from "../types";

export function createFrontStateStorage(): FrontStateStorage {
	let state: FrontState = {
		signature: undefined,
		role: undefined,
	};

	const _state$ = new Subject<FrontState>();

	return {
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
	};
}
