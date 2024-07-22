import type { Observable } from "rxjs";
import type { FrontState } from "./front-state";

export interface FrontStateStorage {
	read(): FrontState;
	save(state: Partial<FrontState>): void;
	observe(): Observable<FrontState>;
}
