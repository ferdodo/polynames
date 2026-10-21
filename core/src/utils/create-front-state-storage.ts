import type { Observable } from "rxjs";
import { Subject } from "rxjs";
import type { FrontState, FrontStateStorage } from "../types";

export function createFrontStateStorage(): FrontStateStorage {
	let state: FrontState = {
		signature: undefined,
		role: undefined,
	};

	const _state$ = new Subject<FrontState>();

	return {
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
	};
}
